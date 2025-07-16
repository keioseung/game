import React from 'react';
export default function Inventory({ inventory }) {
  return (
    <div style={{ background: '#333', color: '#fff', padding: 8, marginBottom: 4 }}>
      <b>인벤토리</b>: {inventory && inventory.length > 0 ? inventory.map((item, i) => (
        <span key={i} style={{ marginRight: 8 }}>{item.name}</span>
      )) : '없음'}
    </div>
  );
} 