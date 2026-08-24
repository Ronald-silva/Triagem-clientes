"use strict";

const FREQUENCIA = [
  ["nunca", "Nunca"], ["raramente", "Raramente"], ["as_vezes", "Às vezes"], ["com_frequencia", "Com frequência"], ["nao_sei", "Não sei"]
];
const DOCUMENTOS = [
  ["notas_xml_ou_pdf", "XML e PDF de notas"], ["extratos_bancarios", "Extratos bancários"], ["comprovantes_de_pagamento", "Comprovantes de pagamento"], ["documentos_de_funcionarios", "Documentos de funcionários"], ["relatorios", "Relatórios"], ["fotografias_de_documentos", "Fotografias de documentos"], ["planilhas", "Planilhas"], ["outro", "Outro tipo de documento", true]
];
const DEMANDAS = [
  ["guias_e_segunda_via", "Guias e segunda via"], ["situacao_fiscal", "Situação fiscal"], ["certidoes", "Certidões"], ["folha_e_pro_labore", "Folha e pró-labore"], ["admissao_ferias_afastamento_desligamento", "Admissão, férias, afastamento ou desligamento"], ["abertura_ou_alteracao_de_empresa", "Abertura ou alteração de empresa"], ["parcelamento", "Parcelamento"], ["regularizacao", "Regularização"], ["relatorios_contabeis", "Relatórios contábeis"], ["orientacao_do_contador", "Orientação do contador"], ["emissao_correcao_ou_cancelamento_de_notas", "Emissão, correção ou cancelamento de notas"], ["outro", "Outra situação", true]
];
const SISTEMAS = [
  ["sistema_contabil", "Sistema contábil"], ["emissor_fiscal", "Emissor fiscal"], ["armazenamento_de_arquivos", "Armazenamento de arquivos em nuvem"], ["whatsapp", "WhatsApp"], ["email", "E-mail"], ["planilhas", "Planilhas"], ["portal_ou_aplicativo_proprio", "Portal ou aplicativo próprio"], ["nenhum_desses", "Nenhum desses"], ["nao_sei_informar", "Não sei informar"]
];
const PROBLEMAS = [
  ["documentos_que_nao_chegam_ou_atrasam", "Documentos que não chegam ou atrasam"], ["cobranca_de_pendencias", "Cobrança de pendências"], ["comunicacao_com_clientes_desorganizada", "Comunicação com clientes desorganizada"], ["emissao_de_notas_fiscais", "Emissão de notas fiscais"], ["controle_de_prazos_e_tarefas", "Controle de prazos e tarefas"], ["entrega_de_documentos_aos_clientes", "Entrega de documentos aos clientes"], ["retrabalho_por_erro_ou_falta_de_informacao", "Retrabalho por erro ou falta de informação"], ["outro", "Outro problema", true]
];
const q = (id, texto, tipo, opcoes, extra = {}) => ({ id, texto, tipo, opcoes, obrigatoria: true, ...extra });
const QUESTIONARIO = [
  { titulo: "Perfil do escritório", perguntas: [
    q("perfil_qtd_empresas_atendidas", "Aproximadamente quantas empresas o escritório atende atualmente?", "number", null, { apoio: "Uma estimativa é suficiente, não precisa ser o número exato.", min: 0, max: 2000 }),
    q("perfil_tamanho_equipe", "Quantas pessoas trabalham hoje no escritório, incluindo sócios?", "single", [["ate_3_pessoas", "Até 3 pessoas"], ["de_4_a_10_pessoas", "De 4 a 10 pessoas"], ["de_11_a_25_pessoas", "De 11 a 25 pessoas"], ["de_26_a_50_pessoas", "De 26 a 50 pessoas"], ["mais_de_50_pessoas", "Mais de 50 pessoas"]]),
    q("perfil_departamentos_existentes", "Quais dessas áreas existem hoje como divisão de trabalho no escritório?", "multi", [["fiscal", "Fiscal"], ["pessoal_departamento_pessoal", "Pessoal / departamento pessoal"], ["contabil", "Contábil"], ["societario", "Societário"], ["financeiro", "Financeiro"], ["atendimento_ao_cliente", "Atendimento ao cliente"], ["nao_ha_divisao_em_areas", "Não há divisão em áreas"], ["outro", "Outra área", true]], { apoio: "Marque todas que existirem, mesmo informalmente.", minChoices: 1 })
  ]},
  { titulo: "Comunicação e atendimento", perguntas: [
    q("comunicacao_canais_utilizados", "Quais canais os clientes realmente usam para falar com o escritório?", "multi", [["whatsapp_pessoal_da_equipe", "WhatsApp pessoal de alguém da equipe"], ["whatsapp_comercial_ou_central", "WhatsApp comercial ou central"], ["grupos_de_whatsapp_por_cliente", "Grupos de WhatsApp por cliente"], ["ligacao_telefonica", "Ligação telefônica"], ["email", "E-mail"], ["sistema_ou_portal_proprio", "Sistema ou portal próprio"], ["atendimento_presencial", "Atendimento presencial"], ["outro", "Outro canal", true]], { apoio: "Marque os que são usados de fato, não os que vocês gostariam de usar.", minChoices: 1 }),
    q("comunicacao_mensagens_perdidas", "Com que frequência uma mensagem ou pedido de cliente acaba sendo esquecido ou perdido?", "single", FREQUENCIA)
  ]},
  { titulo: "Recebimento de documentos", perguntas: [
    q("recebimento_tipos_documentos", "Quais tipos de documentos os clientes costumam enviar ao escritório?", "multi", DOCUMENTOS, { apoio: "Por exemplo: XML e PDF de notas, extratos bancários, comprovantes, documentos de funcionários, relatórios, fotografias ou planilhas.", minChoices: 1 }),
    q("recebimento_canais_utilizados", "Por onde esses documentos chegam ao escritório?", "multi", [["whatsapp", "WhatsApp"], ["email", "E-mail"], ["portal_ou_sistema", "Portal ou sistema"], ["entrega_fisica", "Entrega física"], ["planilha_compartilhada", "Planilha compartilhada"], ["outro", "Outro canal", true]], { minChoices: 1 }),
    q("recebimento_como_descobre_pendencias", "Na última competência mensal encerrada, como vocês descobriram quais clientes ainda não haviam enviado todos os documentos?", "single", [["conferencia_manual_por_uma_pessoa", "Conferência manual por uma pessoa"], ["planilha_de_controle", "Planilha de controle"], ["sistema_com_checklist_ou_alerta", "Sistema com checklist ou alerta"], ["so_se_percebe_quando_falta_algo_depois", "Só se percebe quando falta algo depois"], ["nao_sei", "Não sei"], ["outro", "Outra forma", true]])
  ]},
  { titulo: "Solicitação e cobrança de pendências", perguntas: [
    q("cobranca_documentos_mais_cobrados", "Quais documentos o escritório mais precisa cobrar dos clientes, repetidamente?", "multi", DOCUMENTOS, { minChoices: 1, maxChoices: 5 }),
    q("cobranca_quantidade_tentativas_usual", "Quando um cliente não envia um documento no prazo, quantas vezes normalmente é preciso cobrar até ele enviar?", "single", [["uma_vez", "Uma vez"], ["duas_a_tres_vezes", "Duas a três vezes"], ["mais_de_tres_vezes", "Mais de três vezes"], ["varia_muito_ou_nao_sei", "Varia muito ou não sei"]])
  ]},
  { titulo: "Demandas dos clientes", perguntas: [
    q("demandas_tipos_mais_frequentes", "Quais dessas demandas os clientes mais pedem ao escritório?", "multi", DEMANDAS, { apoio: "Marque até 5.", minChoices: 1, maxChoices: 5 }),
    q("demandas_tipos_mais_atrasam", "Dentre essas mesmas demandas, quais mais atrasam ou geram retrabalho?", "multi", DEMANDAS, { obrigatoria: false, maxChoices: 3 })
  ]},
  { titulo: "Entrega de documentos ao cliente", perguntas: [
    q("entrega_documentos_tipos", "Quais documentos o escritório entrega para os clientes?", "multi", [["guias_pagas", "Guias pagas"], ["certidoes", "Certidões"], ["relatorios_contabeis", "Relatórios contábeis"], ["folha_de_pagamento", "Folha de pagamento"], ["notas_emitidas_pdf_ou_xml", "Notas emitidas (PDF ou XML)"], ["outro", "Outro documento", true]], { minChoices: 1 }),
    q("entrega_existe_comprovacao_recebimento", "Quando um documento é entregue ao cliente, existe alguma confirmação de que ele recebeu ou visualizou?", "single", [["sim_sempre", "Sim, sempre"], ["as_vezes", "Às vezes"], ["nao_ou_nao_sabe", "Não, ou não sabe"]])
  ]},
  { titulo: "Emissão fiscal", perguntas: [
    q("emissao_fiscal_emite_notas", "O escritório emite notas fiscais em nome dos clientes (NFSe, NFe, NFCe, CTe ou outra)?", "single", [["sim", "Sim"], ["nao", "Não"]]),
    q("emissao_fiscal_modalidades", "Quais modalidades de nota o escritório emite?", "multi", [["nfse", "NFSe"], ["nfe", "NFe"], ["nfce", "NFCe"], ["cte", "CTe"], ["outro", "Outra modalidade", true]], { minChoices: 1, condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_modalidade_maior_demanda", "Qual modalidade representa a maior parte do volume emitido?", "single", [["nfse", "NFSe"], ["nfe", "NFe"], ["nfce", "NFCe"], ["cte", "CTe"], ["nao_sei", "Não sei"]], { condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_volume_mensal_aproximado", "Aproximadamente quantas notas o escritório emite por mês, somando todos os clientes?", "number", null, { min: 0, max: 20000, condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_qtd_clientes_atendidos", "Para quantos clientes o escritório emite notas hoje?", "number", null, { min: 0, max: 2000, condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_como_cliente_fornece_dados", "Como o cliente costuma informar os dados para a emissão da nota?", "multi", [["mensagem_de_texto", "Mensagem de texto"], ["audio", "Áudio"], ["foto_ou_imagem", "Foto ou imagem"], ["formulario", "Formulário"], ["planilha", "Planilha"], ["modelo_ou_padrao_ja_definido", "Modelo ou padrão já definido"], ["ligacao_telefonica", "Ligação telefônica"], ["outro", "Outra forma", true]], { minChoices: 1, condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_dados_mais_incompletos", "Quando os dados chegam incompletos, o que costuma faltar com mais frequência?", "multi", [["dados_do_tomador", "Dados do tomador"], ["valor_do_servico_ou_produto", "Valor do serviço ou produto"], ["descricao_do_servico_ou_produto", "Descrição do serviço ou produto"], ["tributacao_ou_retencoes", "Tributação ou retenções"], ["nao_costuma_faltar_nada", "Não costuma faltar nada"], ["outro", "Outro dado", true]], { obrigatoria: false, condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_clientes_servicos_recorrentes", "A maior parte da emissão é para os mesmos clientes, com os mesmos serviços ou produtos, todo mês?", "single", [["sim_quase_tudo_e_recorrente", "Sim, quase tudo é recorrente"], ["uma_parte_e_recorrente", "Uma parte é recorrente"], ["quase_nada_e_recorrente", "Quase nada é recorrente"], ["nao_sei", "Não sei"]], { condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_quem_confere_antes_emitir", "Alguém confere os dados antes da nota ser emitida?", "single", [["sim_sempre_alguem_confere", "Sim, sempre alguém confere"], ["as_vezes", "Às vezes"], ["ninguem_confere_antes", "Ninguém confere antes"], ["nao_sei", "Não sei"]], { condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_aprovacao_necessaria", "É preciso aprovação de alguém antes de emitir a nota?", "single", [["nenhuma_aprovacao_e_necessaria", "Nenhuma aprovação é necessária"], ["so_do_escritorio", "Só do escritório"], ["so_do_cliente", "Só do cliente"], ["do_escritorio_e_do_cliente", "Do escritório e do cliente"], ["nao_sei", "Não sei"]], { condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_ocorrencia_erros_rejeicoes", "Com que frequência ocorrem erros, rejeições, correções, substituições ou cancelamentos de notas?", "single", FREQUENCIA, { condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_entrega_pdf_xml_cliente", "Depois de emitida, o PDF e o XML da nota são entregues ao cliente?", "single", [["sim_sempre", "Sim, sempre"], ["as_vezes", "Às vezes"], ["raramente", "Raramente"], ["nunca", "Nunca"], ["nao_sei", "Não sei"]], { condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_tempo_gasto_emissao", "Quanto tempo, em média, é gasto por emissão (do pedido do cliente até a nota pronta)?", "single", [["menos_de_10_minutos", "Menos de 10 minutos"], ["de_10_a_30_minutos", "De 10 a 30 minutos"], ["de_30_minutos_a_2_horas", "De 30 minutos a 2 horas"], ["mais_de_2_horas", "Mais de 2 horas"], ["nao_sei", "Não sei"]], { condicao: ["emissao_fiscal_emite_notas", "sim"] }),
    q("emissao_fiscal_modalidade_prioritaria_piloto", "Se o piloto tivesse que começar por apenas uma modalidade de nota, qual faria mais diferença agora?", "single", [["nfse", "NFSe"], ["nfe", "NFe"], ["ambas_fariam_diferenca_semelhante", "Ambas fariam diferença semelhante"], ["ainda_nao_ha_informacao_suficiente", "Ainda não há informação suficiente"]], { condicao: ["emissao_fiscal_emite_notas", "sim"] })
  ]},
  { titulo: "Tarefas, obrigações e prazos", perguntas: [
    q("tarefas_mensais_recorrentes", "Quais tarefas ou obrigações se repetem todo mês no escritório?", "multi", [["apuracao_de_impostos", "Apuração de impostos"], ["fechamento_de_folha", "Fechamento de folha"], ["entrega_de_obrigacoes_acessorias", "Entrega de obrigações acessórias"], ["conciliacao_bancaria", "Conciliação bancária"], ["emissao_de_guias", "Emissão de guias"], ["outro", "Outra tarefa", true]], { apoio: "Por exemplo: apuração de impostos, fechamento de folha, entrega de obrigações acessórias, conciliação bancária, emissão de guias.", minChoices: 1 }),
    q("tarefas_como_controlam_vencimentos", "Como vocês controlam hoje quem é responsável por cada tarefa e quando ela vence?", "single", [["sistema_com_alertas", "Sistema com alertas"], ["planilha_de_controle", "Planilha de controle"], ["agenda_ou_calendario", "Agenda ou calendário"], ["conhecimento_da_equipe_sem_registro_formal", "Conhecimento da equipe, sem registro formal"], ["outro", "Outra forma", true]])
  ]},
  { titulo: "Sistemas e integrações atuais", perguntas: [
    q("sistemas_categorias_utilizadas", "Quais dessas categorias de sistema o escritório usa hoje?", "multi", SISTEMAS, { minChoices: 1 }),
    q("sistemas_nao_deve_substituir", "Dessas mesmas categorias, quais o escritório não gostaria de trocar, mesmo com um novo sistema?", "multi", SISTEMAS, { obrigatoria: false, maxChoices: 5 }),
    q("sistemas_nome_sistema_contabil", "Qual é o sistema contábil utilizado?", "short", null, { obrigatoria: false, condicao: ["sistemas_categorias_utilizadas", "sistema_contabil", "includes"] }),
    q("sistemas_nome_emissor_fiscal", "Qual é o emissor fiscal utilizado?", "short", null, { obrigatoria: false, condicao: ["sistemas_categorias_utilizadas", "emissor_fiscal", "includes"] })
  ]},
  { titulo: "Priorização e sucesso do piloto", perguntas: [
    q("priorizacao_maiores_problemas", "Quais são os três maiores problemas do dia a dia, pensando no impacto que causam?", "multi", PROBLEMAS, { minChoices: 1, maxChoices: 3 }),
    q("priorizacao_tarefas_que_mais_consomem_tempo", "Quais três tarefas mais consomem tempo da equipe hoje?", "multi", PROBLEMAS, { minChoices: 1, maxChoices: 3 }),
    q("priorizacao_resultados_indispensaveis_piloto", "Para o piloto ser considerado um sucesso, quais resultados são indispensáveis?", "multi", [["reduzir_tempo_gasto_cobrando_documentos", "Reduzir tempo gasto cobrando documentos"], ["reduzir_mensagens_perdidas_ou_esquecidas", "Reduzir mensagens perdidas ou esquecidas"], ["agilizar_a_emissao_de_notas_fiscais", "Agilizar a emissão de notas fiscais"], ["dar_mais_visibilidade_sobre_prazos_e_pendencias", "Dar mais visibilidade sobre prazos e pendências"], ["facilitar_a_entrega_de_documentos_aos_clientes", "Facilitar a entrega de documentos aos clientes"], ["reduzir_erros_e_retrabalho", "Reduzir erros e retrabalho"], ["outro", "Outro resultado", true]], { apoio: "Marque até 5.", minChoices: 1, maxChoices: 5 }),
    q("priorizacao_situacao_real_recente", "Descreva uma situação real e recente que represente bem a maior dor do escritório hoje.", "long", null, { apoio: "Pode ser algo que aconteceu na última semana ou no último mês encerrado." }),
    q("priorizacao_criterio_sucesso", "Como vocês saberiam, na prática, que o piloto deu certo?", "short", null, { apoio: "Descreva em poucas palavras um resultado que dá para observar ou medir." }),
    q("priorizacao_demanda_nao_contemplada", "Existe alguma demanda importante do escritório que este questionário não perguntou?", "long", null, { obrigatoria: false })
  ]}
];

const root = document.getElementById("questionnaire");
const answers = Object.create(null);
let sectionIndex = 0;
let errors = new Map();

function isVisible(question) {
  if (!question.condicao) return true;
  const [referenceId, expected, operator] = question.condicao;
  const response = answers[referenceId];
  if (!response) return false;
  return operator === "includes" ? response.value.includes(expected) : response.value === expected;
}

function visibleQuestions(section) { return section.perguntas.filter(isVisible); }
function create(tag, className, text) { const el = document.createElement(tag); if (className) el.className = className; if (text !== undefined) el.textContent = text; return el; }

function setAnswer(question, value, other) {
  answers[question.id] = { value, other: other || "" };
  errors.delete(question.id);
  removeHiddenAnswers();
}

function removeHiddenAnswers() {
  QUESTIONARIO.forEach((section) => section.perguntas.forEach((question) => { if (!isVisible(question)) delete answers[question.id]; }));
}

function responseIsValid(question) {
  const response = answers[question.id];
  if (!response) return !question.obrigatoria;
  if ((question.tipo === "short" || question.tipo === "long") && response.value.trim().length === 0) return !question.obrigatoria;
  if (question.tipo === "number" && (response.value === "" || Number(response.value) < question.min || Number(response.value) > question.max)) return false;
  if (question.tipo === "multi") {
    if (question.obrigatoria && response.value.length < (question.minChoices || 1)) return false;
    if (question.maxChoices && response.value.length > question.maxChoices) return false;
  }
  const otherSelected = question.opcoes && question.opcoes.some((option) => option[2] && (Array.isArray(response.value) ? response.value.includes(option[0]) : response.value === option[0]));
  return !otherSelected || response.other.trim().length > 0;
}

function errorText(question) {
  const response = answers[question.id];
  if (question.tipo === "number") return `Informe um número entre ${question.min} e ${question.max}.`;
  if (response && question.opcoes && question.opcoes.some((o) => o[2] && (Array.isArray(response.value) ? response.value.includes(o[0]) : response.value === o[0])) && !response.other.trim()) return "Descreva a opção selecionada.";
  return question.obrigatoria ? "Esta pergunta é obrigatória." : "Revise esta resposta.";
}

function renderQuestion(question, number) {
  const field = create("fieldset", "question" + (errors.has(question.id) ? " has-error" : ""));
  field.dataset.questionId = question.id;
  const legend = create("legend", "question-title");
  legend.textContent = `${number}. ${question.texto}`;
  if (question.obrigatoria) legend.append(" ", create("span", "required", "*"));
  field.appendChild(legend);
  if (question.apoio) field.appendChild(create("span", "help-text", question.apoio));
  if (question.maxChoices) field.appendChild(create("span", "limit-text", `Escolha até ${question.maxChoices}.`));
  const response = answers[question.id] || { value: question.tipo === "multi" ? [] : "", other: "" };
  if (question.tipo === "single" || question.tipo === "multi") {
    const options = create("div", "option-list");
    question.opcoes.forEach(([id, text, isOther]) => {
      const label = create("label", "option");
      const input = document.createElement("input");
      input.type = question.tipo === "single" ? "radio" : "checkbox";
      input.name = question.id;
      input.value = id;
      input.checked = question.tipo === "single" ? response.value === id : response.value.includes(id);
      input.addEventListener("change", () => {
        const next = question.tipo === "single" ? id : (input.checked ? [...response.value, id] : response.value.filter((item) => item !== id));
        if (question.maxChoices && next.length > question.maxChoices) { input.checked = false; errors.set(question.id, `Escolha no máximo ${question.maxChoices} opções.`); render(); return; }
        setAnswer(question, next, response.other);
        render();
      });
      label.append(input, create("span", null, text));
      options.appendChild(label);
    });
    field.appendChild(options);
    const hasOther = question.opcoes.some((option) => option[2] && (question.tipo === "single" ? response.value === option[0] : response.value.includes(option[0])));
    if (hasOther) {
      const other = document.createElement("input");
      other.type = "text"; other.maxLength = 200; other.value = response.other; other.placeholder = "Descreva"; other.className = "text-input other-input";
      other.setAttribute("aria-label", `Detalhe para: ${question.texto}`);
      other.addEventListener("input", () => { setAnswer(question, response.value, other.value); });
      field.appendChild(other);
    }
  } else {
    const input = question.tipo === "long" ? document.createElement("textarea") : document.createElement("input");
    if (question.tipo === "long") { input.rows = 4; input.maxLength = 4000; } else { input.type = question.tipo === "number" ? "number" : "text"; input.maxLength = question.tipo === "short" ? 200 : undefined; }
    if (question.tipo === "number") { input.min = question.min; input.max = question.max; input.inputMode = "numeric"; }
    input.id = question.id; input.className = "text-input"; input.value = response.value;
    input.addEventListener("input", () => { setAnswer(question, input.value); });
    field.appendChild(input);
  }
  if (errors.has(question.id)) field.appendChild(create("p", "field-error", typeof errors.get(question.id) === "string" ? errors.get(question.id) : errorText(question)));
  return field;
}

function validateSection(section) {
  errors = new Map();
  visibleQuestions(section).forEach((question) => { if (!responseIsValid(question)) errors.set(question.id, true); });
  return errors.size === 0;
}

function validateAll() {
  errors = new Map();
  let firstInvalid = -1;
  QUESTIONARIO.forEach((section, index) => visibleQuestions(section).forEach((question) => {
    if (!responseIsValid(question)) { errors.set(question.id, true); if (firstInvalid === -1) firstInvalid = index; }
  }));
  if (firstInvalid >= 0) sectionIndex = firstInvalid;
  return firstInvalid < 0;
}

function answerText(question) {
  const response = answers[question.id];
  if (!response) return "";
  if (question.tipo === "short" || question.tipo === "long" || question.tipo === "number") return String(response.value).trim();
  const selected = Array.isArray(response.value) ? response.value : [response.value];
  const text = selected.map((id) => question.opcoes.find((option) => option[0] === id)?.[1] || "").filter(Boolean).join(", ");
  return response.other.trim() ? `${text} — ${response.other.trim()}` : text;
}

function whatsappMessage() {
  const lines = ["DIAGNÓSTICO DO ESCRITÓRIO CONTÁBIL"];
  QUESTIONARIO.forEach((section) => {
    const questions = visibleQuestions(section).filter((question) => answers[question.id] && answerText(question));
    if (!questions.length) return;
    lines.push("", section.titulo, "");
    questions.forEach((question, index) => { lines.push(`${index + 1}. ${question.texto}`, `Resposta: ${answerText(question)}`, ""); });
  });
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function render() {
  root.replaceChildren();
  const section = QUESTIONARIO[sectionIndex];
  const step = create("p", "step-label", `Seção ${sectionIndex + 1} de ${QUESTIONARIO.length}`);
  const track = create("div", "progress-track"); track.setAttribute("role", "progressbar"); track.setAttribute("aria-label", "Progresso do questionário"); track.setAttribute("aria-valuemin", "0"); track.setAttribute("aria-valuemax", "100"); track.setAttribute("aria-valuenow", String(Math.round(((sectionIndex + 1) / QUESTIONARIO.length) * 100)));
  const bar = create("div", "progress-bar"); bar.style.width = `${((sectionIndex + 1) / QUESTIONARIO.length) * 100}%`; track.appendChild(bar);
  root.append(step, track, create("h2", "section-heading", section.titulo));
  const list = create("div", "question-list"); visibleQuestions(section).forEach((question, index) => list.appendChild(renderQuestion(question, index + 1))); root.appendChild(list);
  if (errors.size) root.appendChild(create("p", "form-message", "Revise as perguntas destacadas para continuar."));
  const nav = create("div", "navigation");
  const back = create("button", "button button-secondary", "Voltar"); back.type = "button"; back.disabled = sectionIndex === 0; back.addEventListener("click", () => { sectionIndex--; errors = new Map(); render(); window.scrollTo(0, 0); });
  const next = create("button", "button button-primary", sectionIndex === QUESTIONARIO.length - 1 ? "Enviar respostas pelo WhatsApp" : "Continuar"); next.type = "button";
  next.addEventListener("click", () => {
    if (sectionIndex < QUESTIONARIO.length - 1) { if (validateSection(section)) { sectionIndex++; render(); window.scrollTo(0, 0); } else render(); return; }
    if (!validateAll()) { render(); window.scrollTo(0, 0); return; }
    window.location.assign(`https://wa.me/5585991993833?text=${encodeURIComponent(whatsappMessage())}`);
  });
  nav.append(back, next); root.appendChild(nav);
  if (sectionIndex === QUESTIONARIO.length - 1) root.appendChild(create("p", "final-note", "O WhatsApp abrirá com as respostas organizadas. O envio dependerá da sua confirmação."));
}

render();
