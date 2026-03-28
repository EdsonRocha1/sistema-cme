// =============================
// 🔐 PROTEÇÃO DE ROTA
// =============================
if (localStorage.getItem("logado") !== "true") {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("logado");
  window.location.href = "login.html";
}

// =============================
// 🔹 CONFIGURAÇÕES
// =============================
const API_URL = "/registros";

let todosRegistros = [];
let idEmEdicao = null;

let grafico = null;
let graficoPizza = null;
let graficoData = null;

// DOM
const lista = document.getElementById("lista");
const inputNome = document.getElementById("nome");
const inputDescricao = document.getElementById("descricao");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");
const campoBusca = document.getElementById("busca");

// =============================
// 🔹 TEMA
// =============================
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("modoTema",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

function aplicarTemaSalvo() {
  if (localStorage.getItem("modoTema") === "dark") {
    document.body.classList.add("dark");
  }
}

// =============================
// 🔹 TOAST
// =============================
function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = msg;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 3000);
}

// =============================
// 🔹 CARREGAR REGISTROS
// =============================
function carregarRegistros() {
  fetch(API_URL)
    .then(res => res.json())
    .then(dados => {

      if (!Array.isArray(dados)) dados = [];

      todosRegistros = dados;

      renderizarLista(dados);
      atualizarGraficos(dados);

      document.getElementById("contadorCard").innerText = dados.length;

      document.getElementById("ultimoRegistro").innerText =
        dados.length > 0
          ? dados[dados.length - 1].nome
          : "--";
    })
    .catch(err => console.error("Erro:", err));
}

