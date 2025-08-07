import React, { useState } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
}

export default function MagicCat() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  const petKoteus = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = Date.now();
    const newHeart = { id, x: e.clientX, y: e.clientY };
    setHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 2000);
  };

  return (
    <>
      <div className="koteus-container animate-float" onClick={petKoteus}>
        <div className="wizard-hat" />
        <div className="koteus">
          <div className="koteus-ears">
            <div className="ear" />
            <div className="ear" />
          </div>
          <div className="koteus-eyes">
            <div className="eye" />
            <div className="eye" />
          </div>
          <div className="koteus-nose" />
          <div className="koteus-whiskers">
            <div className="whisker" />
            <div className="whisker" />
            <div className="whisker" />
            <div className="whisker" />
          </div>
        </div>
      </div>
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="heart fixed"
          style={{ left: heart.x, top: heart.y }}
        >
          💖
        </span>
      ))}
    </>
  );
}

