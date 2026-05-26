"use client";
import { useState } from "react";
import Image from "next/image";

const CLASE = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const MATERII = ["Matematică", "Română", "Istorie", "Geografie", "Științe", "Fizică", "Chimie", "Biologie", "Engleză"];

export default function Home() {
  const [clasa, setClasa] = useState("");
  const [materie, setMaterie] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, clasa, materie }),
      });
      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  if (!started) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #0a0a1a 100%)"}}>
      <div className="flex flex-col items-center mb-8">
        <Image src="/andi.png" alt="Andi" width={120} height={120} className="rounded-full mb-4 border-4 border-blue-500 shadow-lg shadow-blue-500/50" />
        <h1 className="text-4xl font-bold text-white mb-1">ANDI</h1>
        <p className="text-blue-400 text-lg">Tutorele tău AI • Gratuit • 24/7</p>
      </div>
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <p className="font-medium text-blue-300 mb-3">Selectează clasa:</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {CLASE.map(c => (
            <button key={c} onClick={() => setClasa(c)}
              className={`p-2 rounded-lg text-sm font-bold transition-all ${clasa === c ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
              {c}
            </button>
          ))}
        </div>
        <p className="font-medium text-blue-300 mb-3">Selectează materia:</p>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {MATERII.map(m => (
            <button key={m} onClick={() => setMaterie(m)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${materie === m ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
              {m}
            </button>
          ))}
        </div>
        <button onClick={() => clasa && materie && setStarted(true)}
          className={`w-full p-4 rounded-xl text-white font-bold text-lg transition-all ${clasa && materie ? "bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-white/10 text-gray-500 cursor-not-allowed"}`}>
          Începe cu Andi →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4" style={{background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #0a0a1a 100%)"}}>
      <div className="flex items-center gap-3 my-4">
        <Image src="/andi.png" alt="Andi" width={48} height={48} className="rounded-full border-2 border-blue-500" />
        <div>
          <h1 className="text-xl font-bold text-white">ANDI</h1>
          <p className="text-blue-400 text-sm">Clasa {clasa} · {materie}</p>
        </div>
      </div>
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col gap-3 min-h-[500px] max-h-[500px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-20 text-lg">Salut! Eu sunt Andi. Cu ce te ajut la {materie} azi? 😊</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[80%] ${m.role === "user" ? "bg-blue-600 text-white self-end" : "bg-white/10 text-gray-100 self-start"}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="bg-white/10 self-start p-3 rounded-xl text-gray-300">Andi scrie... ✏️</div>}
      </div>
      <div className="w-full max-w-2xl flex gap-2 mt-4">
        <input className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-lg text-white placeholder-gray-500"
          placeholder={`Întreabă ceva la ${materie}...`}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-6 rounded-xl text-lg font-bold hover:bg-blue-500 shadow-lg shadow-blue-500/30">Trimite</button>
      </div>
    </div>
  );
}