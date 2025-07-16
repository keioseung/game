import React, { useEffect, useRef } from 'react';
const TILE_SIZE = 32;
const COLORS = ['#eee', '#444']; // 0: 바닥, 1: 벽

export default function Map({ map, players, monsters, items, meId, onMove, onAttack }) {
  const canvasRef = useRef();
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, map[0].length * TILE_SIZE, map.length * TILE_SIZE);
    // 맵
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[0].length; x++) {
        ctx.fillStyle = COLORS[map[y][x]];
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
    // 몬스터
    monsters.forEach(m => {
      ctx.fillStyle = 'green';
      ctx.fillRect(m.x * TILE_SIZE, m.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#000';
      ctx.fillText(`M(${m.hp})`, m.x * TILE_SIZE + 2, m.y * TILE_SIZE + 14);
    });
    // 아이템
    items.forEach(it => {
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(it.x * TILE_SIZE + 16, it.y * TILE_SIZE + 16, 10, 0, 2 * Math.PI);
      ctx.fill();
    });
    // 플레이어
    Object.values(players).forEach(p => {
      ctx.fillStyle = p.id === meId ? 'blue' : 'red';
      ctx.fillRect(p.x * TILE_SIZE, p.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#fff';
      ctx.fillText(`${p.name}(${p.hp})`, p.x * TILE_SIZE + 2, p.y * TILE_SIZE + 28);
    });
  }, [map, players, monsters, items, meId]);

  // 키보드 이동/공격
  useEffect(() => {
    const onKeyDown = e => {
      if (e.key === 'ArrowUp') onMove('up');
      if (e.key === 'ArrowDown') onMove('down');
      if (e.key === 'ArrowLeft') onMove('left');
      if (e.key === 'ArrowRight') onMove('right');
      if (e.key === ' ') onAttack();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onMove, onAttack]);

  return (
    <canvas ref={canvasRef} width={map[0].length * TILE_SIZE} height={map.length * TILE_SIZE} style={{ border: '2px solid #888', marginBottom: 4 }} />
  );
} 