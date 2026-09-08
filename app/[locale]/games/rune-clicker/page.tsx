"use client";

import { useEffect, useMemo, useState } from "react";

const RUNES = [
  { symbol: "ᚠ", name: "Fehu", points: 10, effect: "Focus" },
  { symbol: "ᚢ", name: "Uruz", points: 15, effect: "Power" },
  { symbol: "ᚦ", name: "Thurisaz", points: 20, effect: "Impact" },
  { symbol: "ᚨ", name: "Ansuz", points: 25, effect: "Wisdom" },
  { symbol: "ᚱ", name: "Raidho", points: 30, effect: "Momentum" },
  { symbol: "ᛟ", name: "Othala", points: 50, effect: "Bonus" },
];

export default function RuneClickerPage() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [active, setActive] = useState<number[]>([]);
  const [time, setTime] = useState(30);
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(0);

  const shuffled = useMemo(() => [...RUNES].sort(() => Math.random() - 0.5), [time]);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      setBest((value) => Math.max(value, score));
      return;
    }
    const timer = window.setInterval(() => setTime((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, time, score]);

  function start() {
    setScore(0);
    setStreak(0);
    setActive([]);
    setTime(30);
    setRunning(true);
  }

  function hit(index: number) {
    if (!running || active.includes(index)) return;
    const rune = shuffled[index];
    setActive((value) => [...value, index]);
    setScore((value) => value + rune.points + Math.min(streak, 10) * 2);
    setStreak((value) => value + 1);
    window.setTimeout(() => setActive((value) => value.filter((item) => item !== index)), 220);
  }

  return (
    <main style={{ minHeight: "100vh", padding: "48px 20px", background: "#070b10", color: "#e8ffff" }}>
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ letterSpacing: ".18em", opacity: .65 }}>JAPANESE LEARNING DOJO · GAME</p>
        <h1 style={{ fontSize: "clamp(2rem,6vw,4.5rem)", margin: "8px 0" }}>Rune Clicker</h1>
        <p style={{ opacity: .75 }}>A fully playable reaction game. Activate as many runes as possible before the timer expires.</p>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", margin: "24px 0", fontFamily: "monospace" }}>
          <span>SCORE {score}</span><span>STREAK {streak}</span><span>TIME {time}</span><span>BEST {best}</span>
        </div>
        <button onClick={start} style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid #55e6e6", background: "#0c2024", color: "#e8ffff", cursor: "pointer" }}>
          {running ? "Restart" : "Start game"}
        </button>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 14, marginTop: 30 }}>
          {shuffled.map((rune, index) => (
            <button key={rune.symbol} onClick={() => hit(index)} title={rune.name}
              style={{ minHeight: 150, borderRadius: 18, border: active.includes(index) ? "2px solid #fff" : "1px solid #244", background: active.includes(index) ? "#174f52" : "#0c131b", color: "#dfffff", cursor: running ? "pointer" : "default", boxShadow: active.includes(index) ? "0 0 35px #55e6e6" : "none", transition: "all .15s" }}>
              <strong style={{ display: "block", fontSize: 56 }}>{rune.symbol}</strong>
              <span>{rune.name}</span><small style={{ display: "block", opacity: .6 }}>{rune.effect} · +{rune.points}</small>
            </button>
          ))}
        </div>
        {!running && time === 0 && <p style={{ marginTop: 24 }}>Game over. Final score: <strong>{score}</strong>.</p>}
      </section>
    </main>
  );
}
