const express = require("express");
const cors = require("cors");
const path = require("path");
const PORT = process.env.PORT || 3000;

const registroRoutes = require("./routes/registroRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use("/registros", registroRoutes);

// FRONTEND
app.use(express.static(path.join(__dirname, "..")));

// ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "login.html"));
});

// LOGIN
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;

  const usuarioFixo = "admin";
  const senhaFixa = "1234";

  if (usuario === usuarioFixo && senha === senhaFixa) {
    return res.json({ sucesso: true });
  }

  res.status(401).json({
    sucesso: false,
    mensagem: "Credenciais inválidas"
  });
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});