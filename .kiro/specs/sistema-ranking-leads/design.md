# Design Document

## Overview

O sistema de ranking de leads será implementado como uma extensão do formulário de triagem existente, adicionando funcionalidades de persistência, visualização e gerenciamento de dados sem alterar a funcionalidade atual. A arquitetura seguirá o padrão de separação de responsabilidades, mantendo a lógica de triagem isolada da lógica de ranking.

## Architecture

### Componentes Principais

1. **LeadStorage** - Gerencia persistência no LocalStorage
2. **RankingManager** - Controla lógica de ordenação e filtragem
3. **UIManager** - Gerencia interface do ranking
4. **ExportManager** - Controla exportação de dados
5. **FormIntegration** - Integra com o formulário existente

### Fluxo de Dados

```
Formulário Existente → Resultado → Input Nome → LeadStorage → RankingManager → UIManager
                                                     ↓
                                            LocalStorage ← → ExportManager
```

## Components and Interfaces

### LeadStorage Interface

```javascript
class LeadStorage {
  // Salva um novo lead
  saveLead(name, score, date)
  
  // Recupera todos os leads
  getAllLeads()
  
  // Remove todos os leads
  clearAllLeads()
  
  // Verifica se há dados salvos
  hasData()
}
```

### RankingManager Interface

```javascript
class RankingManager {
  // Ordena leads por pontuação (desc) e data (desc)
  sortLeads(leads)
  
  // Filtra leads por nome
  filterLeads(leads, searchTerm)
  
  // Calcula estatísticas
  calculateStats(leads)
}
```

### UIManager Interface

```javascript
class UIManager {
  // Renderiza a tabela de ranking
  renderRankingTable(leads)
  
  // Renderiza controles (botões, busca)
  renderControls()
  
  // Exibe modal para input do nome
  showNameInputModal(score, callback)
  
  // Atualiza estatísticas na tela
  updateStats(stats)
}
```

## Data Models

### Lead Model

```javascript
{
  id: string,           // UUID único
  name: string,         // Nome da empresa
  score: number,        // Pontuação (10-30)
  date: string,         // ISO date string
  timestamp: number     // Unix timestamp para ordenação
}
```

### Stats Model

```javascript
{
  totalLeads: number,
  averageScore: number,
  highPriorityCount: number,
  mediumPriorityCount: number,
  lowPriorityCount: number
}
```

## Error Handling

### LocalStorage Errors
- Verificação de disponibilidade do LocalStorage
- Tratamento de quota exceeded
- Fallback para dados em memória se necessário

### Validation Errors
- Validação de nome da empresa (não vazio, máximo 100 caracteres)
- Validação de pontuação (10-30)
- Sanitização de dados de entrada

### UI Errors
- Mensagens de erro amigáveis
- Estados de loading durante operações
- Confirmações para ações destrutivas

## Testing Strategy

### Unit Tests
- LeadStorage: CRUD operations, error handling
- RankingManager: sorting, filtering, statistics
- UIManager: rendering, event handling
- ExportManager: CSV generation, data formatting

### Integration Tests
- Fluxo completo: triagem → salvamento → visualização
- Persistência entre sessões
- Responsividade em diferentes tamanhos de tela

### Manual Tests
- Teste em diferentes navegadores
- Teste de usabilidade em dispositivos móveis
- Teste de performance com grandes volumes de dados

## Implementation Details

### HTML Structure Addition

```html
<!-- Modal para input do nome -->
<div id="nameInputModal" class="modal">
  <div class="modal-content">
    <h3>Salvar Resultado</h3>
    <input type="text" id="companyName" placeholder="Nome da empresa">
    <div class="modal-buttons">
      <button id="saveResult">Salvar</button>
      <button id="cancelSave">Cancelar</button>
    </div>
  </div>
</div>

<!-- Seção do ranking -->
<div id="rankingSection" class="ranking-section">
  <h2>📊 Ranking de Leads</h2>
  
  <!-- Controles -->
  <div class="ranking-controls">
    <input type="text" id="searchInput" placeholder="Buscar empresa...">
    <div class="control-buttons">
      <button id="refreshRanking">🔄 Atualizar</button>
      <button id="clearHistory">🗑️ Limpar Histórico</button>
      <button id="exportCSV">📊 Exportar CSV</button>
    </div>
  </div>
  
  <!-- Estatísticas -->
  <div id="statsSection" class="stats-section"></div>
  
  <!-- Tabela -->
  <div id="rankingTable" class="ranking-table"></div>
</div>
```

### CSS Classes Addition

```css
/* Modal styles */
.modal { /* overlay styles */ }
.modal-content { /* modal box styles */ }

/* Ranking section */
.ranking-section { /* main container */ }
.ranking-controls { /* controls container */ }
.ranking-table { /* table container */ }
.stats-section { /* statistics display */ }

/* Responsive table */
@media (max-width: 768px) {
  .ranking-table table { /* mobile table styles */ }
}
```

### JavaScript Integration Points

1. **Form Submit Handler Extension**
   - Interceptar resultado após cálculo
   - Exibir modal de input do nome
   - Integrar com LeadStorage

2. **Event Listeners**
   - Botões de controle do ranking
   - Input de busca (debounced)
   - Modal de confirmação

3. **Initialization**
   - Carregar dados existentes na inicialização
   - Renderizar ranking se houver dados
   - Configurar event listeners

## Visual Design Integration

### Color Scheme (mantendo consistência)
- Background: `#0f172a` (slate-900)
- Container: `#1e293b` (slate-800)
- Accent: `#38bdf8` (sky-400)
- Text: `#f1f5f9` (slate-100)
- Secondary: `#cbd5e1` (slate-300)

### Typography
- Font family: 'Poppins', sans-serif
- Consistent sizing with existing elements
- Proper contrast ratios

### Spacing and Layout
- Consistent padding/margins with existing form
- Responsive breakpoints at 480px and 768px
- Grid layout for table on larger screens
- Stack layout for mobile

## Performance Considerations

### LocalStorage Optimization
- Limit stored data to essential fields only
- Implement data cleanup for old entries (optional)
- Batch operations when possible

### UI Performance
- Virtual scrolling for large datasets (if needed)
- Debounced search input (300ms)
- Lazy loading of export functionality

### Memory Management
- Clean up event listeners on component destruction
- Avoid memory leaks in modal handling
- Efficient DOM manipulation