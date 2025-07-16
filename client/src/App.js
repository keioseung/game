import React, { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import StatusBar from './components/StatusBar';
import Inventory from './components/Inventory';
import Chat from './components/Chat';
import Map from './components/Map';

const socket = io('http://localhost:3001');

function App() {
  const [meId, setMeId] = useState(null);
  const [player, setPlayer] = useState(null);
  const [players, setPlayers] = useState({});
  const [monsters, setMonsters] = useState([]);
  const [items, setItems] = useState([]);
  const [chatLog, setChatLog] = useState([]);
  const [map, setMap] = useState([]);
  const [name, setName] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on('connect', () => setMeId(socket.id));
    socket.on('state', ({ players, monsters, items, chatLog, map }) => {
      setPlayers(players);
      setPlayer(players[socket.id]);
      setMonsters(monsters);
      setItems(items);
      setChatLog(chatLog);
      setMap(map);
    });
    return () => socket.disconnect();
  }, []);

  const handleJoin = () => {
    if (name) {
      socket.emit('join', { name });
      setJoined(true);
    }
  };

  const handleMove = useCallback((dir) => {
    socket.emit('move', dir);
  }, []);

  const handleAttack = useCallback(() => {
    socket.emit('attack');
  }, []);

  const handleChat = (msg) => {
    socket.emit('chat', msg);
  };

  if (!joined) {
    return (
      <div style={{ padding: 40 }}>
        <h2>2D MMORPG (레벨/경험치/인벤토리/채팅/맵)</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="닉네임 입력" />
        <button onClick={handleJoin}>게임 시작</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <StatusBar player={player} />
      <Map map={map} players={players} monsters={monsters} items={items} meId={meId} onMove={handleMove} onAttack={handleAttack} />
      <Inventory inventory={player?.inventory || []} />
      <Chat chatLog={chatLog} onSend={handleChat} />
      <div style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
        방향키: 이동 / 스페이스: 공격 / 채팅 입력 후 Enter
      </div>
    </div>
  );
}

export default App; 