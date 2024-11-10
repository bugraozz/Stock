

import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // her saniyede bir saat güncellenir

    return () => clearInterval(intervalId); // bileşen kaldırıldığında interval temizlenir
  }, []);

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="fixed top-0 left-0 right-0 flex justify-center py-4">
      <div className="text-4xl font-semibold rounded-md" 
           style={{ 
             color: 'var(--text-color)', 
             backgroundColor: 'var(--background-color)' }}>
        {formatTime(time)}
      </div>
    </div>
  );
};

export default Clock;
