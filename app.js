// app.js
console.log("Привет, мир от Node.js!");

// Простой HTTP-сервер
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Привет, это работает!');
});

const port = 3000;
server.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
