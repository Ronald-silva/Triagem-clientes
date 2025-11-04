const form = document.getElementById("triagemForm");
const resultadoDiv = document.getElementById("resultado");

// ===== SISTEMA DE RANKING DE LEADS =====

// Classe para gerenciar persistência no LocalStorage
class LeadStorage {
  constructor() {
    this.storageKey = "leadRankingData";
    this.isAvailable = this.checkLocalStorageAvailability();
  }

  checkLocalStorageAvailability() {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn("LocalStorage não disponível:", e);
      return false;
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  validateLead(name, score) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new Error("Nome da empresa é obrigatório");
    }
    if (name.trim().length > 100) {
      throw new Error("Nome da empresa deve ter no máximo 100 caracteres");
    }
    if (!score || typeof score !== "number" || score < 10 || score > 30) {
      throw new Error("Pontuação deve estar entre 10 e 30");
    }
    return true;
  }

  saveLead(name, score) {
    try {
      this.validateLead(name, score);

      if (!this.isAvailable) {
        throw new Error("Armazenamento local não disponível");
      }

      const lead = {
        id: this.generateId(),
        name: name.trim(),
        score: score,
        date: new Date().toISOString(),
        timestamp: Date.now(),
      };

      const leads = this.getAllLeads();
      leads.push(lead);

      localStorage.setItem(this.storageKey, JSON.stringify(leads));
      return lead;
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
      throw error;
    }
  }

  getAllLeads() {
    try {
      if (!this.isAvailable) {
        return [];
      }

      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Erro ao recuperar leads:", error);
      return [];
    }
  }

  clearAllLeads() {
    try {
      if (!this.isAvailable) {
        throw new Error("Armazenamento local não disponível");
      }

      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error("Erro ao limpar leads:", error);
      throw error;
    }
  }

  hasData() {
    return this.getAllLeads().length > 0;
  }
}

// Classe para gerenciar lógica de ordenação e filtragem
class RankingManager {
  constructor() {
    this.priorityThresholds = {
      alta: 25,
      media: 15,
    };
  }

