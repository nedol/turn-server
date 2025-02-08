
import Turn from 'node-turn';
import express from 'express';

const PORT = process.env.PORT || 443;

// Запуск HTTP-заглушки (чтобы Render не блокировал)
const app = express();
app.get('/', (req, res) => res.send('TURN server is running'));
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP-заглушка работает на порту ${PORT}`);
});


if (!global.turn_server) {
  global.turn_server = new Turn({
    listeningPort: process.env.PORT || 443, // Render назначает порт динамически
    authMech: 'long-term',
    credentials: {
      user: 'password123', // Логин и пароль для клиентов
    },
    listeningIps: ['0.0.0.0'], // 👈 Обязательно!
    externalIps: ['https://turn-server-iid3.onrender.com'], // Укажите ваш внешний IP-адрес (если есть)
    relayIps: ['0.0.0.0'],
    debugLevel: 'ALL',
    allowLoopbackPeers: true,
    noUdp: true, // ОТКЛЮЧАЕМ UDP, так как Render не поддерживает его
  });
  global.turn_server.start();
  global.turn_server.addUser('username', 'password');
  global.turn_server.log();
  console.log('Turn server started on ' + global.turn_server.listeningPort);
}

