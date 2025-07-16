import React from 'react';
export default function StatusBar({ player }) {
  if (!player) return null;
  return (
    <div style={{ background: '#222', color: '#fff', padding: 8, marginBottom: 4 }}>
      <b>{player.name}</b> | 레벨: {player.level} | HP: {player.hp}/{player.maxHp} | MP: {player.mp}/{player.maxMp} | 경험치: {player.exp}/{player.nextExp}
    </div>
  );
} 