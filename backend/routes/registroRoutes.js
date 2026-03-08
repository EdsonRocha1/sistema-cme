const express = require("express");
const router = express.Router();

// IMPORTAÇÃO CORRETA
const registroController = require("../controllers/registroController");

// TESTE DE SANIDADE (IMPORTANTE)
console.log("Controller recebido nas rotas:", registroController);

// ROTAS
router.get("/", registroController.listar);
router.get("/:id", registroController.buscarPorId);
router.post("/", registroController.criar);
router.put("/:id", registroController.atualizar);
router.delete("/:id", registroController.excluir);

module.exports = router;