  sortLeads(leads) {
    return [...leads].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.timestamp - a.timestamp;
    });
  }

  filterLeads(leads, searchTerm) {
    if (!searchTerm || searchTerm.trim() === "") {
      return leads;
    }

    const term = searchTerm.toLowerCase().trim();
    return leads.filter((lead) => lead.name.toLowerCase().includes(term));
  }

  calculateStats(leads) {
    if (leads.length === 0) {
      return {
        totalLeads: 0,
        averageScore: 0,
        highPriorityCount: 0,
        mediumPriorityCount: 0,
        lowPriorityCount: 0,
      };
    }

    const totalScore = leads.reduce((sum, lead) => sum + lead.score, 0);
    const averageScore = Math.round((totalScore / leads.length) * 10) / 10;

    const highPriorityCount = leads.filter(
      (lead) => lead.score >= this.priorityThresholds.alta
    ).length;
    const mediumPriorityCount = leads.filter(
      (lead) =>
        lead.score >= this.priorityThresholds.media &&
        lead.score < this.priorityThresholds.alta
    ).length;
    const lowPriorityCount = leads.filter(
      (lead) => lead.score < this.priorityThresholds.media
    ).length;

    return {
      totalLeads: leads.length,
      averageScore,
      highPriorityCount,
      mediumPriorityCount,
      lowPriorityCount,
    };
  }

  getPriorityClass(score) {
    if (score >= this.priorityThresholds.alta) return "alta";
    if (score >= this.priorityThresholds.media) return "media";
    return "baixa";
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// Classe para gerenciar interface do ranking
class UIManager {
  constructor(rankingManager) {
    this.rankingManager = rankingManager;
    this.elements = {};
  }

  initElements() {
    this.elements = {
      nameModal: document.getElementById("nameInputModal"),
      companyNameInput: document.getElementById("companyName"),
      saveButton: document.getElementById("saveResult"),
      cancelButton: document.getElementById("cancelSave"),
      confirmModal: document.getElementById("confirmModal"),
      confirmClearButton: document.getElementById("confirmClear"),
      cancelClearButton: document.getElementById("cancelClear"),
      searchInput: document.getElementById("searchInput"),
      refreshButton: document.getElementById("refreshRanking"),
      clearButton: document.getElementById("clearHistory"),
      exportButton: document.getElementById("exportCSV"),
      statsSection: document.getElementById("statsSection"),
      emptyState: document.getElementById("emptyState"),
      rankingTable: document.getElementById("rankingTable"),
    };
  }

  showNameInputModal(score, callback) {
    if (!this.elements.nameModal) return;

    this.elements.companyNameInput.value = "";
    this.elements.nameModal.style.display = "block";
    this.elements.companyNameInput.focus();

    const newSaveButton = this.elements.saveButton.cloneNode(true);
    const newCancelButton = this.elements.cancelButton.cloneNode(true);
    this.elements.saveButton.parentNode.replaceChild(
      newSaveButton,
      this.elements.saveButton
    );
    this.elements.cancelButton.parentNode.replaceChild(
      newCancelButton,
      this.elements.cancelButton
    );
    this.elements.saveButton = newSaveButton;
    this.elements.cancelButton = newCancelButton;

    this.elements.saveButton.addEventListener("click", () => {
      const name = this.elements.companyNameInput.value.trim();
      if (name) {
        this.hideNameInputModal();
        callback(name);
      } else {
        this.showError("Por favor, digite o nome da empresa");
      }
    });

    this.elements.cancelButton.addEventListener("click", () => {
      this.hideNameInputModal();
    });

    this.elements.companyNameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.elements.saveButton.click();
      } else if (e.key === "Escape") {
        this.elements.cancelButton.click();
      }
    });
  }

  hideNameInputModal() {
    if (this.elements.nameModal) {
      this.elements.nameModal.style.display = "none";
    }
  }

  showConfirmModal(callback) {
    if (!this.elements.confirmModal) return;

    this.elements.confirmModal.style.display = "block";

    const newConfirmButton = this.elements.confirmClearButton.cloneNode(true);
    const newCancelClearButton =
      this.elements.cancelClearButton.cloneNode(true);
    this.elements.confirmClearButton.parentNode.replaceChild(
      newConfirmButton,
      this.elements.confirmClearButton
    );
    this.elements.cancelClearButton.parentNode.replaceChild(
      newCancelClearButton,
      this.elements.cancelClearButton
    );
    this.elements.confirmClearButton = newConfirmButton;
    this.elements.cancelClearButton = newCancelClearButton;

    this.elements.confirmClearButton.addEventListener("click", () => {
      this.hideConfirmModal();
      callback();
    });

    this.elements.cancelClearButton.addEventListener("click", () => {
      this.hideConfirmModal();
    });
  }

  hideConfirmModal() {
    if (this.elements.confirmModal) {
      this.elements.confirmModal.style.display = "none";
    }
  }

  renderStats(stats) {
    if (!this.elements.statsSection) return;

    if (stats.totalLeads === 0) {
      this.elements.statsSection.style.display = "none";
      return;
    }

    this.elements.statsSection.innerHTML = `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${stats.totalLeads}</div>
          <div class="stat-label">Total de Leads</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.averageScore}</div>
          <div class="stat-label">Média Geral</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.highPriorityCount}</div>
          <div class="stat-label">Alta Prioridade</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.mediumPriorityCount}</div>
          <div class="stat-label">Média Prioridade</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.lowPriorityCount}</div>
          <div class="stat-label">Baixa Prioridade</div>
        </div>
      </div>
    `;
    this.elements.statsSection.style.display = "block";
  }

  renderRankingTable(leads) {
    if (!this.elements.emptyState || !this.elements.rankingTable) return;

    if (leads.length === 0) {
      this.elements.emptyState.style.display = "block";
      this.elements.rankingTable.style.display = "none";
      return;
    }

    this.elements.emptyState.style.display = "none";
    this.elements.rankingTable.style.display = "block";

    const tableHTML = `
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Nome da Empresa</th>
            <th>Pontuação</th>
            <th>Data da Triagem</th>
          </tr>
        </thead>
        <tbody>
          ${leads
            .map(
              (lead, index) => `
            <tr>
              <td class="position-cell">${index + 1}º</td>
              <td>${this.escapeHtml(lead.name)}</td>
              <td class="score-cell score-${this.rankingManager.getPriorityClass(
                lead.score
              )}">${lead.score}</td>
              <td class="date-cell">${this.rankingManager.formatDate(
                lead.date
              )}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;

    this.elements.rankingTable.innerHTML = tableHTML;
  }

  showSuccess(message) {
    this.showMessage(message, "success");
  }

  showError(message) {
    this.showMessage(message, "error");
  }

  showMessage(message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1001;
      background-color: ${type === "success" ? "#10b981" : "#ef4444"};
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Classe para gerenciar busca em tempo real
class SearchManager {
  constructor(rankingManager, uiManager) {
    this.rankingManager = rankingManager;
    this.uiManager = uiManager;
    this.debounceTimer = null;
    this.allLeads = [];
  }

  setupSearch(searchInput) {
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });
  }

  performSearch(searchTerm) {
    const filteredLeads = this.rankingManager.filterLeads(
      this.allLeads,
      searchTerm
    );
    const sortedLeads = this.rankingManager.sortLeads(filteredLeads);

    this.uiManager.renderRankingTable(sortedLeads);

    const stats = this.rankingManager.calculateStats(filteredLeads);
    this.uiManager.renderStats(stats);
  }

  updateLeads(leads) {
    this.allLeads = leads;
  }

  clearSearch() {
    if (this.uiManager.elements.searchInput) {
      this.uiManager.elements.searchInput.value = "";
    }
  }
}