// =============================
// 🔹 LISTA
// =============================
function renderizarLista(dados) {
  lista.innerHTML = "";

  dados.forEach(r => {
    lista.innerHTML += `
      <div class="item">
        <div>
          <strong>${r.nome}</strong>
          <p>${r.descricao}</p>
        </div>

        <div>
          <button onclick="editarRegistro(${r.id})">
            <i class="fa-solid fa-pen"></i>
          </button>

          <button onclick="excluirRegistro(${r.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
}

// =============================
// 🔹 CRUD
// =============================
function criarRegistro() {
  const nome = inputNome.value.trim();
  const descricao = inputDescricao.value.trim();

  if (!nome || !descricao) {
    mostrarToast("Preencha todos os campos!");
    return;
  }

  const metodo = idEmEdicao ? "PUT" : "POST";
  const url = idEmEdicao ? `${API_URL}/${idEmEdicao}` : API_URL;

  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome,
      descricao,
      data: new Date().toISOString()
    })
  })
    .then(() => {
      mostrarToast("Registro salvo!");
      limparFormulario();
      carregarRegistros();
    })
    .catch(err => console.error(err));
}

function editarRegistro(id) {
  const registro = todosRegistros.find(r => r.id === id);

  inputNome.value = registro.nome;
  inputDescricao.value = registro.descricao;

  idEmEdicao = id;
  btnSalvar.innerText = "Atualizar";
  btnCancelar.style.display = "inline-block";
}

function excluirRegistro(id) {
  if (!confirm("Excluir registro?")) return;

  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(() => {
      mostrarToast("Excluído!");
      carregarRegistros();
    });
}

function limparFormulario() {
  inputNome.value = "";
  inputDescricao.value = "";
  idEmEdicao = null;
  btnSalvar.innerText = "Salvar";
  btnCancelar.style.display = "none";
}

// =============================
// 🔹 BUSCA
// =============================
campoBusca.addEventListener("input", function () {
  const termo = this.value.toLowerCase();

  const filtrados = todosRegistros.filter(r =>
    r.nome.toLowerCase().includes(termo) ||
    r.descricao.toLowerCase().includes(termo)
  );

  renderizarLista(filtrados);
});

function aplicarFiltros() {

  const dataFiltro = document.getElementById("filtroData").value;
  const nomeFiltro = document.getElementById("filtroNome").value.toLowerCase();
  const descFiltro = document.getElementById("filtroDescricao").value.toLowerCase();

  let filtrados = todosRegistros.filter(reg => {

    let condicaoData = true;
    let condicaoNome = true;
    let condicaoDesc = true;

    if (dataFiltro) {
      const dataRegistro = new Date(reg.data)
        .toISOString()
        .split("T")[0];

      condicaoData = dataRegistro === dataFiltro;
    }

    if (nomeFiltro) {
      condicaoNome = reg.nome.toLowerCase().includes(nomeFiltro);
    }

    if (descFiltro) {
      condicaoDesc = reg.descricao.toLowerCase().includes(descFiltro);
    }

    return condicaoData && condicaoNome && condicaoDesc;

  });

  renderizarLista(filtrados);
  atualizarGraficos(filtrados);
}
document.getElementById("filtroData").addEventListener("input", aplicarFiltros);
document.getElementById("filtroNome").addEventListener("input", aplicarFiltros);
document.getElementById("filtroDescricao").addEventListener("input", aplicarFiltros);
function limparFiltros() {

  document.getElementById("filtroData").value = "";
  document.getElementById("filtroNome").value = "";
  document.getElementById("filtroDescricao").value = "";

  renderizarLista(todosRegistros);
  atualizarGraficos(todosRegistros);
}

// =============================
// 🔹 GRÁFICOS
// =============================
function atualizarGraficos(dados) {
  atualizarGraficoBarras(dados);
  atualizarGraficoPizza(dados);
  atualizarGraficoData(dados);
}

function atualizarGraficoBarras(dados) {
  const ctx = document.getElementById("graficoRegistros");
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: dados.map(r => r.nome),
      datasets: [{
        label: "Registros",
        data: dados.map(() => 1)
      }]
    }
  });
}

function atualizarGraficoPizza(dados) {
  const ctx = document.getElementById("graficoPizza");
  if (graficoPizza) graficoPizza.destroy();

  graficoPizza = new Chart(ctx, {
    type: "pie",
    data: {
      labels: dados.map(r => r.nome),
      datasets: [{
        data: dados.map(() => 1)
      }]
    }
  });
}

function atualizarGraficoData(dados) {
  const ctx = document.getElementById("graficoData");
  if (graficoData) graficoData.destroy();

  graficoData = new Chart(ctx, {
    type: "line",
    data: {
      labels: dados.map(r =>
        new Date(r.data).toLocaleDateString("pt-BR")
      ),
      datasets: [{
        label: "Por Data",
        data: dados.map(() => 1)
      }]
    }
  });
}
// =============================
// 📄 EXPORTAR PDF
// =============================
function exportarPDF() {

  const areaPDF = document.createElement("div");

  areaPDF.style.width = "794px"; // largura A4
  areaPDF.style.padding = "20px";
  areaPDF.style.fontFamily = "Arial";

  // Captura gráficos
  const grafico1 = document.getElementById("graficoRegistros").toDataURL("image/png", 1.0);
  const grafico2 = document.getElementById("graficoPizza").toDataURL("image/png", 1.0);
  const grafico3 = document.getElementById("graficoData").toDataURL("image/png", 1.0);

  areaPDF.innerHTML = `
    <h2 style="text-align:center;">Relatório de Registros CME</h2>
    <p><strong>Total:</strong> ${todosRegistros.length}</p>
    <hr>

    <div style="font-size:13px; margin-bottom:15px;">
      ${todosRegistros.map(r => `
        <div style="margin-bottom:8px;">
          <strong>${r.nome}</strong> - ${r.descricao}<br>
          <small>${new Date(r.data).toLocaleString("pt-BR")}</small>
        </div>
      `).join("")}
    </div>

    <hr>

    <div style="text-align:center;">
      <img src="${grafico1}" style="width:100%; max-height:180px; object-fit:contain; margin-bottom:10px;">
      <img src="${grafico2}" style="width:100%; max-height:180px; object-fit:contain; margin-bottom:10px;">
      <img src="${grafico3}" style="width:100%; max-height:180px; object-fit:contain;">
    </div>
  `;

  const opcoes = {
    margin: 5,
    filename: "Relatorio_CME.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: {
      scale: 2,
      useCORS: true
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait"
    }
  };

  html2pdf()
    .set(opcoes)
    .from(areaPDF)
    .save();
}
// =============================
aplicarTemaSalvo();
carregarRegistros();