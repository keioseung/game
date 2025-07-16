const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// --- 맵 데이터 (간단한 2D 타일맵) ---
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;
const TILE_SIZE = 32;
const map = Array.from({ length: MAP_HEIGHT }, (_, y) =>
  Array.from({ length: MAP_WIDTH }, (_, x) => (x === 0 || y === 0 || x === MAP_WIDTH-1 || y === MAP_HEIGHT-1 ? 1 : 0))
); // 1: 벽, 0: 바닥

// --- 몬스터/아이템/플레이어 상태 ---
let players = {};
let monsters = [
  { id: 'm1', x: 5, y: 5, hp: 10, maxHp: 10, exp: 10 },
  { id: 'm2', x: 15, y: 10, hp: 15, maxHp: 15, exp: 20 }
];
let items = [];
let chatLog = [];

function randomSpawn() {
  // 맵 내 랜덤 바닥 위치 반환
  while (true) {
    const x = Math.floor(Math.random() * MAP_WIDTH);
    const y = Math.floor(Math.random() * MAP_HEIGHT);
    if (map[y][x] === 0) return { x, y };
  }
}

function respawnMonster(monster) {
  const pos = randomSpawn();
  monster.x = pos.x;
  monster.y = pos.y;
  monster.hp = monster.maxHp;
}

// --- 서버 Tick: 몬스터 AI, 리스폰 등 ---
setInterval(() => {
  monsters.forEach(m => {
    // 간단한 랜덤 이동
    if (Math.random() < 0.3) {
      const dx = Math.floor(Math.random() * 3) - 1;
      const dy = Math.floor(Math.random() * 3) - 1;
      const nx = m.x + dx;
      const ny = m.y + dy;
      if (map[ny] && map[ny][nx] === 0) {
        m.x = nx;
        m.y = ny;
      }
    }
  });
  io.emit('state', { players, monsters, items, chatLog, map });
}, 1000);

// --- 소켓 이벤트 ---
io.on('connection', (socket) => {
  socket.on('join', (player) => {
    players[socket.id] = {
      id: socket.id,
      name: player.name,
      x: 1, y: 1,
      hp: 20, maxHp: 20,
      mp: 10, maxMp: 10,
      level: 1, exp: 0, nextExp: 20,
      atk: 3,
      inventory: [],
      alive: true
    };
    io.emit('state', { players, monsters, items, chatLog, map });
  });

  socket.on('move', (dir) => {
    const p = players[socket.id];
    if (!p || !p.alive) return;
    const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0;
    const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0;
    const nx = p.x + dx;
    const ny = p.y + dy;
    if (map[ny] && map[ny][nx] === 0) {
      p.x = nx;
      p.y = ny;
    }
    io.emit('state', { players, monsters, items, chatLog, map });
  });

  socket.on('attack', (target) => {
    const p = players[socket.id];
    if (!p || !p.alive) return;
    // 몬스터 공격
    const m = monsters.find(m => m.x === p.x && m.y === p.y && m.hp > 0);
    if (m) {
      m.hp -= p.atk;
      if (m.hp <= 0) {
        p.exp += m.exp;
        if (p.exp >= p.nextExp) {
          p.level++;
          p.exp = 0;
          p.nextExp += 20;
          p.maxHp += 5;
          p.hp = p.maxHp;
          p.atk++;
        }
        respawnMonster(m);
      }
    }
    // PvP 공격
    Object.values(players).forEach(other => {
      if (other.id !== p.id && other.x === p.x && other.y === p.y && other.alive) {
        other.hp -= p.atk;
        if (other.hp <= 0) {
          other.alive = false;
          setTimeout(() => {
            other.x = 1; other.y = 1; other.hp = other.maxHp; other.alive = true;
            io.emit('state', { players, monsters, items, chatLog, map });
          }, 3000);
        }
      }
    });
    io.emit('state', { players, monsters, items, chatLog, map });
  });

  socket.on('chat', (msg) => {
    const p = players[socket.id];
    if (!p) return;
    chatLog.push({ name: p.name, msg });
    if (chatLog.length > 30) chatLog.shift();
    io.emit('state', { players, monsters, items, chatLog, map });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    io.emit('state', { players, monsters, items, chatLog, map });
  });
});

server.listen(3001, () => console.log('서버 실행중: 3001')); 