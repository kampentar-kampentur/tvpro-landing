"use client"

import React, { useState } from 'react';
import Checkbox from '@/ui/Checkbox';

const ObjectRenderer = ({ data, level = 0 }) => {
    const [isShow, setIsShow] = useState()
  // Если данных нет
  if (data === null || data === undefined) {
    return <span style={{ color: '#999' }}>null</span>;
  }

  // Примитивные типы
  if (typeof data !== 'object') {
    return <span style={{ color: getTypeColor(typeof data) }}>{String(data)}</span>;
  }

  // Массивы
  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: level * 20 }}>
        <span style={{ color: '#666' }}>[</span>
        {data.map((item, index) => (
          <div key={index} style={{ marginLeft: 20 }}>
            <span style={{ color: '#999' }}>{index}: </span>
            <ObjectRenderer data={item} level={level + 1} />
            {index < data.length - 1 && <span style={{ color: '#666' }}>,</span>}
          </div>
        ))}
        <span style={{ color: '#666' }}>]</span>
      </div>
    );
  }

  // Объекты
  const entries = Object.entries(data);
  
  return (
    <> 
    <Checkbox value={isShow} onChange={() => setIsShow(!isShow)}/>
    {isShow && 
        <div style={{ marginLeft: level * 20 }}>
            <span style={{ color: '#666' }}>{'{'}</span>
            {entries.map(([key, value], index) => (
                <div key={key} style={{ marginLeft: 20 }}>
                <span style={{ color: '#e06c75', fontWeight: 'bold' }}>{key}: </span>
                <ObjectRenderer data={value} level={level + 1} />
                {index < entries.length - 1 && <span style={{ color: '#666' }}>,</span>}
                </div>
            ))}
            <span style={{ color: '#666' }}>{'}'}</span>
        </div>
    }
    </>
  );
};

// Функция для определения цвета по типу данных
const getTypeColor = (type) => {
  switch (type) {
    case 'string':
      return '#98c379';
    case 'number':
      return '#d19a66';
    case 'boolean':
      return '#56b6c2';
    case 'function':
      return '#c678dd';
    default:
      return '#abb2bf';
  }
};

export default ObjectRenderer;