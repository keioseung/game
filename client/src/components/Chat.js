import React, { useState } from 'react';
export default function Chat({ chatLog, onSend }) {
  const [msg, setMsg] = useState('');
  return (
    <div style={{ background: '#111', color: '#fff', padding: 8, height: 120, overflowY: 'auto', marginBottom: 4 }}>
      <div style={{ height: 80, overflowY: 'auto' }}>
        {chatLog.map((c, i) => (
          <div key={i}><b>{c.name}:</b> {c.msg}</div>
        ))}
      </div>
      <form onSubmit={e => { e.preventDefault(); if (msg) { onSend(msg); setMsg(''); } }}>
        <input value={msg} onChange={e => setMsg(e.target.value)} style={{ width: '80%' }} placeholder="채팅 입력..." />
        <button type="submit">전송</button>
      </form>
    </div>
  );
} 