const Redis = require("ioredis");

const publisher = new Redis({
  host: "localhost",
  port: 6379,
});

const canal = process.argv[2] || "emprestimo.criado";
const userId = process.argv[3] || "user123";

const eventos = {
  "emprestimo.criado": {
    userId,
    livroTitulo: "Clean Code",
    dataEmprestimo: new Date().toISOString(),
  },
  "livro.devolvido": {
    userId,
    livroTitulo: "Design Patterns",
    dataDevolucao: new Date().toISOString(),
  },
  "reserva.notificada": {
    userId,
    livroTitulo: "O Senhor dos Anéis",
    dataDisponibilidade: new Date().toISOString(),
  },
};

const payload = eventos[canal];

console.log(`📤 Publicando no canal: ${canal}`);
console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));

publisher.publish(canal, JSON.stringify(payload), (err, reply) => {
  if (err) {
    console.error("❌ Erro ao publicar:", err);
  } else {
    console.log(`✅ Evento publicado! Subscritores que receberam: ${reply}`);
  }
  publisher.quit();
});
