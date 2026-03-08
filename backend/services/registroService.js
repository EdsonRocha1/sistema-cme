function lerDados() {
  try {
    const dados = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Array.isArray(dados) ? dados : [];
  } catch (error) {
    return [];
  }
}
