"use client";
import { useState } from "react";
import Image from "next/image";

const CLASE = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const MATERII = ["Matematică", "Română", "Istorie", "Geografie", "Științe", "Fizică", "Chimie", "Biologie", "Engleză"];

const MATERIE_CONFIG = {
  "Matematică": { icon: "🔢", bg: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=80" },
  "Română": { icon: "📖", bg: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1920&q=80" },
  "Istorie": { icon: "⚔️", bg: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1920&q=80" },
  "Geografie": { icon: "🌍", bg: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80" },
  "Științe": { icon: "🔬", bg: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1920&q=80" },
  "Fizică": { icon: "⚡", bg: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=1920&q=80" },
  "Chimie": { icon: "🧪", bg: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=80" },
  "Biologie": { icon: "🌿", bg: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80" },
  "Engleză": { icon: "🇬🇧", bg: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=1920&q=80" },
};
const BADGES = [
  { id: "first", icon: "🌟", name: "Prima întrebare!", points: 0 },
  { id: "10points", icon: "🥉", name: "10 puncte!", points: 10 },
  { id: "30points", icon: "🥈", name: "30 puncte!", points: 30 },
  { id: "50points", icon: "🥇", name: "50 puncte!", points: 50 },
  { id: "100points", icon: "🏆", name: "100 puncte!", points: 100 },
];
function ChatBackground({ materie }) {
  const config = MATERIE_CONFIG[materie];
  if (!config?.bg) return null;
  return (
    <div className="fixed inset-0 z-0">
      <img src={config.bg} alt="" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}

export default function Home() {
  const [clasa, setClasa] = useState("");
  const [materie, setMaterie] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [points, setPoints] = useState(0);

  const config = MATERIE_CONFIG[materie] || { icon: "📚" };

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setQuiz(null);
    setAnswers({});
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

  async function generateQuiz() {
    setQuizLoading(true);
    setQuiz(null);
    setAnswers({});
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, clasa, materie, generateQuiz: true }),
      });
      const data = await response.json();
      if (data.quiz) setQuiz(data.quiz);
    } catch (e) { console.error(e); }
    setQuizLoading(false);
  }

  function answerQuestion(qIndex, aIndex, correct) {
    if (answers[qIndex] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qIndex]: aIndex }));
    if (aIndex === correct) setPoints(p => p + 10);
  }

  function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ro-RO";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  if (!started) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4">
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
              className={`p-2 rounded-lg text-sm font-bold transition-all ${clasa === c ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
              {c}
            </button>
          ))}
        </div>
        <p className="font-medium text-blue-300 mb-3">Selectează materia:</p>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {MATERII.map(m => (
            <button key={m} onClick={() => setMaterie(m)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${materie === m ? "bg-blue-500 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"}`}>
              {MATERIE_CONFIG[m]?.icon} {m}
            </button>
          ))}
        </div>
        <button onClick={() => clasa && materie && setStarted(true)}
          className={`w-full p-4 rounded-xl text-white font-bold text-lg transition-all ${clasa && materie ? "bg-blue-600 hover:bg-blue-500" : "bg-white/10 text-gray-500 cursor-not-allowed"}`}>
          Începe cu Andi →
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 relative">
      <ChatBackground materie={materie} />
      <div className="flex items-center justify-between w-full max-w-2xl my-4 z-10 bg-black/40 backdrop-blur rounded-2xl px-4 py-2">
        <div className="flex items-center gap-3">
          <button onClick={() => { setStarted(false); setMessages([]); setQuiz(null); setAnswers({}); }}
            className="text-blue-400 hover:text-white transition-all mr-2">
            ← Înapoi
          </button>
          <Image src="/andi.png" alt="Andi" width={48} height={48} className="rounded-full border-2 border-blue-500" />
          <div>
            <h1 className="text-xl font-bold text-white">ANDI {config.icon}</h1>
            <p className="text-blue-300 text-sm">Clasa {clasa} · {materie}</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl px-4 py-2">
          <p className="text-yellow-400 font-bold">⭐ {points} puncte</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-black/40 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col gap-3 min-h-[400px] max-h-[400px] overflow-y-auto z-10">
        {messages.length === 0 && (
          <p className="text-gray-300 text-center mt-20 text-lg">Salut! Eu sunt Andi {config.icon}. Cu ce te ajut la {materie} azi? 😊</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[85%] ${m.role === "user" ? "bg-blue-600 text-white self-end" : "bg-black/50 text-gray-100 self-start border border-white/10"}`}>
            <p>{m.content}</p>
            {m.role === "assistant" && (
              <button onClick={() => speakText(m.content)} className="mt-2 text-blue-400 text-xs hover:text-blue-300">🔊 Ascultă</button>
            )}
          </div>
        ))}
        {loading && <div className="bg-black/50 self-start p-3 rounded-xl text-gray-300 border border-white/10">Andi scrie... ✏️</div>}
      </div>

      {messages.length > 1 && !quiz && (
        <button onClick={generateQuiz} disabled={quizLoading}
          className="mt-3 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all z-10">
          {quizLoading ? "Se generează... ⏳" : "🎯 Testează-mă!"}
        </button>
      )}

      {quiz && (
        <div className="w-full max-w-2xl mt-3 bg-black/40 backdrop-blur border border-white/10 rounded-2xl p-4 z-10">
          <h3 className="text-white font-bold text-lg mb-4">🎯 Quiz timp!</h3>
          {quiz.questions.map((q, qi) => (
            <div key={qi} className="mb-4">
              <p className="text-gray-200 font-medium mb-2">{qi + 1}. {q.question}</p>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  const answered = answers[qi] !== undefined;
                  const isSelected = answers[qi] === oi;
                  const isCorrect = oi === q.correct;
                  let cls = "p-2 rounded-lg text-sm text-left transition-all border ";
                  if (!answered) cls += "border-white/20 text-gray-300 hover:bg-white/10 cursor-pointer";
                  else if (isCorrect) cls += "border-green-500 bg-green-500/20 text-green-300";
                  else if (isSelected) cls += "border-red-500 bg-red-500/20 text-red-300";
                  else cls += "border-white/10 text-gray-500";
                  return (
                    <button key={oi} className={cls} onClick={() => answerQuestion(qi, oi, q.correct)}>
                      {opt} {answered && isCorrect ? "✅" : answered && isSelected ? "❌" : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="w-full max-w-2xl flex gap-2 mt-4 z-10">
        <input className="flex-1 bg-black/40 backdrop-blur border border-white/20 rounded-xl p-3 text-lg text-white placeholder-gray-400"
          placeholder={`Întreabă ceva la ${materie}...`}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-6 rounded-xl text-lg font-bold hover:bg-blue-500">Trimite</button>
      </div>
    </div>
  );
}