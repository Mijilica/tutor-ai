"use client";
import { useState } from "react";

const CLASE = ["Clasa I", "Clasa II", "Clasa III", "Clasa IV", "Clasa V", "Clasa VI", "Clasa VII", "Clasa VIII"];
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
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Andi - Tutorele tău AI 🎓</h1>
      <p className="text-gray-600 mb-8">Ajutor la teme, în română, 24/7</p>
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <p className="font-medium text-gray-700 mb-2">Selectează clasa:</p>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {CLASE.map(c => (
            <button key={c} onClick={() => setClasa(c)}
              className={`p-2 rounded-lg text-sm font-medium border-2 transition-all ${clasa === c ? "border-blue-500 bg-blue-100 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
              {c.replace("Clasa ", "")}
            </button>
          ))}
        </div>
        <p className="font-medium text-gray-700 mb-2">Selectează materia:</p>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {MATERII.map(m => (
            <button key={m} onClick={() => setMaterie(m)}
              className={`p-2 rounded-lg text-sm font-medium border-2 transition-all ${materie === m ? "border-blue-500 bg-blue-100 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
              {m}
            </button>
          ))}
        </div>
        <button onClick={() => clasa && materie && setStarted(true)}
          className={`w-full p-3 rounded-xl text-white font-bold text-lg transition-all ${clasa && materie ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}>
          Începe cu Andi →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold text-blue-700 my-4">Andi 🎓 — {clasa} · {materie}</h1>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-4 flex flex-col gap-3 min-h-[500px] max-h-[500px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-20 text-lg">Salut! Eu sunt Andi. Cu ce te ajut la {materie} azi? 😊</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[80%] text-gray-800 ${m.role === "user" ? "bg-blue-200 self-end" : "bg-green-200 self-start"}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="bg-green-200 self-start p-3 rounded-xl text-gray-800">Andi scrie... ✏️</div>}
      </div>
      <div className="w-full max-w-2xl flex gap-2 mt-4">
        <input className="flex-1 border-2 border-blue-300 rounded-xl p-3 text-lg text-gray-800"
          placeholder={`Întreabă ceva la ${materie}...`}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-6 rounded-xl text-lg font-bold hover:bg-blue-700">Trimite</button>
      </div>
    </div>
  );
}