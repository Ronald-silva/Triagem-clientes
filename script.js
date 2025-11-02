const form = document.getElementById("triagemForm");
const resultadoDiv = document.getElementById("resultado");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const respostas = Array.from(form.querySelectorAll("select")).map(s => parseInt(s.value));
  const total = respostas.reduce((acc, val) => acc + val, 0);

  let classificacao = "";
  let classe = "";

  if (total >= 22) {
    classificacao = "🚀 Alta prioridade de prospecção";
    classe = "alta";
  } else if (total >= 14) {
    classificacao = "⚖️ Potencial médio (vale observar e nutrir)";
    classe = "media";
  } else {
    classificacao = "❌ Baixa prioridade (não investir tempo agora)";
    classe = "baixa";
  }

  resultadoDiv.innerHTML = `
    <h3>Resultado da Avaliação</h3>
    <p><strong>Pontuação total:</strong> ${total}</p>
    <p><strong>Classificação:</strong> ${classificacao}</p>
  `;
  resultadoDiv.className = `resultado ${classe}`;
  resultadoDiv.style.display = "block";
});