// Classe para gerenciar exportação de dados
class ExportManager {
  constructor(rankingManager) {
    this.rankingManager = rankingManager;
  }

  exportToCSV(leads) {
    if (leads.length === 0) {
      throw new Error("Não há dados para exportar");
    }

    const sortedLeads = this.rankingManager.sortLeads(leads);
    const headers = [
      "Posição",
      "Nome da Empresa",
      "Pontuação",
      "Classificação",
      "Data da Triagem",
    ];

    const csvData = sortedLeads.map((lead, index) => {
      const position = index + 1;
      const name = this.escapeCsvField(lead.name);
      const score = lead.score;
      const classification = this.getClassificationText(lead.score);
      const date = this.rankingManager.formatDate(lead.date);

      return [position, name, score, classification, date];
    });

    const allRows = [headers, ...csvData];
    const csvContent = allRows
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const csvWithBOM = "\uFEFF" + csvContent;
    this.downloadCSV(csvWithBOM);
  }

  escapeCsvField(field) {
    return String(field).replace(/"/g, '""');
  }

  getClassificationText(score) {
    if (score >= 25) return "Alta Prioridade";
    if (score >= 20) return "Média Prioridade";
    if (score >= 15) return "Baixa Prioridade";
    return "Não Priorizar";
  }

  downloadCSV(csvContent) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `ranking-leads-${this.getDateString()}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error("Download não suportado neste navegador");
    }
  }

  getDateString() {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }
}

// Classe principal do sistema de ranking
class LeadRankingSystem {
  constructor() {
    this.storage = new LeadStorage();
    this.rankingManager = new RankingManager();
    this.uiManager = new UIManager(this.rankingManager);
    this.searchManager = new SearchManager(this.rankingManager, this.uiManager);
    this.exportManager = new ExportManager(this.rankingManager);

    this.currentScore = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.uiManager.initElements();
    this.setupEventListeners();
    this.loadAndDisplayData();
    this.isInitialized = true;
  }

  setupEventListeners() {
    this.searchManager.setupSearch(this.uiManager.elements.searchInput);

    if (this.uiManager.elements.refreshButton) {
      this.uiManager.elements.refreshButton.addEventListener("click", () => {
        this.refreshRanking();
      });
    }

    if (this.uiManager.elements.clearButton) {
      this.uiManager.elements.clearButton.addEventListener("click", () => {
        this.showClearConfirmation();
      });
    }

    if (this.uiManager.elements.exportButton) {
      this.uiManager.elements.exportButton.addEventListener("click", () => {
        this.exportData();
      });
    }

    window.addEventListener("click", (e) => {
      if (e.target === this.uiManager.elements.nameModal) {
        this.uiManager.hideNameInputModal();
      }
      if (e.target === this.uiManager.elements.confirmModal) {
        this.uiManager.hideConfirmModal();
      }
    });
  }

  loadAndDisplayData() {
    const leads = this.storage.getAllLeads();
    this.updateDisplay(leads);
  }

  updateDisplay(leads) {
    const sortedLeads = this.rankingManager.sortLeads(leads);
    const stats = this.rankingManager.calculateStats(sortedLeads);

    this.searchManager.updateLeads(sortedLeads);
    this.uiManager.renderRankingTable(sortedLeads);
    this.uiManager.renderStats(stats);
  }

  saveAnalysisResult(score) {
    this.currentScore = score;
    this.uiManager.showNameInputModal(score, (companyName) => {
      try {
        this.storage.saveLead(companyName, score);
        this.uiManager.showSuccess(`✅ ${companyName} salvo no ranking!`);
        this.loadAndDisplayData();
        this.searchManager.clearSearch();

        setTimeout(() => {
          switchToTab("ranking");
        }, 1000);
      } catch (error) {
        this.uiManager.showError(`❌ Erro ao salvar: ${error.message}`);
      }
    });
  }

  refreshRanking() {
    try {
      this.loadAndDisplayData();
      this.searchManager.clearSearch();
      this.uiManager.showSuccess("🔄 Ranking atualizado!");
    } catch (error) {
      this.uiManager.showError(`❌ Erro ao atualizar: ${error.message}`);
    }
  }

  showClearConfirmation() {
    if (!this.storage.hasData()) {
      this.uiManager.showError("❌ Não há dados para limpar");
      return;
    }

    this.uiManager.showConfirmModal(() => {
      this.clearAllData();
    });
  }

  clearAllData() {
    try {
      this.storage.clearAllLeads();
      this.loadAndDisplayData();
      this.searchManager.clearSearch();
      this.uiManager.showSuccess("🗑️ Histórico limpo com sucesso!");
    } catch (error) {
      this.uiManager.showError(`❌ Erro ao limpar: ${error.message}`);
    }
  }

  exportData() {
    try {
      const leads = this.storage.getAllLeads();
      if (leads.length === 0) {
        this.uiManager.showError("❌ Não há dados para exportar");
        return;
      }

      this.exportManager.exportToCSV(leads);
      this.uiManager.showSuccess("📊 Dados exportados com sucesso!");
    } catch (error) {
      this.uiManager.showError(`❌ Erro ao exportar: ${error.message}`);
    }
  }
}

// Instância global do sistema de ranking
const leadRankingSystem = new LeadRankingSystem();

// ===== FORMULÁRIO DE TRIAGEM =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const respostas = Array.from(form.querySelectorAll("select")).map((s) =>
    parseInt(s.value)
  );
  const total = respostas.reduce((acc, val) => acc + val, 0);

  let classificacao = "";
  let classe = "";

  if (total >= 25) {
    classificacao =
      "🚀 ALTA PRIORIDADE - Prospect ideal para abordagem imediata";
    classe = "alta";
  } else if (total >= 20) {
    classificacao = "⚖️ MÉDIA PRIORIDADE - Bom potencial, vale investir tempo";
    classe = "media";
  } else if (total >= 15) {
    classificacao = "⚠️ BAIXA PRIORIDADE - Considerar apenas se sobrar tempo";
    classe = "media";
  } else {
    classificacao = "❌ NÃO PRIORIZAR - Focar em prospects melhores";
    classe = "baixa";
  }

  resultadoDiv.innerHTML = `
    <h3>Resultado da Avaliação</h3>
    <p><strong>Pontuação total:</strong> ${total}</p>
    <p><strong>Classificação:</strong> ${classificacao}</p>
    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: center; flex-wrap: wrap;">
      <button id="saveToRanking" class="btn-primary" style="flex: 1; min-width: 200px;">
        💾 Salvar no Ranking
      </button>
      <button id="viewRanking" class="btn-secondary" style="flex: 1; min-width: 200px;">
        📊 Ver Ranking
      </button>
    </div>
  `;
  resultadoDiv.className = `resultado ${classe}`;
  resultadoDiv.style.display = "block";

  const saveButton = document.getElementById("saveToRanking");
  const viewButton = document.getElementById("viewRanking");

  saveButton.addEventListener("click", () => {
    leadRankingSystem.saveAnalysisResult(total);
  });

  viewButton.addEventListener("click", () => {
    switchToTab("ranking");
  });
});

// ===== SISTEMA DE NAVEGAÇÃO POR ABAS =====
function switchToTab(tabName) {
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.getElementById(tabName + "Tab").classList.add("active");
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  if (tabName === "ranking") {
    leadRankingSystem.loadAndDisplayData();
  }
}

function setupTabNavigation() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab");
      switchToTab(tabName);
    });
  });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  setupTabNavigation();

  setTimeout(() => {
    leadRankingSystem.init();
  }, 100);
});
