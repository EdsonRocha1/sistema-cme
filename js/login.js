function fazerLogin() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario, senha })
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {

      // 🔐 SALVA SESSÃO
      localStorage.setItem("logado", "true");

      window.location.href = "index.html";
    } else {
      document.getElementById("erro").innerText = "Usuário ou senha inválidos";
    }
  });
}