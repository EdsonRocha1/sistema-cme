const fs = require("fs");
const path = require("path");

const caminho = path.join(__dirname, "../data/registros.json");

function lerDados() {
  if (!fs.existsSync(caminho)) return [];
  const dados = fs.readFileSync(caminho);
  return JSON.parse(dados);
}

function salvarDados(dados) {
  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2));
}

function listar(req, res) {
  const registros = lerDados();
  res.json(registros);
}

function buscarPorId(req, res) {
  const id = Number(req.params.id);
  const registros = lerDados();
  const registro = registros.find(r => r.id === id);

  if (!registro) {
    return res.status(404).json({ erro: "Registro não encontrado" });
  }

  res.json(registro);
}

function criar(req, res) {
  console.log("BODY RECEBIDO NO BACKEND:", req.body);
  const { nome, descricao, data } = req.body;

  const registros = lerDados();

  const novoRegistro = {
    id: Date.now(),
    nome,
    descricao,
    data: data || new Date().toISOString()
  };

  registros.push(novoRegistro);

  salvarDados(registros);

  res.status(201).json(novoRegistro);
}


function atualizar(req, res) {
  const id = Number(req.params.id);
  const { nome, descricao } = req.body;

  const registros = lerDados();

  const index = registros.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Registro não encontrado" });
  }

  registros[index] = {
    ...registros[index],
    nome,
    descricao
  };

  salvarDados(registros);

  res.json(registros[index]);
}


function excluir(req, res) {
  const id = Number(req.params.id);
  const registros = lerDados();

  const novosRegistros = registros.filter(r => r.id !== id);

  salvarDados(novosRegistros);

  res.json({ mensagem: "Registro excluído" });
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  excluir
};
