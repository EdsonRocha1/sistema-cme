function fazerLogin() {
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ usuario, senha })
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {
      localStorage.setItem("logado", "true");
      window.location.href = "/";
    } else {
      document.getElementById("erro").innerText = "Usuário ou senha inválidos";
    }
  })
  .catch(() => {
    document.getElementById("erro").innerText = "Erro de conexão com servidor";
  });
}