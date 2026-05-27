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
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [points, setPoints] = useState(0);

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
      <div className="flex items-center justify-between w-full max-w-2xl my-4">
        <div className="flex items-center gap-3">
          <Image src="/andi.png" alt="Andi" width={48} height={48} className="rounded-full border-2 border-blue-500" />
          <div>
            <h1 className="text-xl font-bold text-white">ANDI</h1>
            <p className="text-blue-400 text-sm">Clasa {clasa} · {materie}</p>
          </div>
        </div>
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl px-4 py-2">
          <p className="text-yellow-400 font-bold">⭐ {points} puncte</p>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col gap-3 min-h-[400px] max-h-[400px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-20 text-lg">Salut! Eu sunt Andi. Cu ce te ajut la {materie} azi? 😊</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[85%] ${m.role === "user" ? "bg-blue-600 text-white self-end" : "bg-white/10 text-gray-100 self-start"}`}>
            <p>{m.content}</p>
            {m.role === "assistant" && (
              <button onClick={() => speakText(m.content)} className="mt-2 text-blue-400 text-xs hover:text-blue-300">🔊 Ascultă</button>
            )}
          </div>
        ))}
        {loading && <div className="bg-white/10 self-start p-3 rounded-xl text-gray-300">Andi scrie... ✏️</div>}
      </div>

      {messages.length > 1 && !quiz && (
        <button onClick={generateQuiz} disabled={quizLoading}
          className="mt-3 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30">
          {quizLoading ? "Se generează..." : "🎯 Testează-mă!"}
        </button>
      )}

      {quiz && (
        <div className="w-full max-w-2xl mt-3 bg-white/5 border border-white/10 rounded-2xl p-4">
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

      <div className="w-full max-w-2xl flex gap-2 mt-4">
        <input className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-lg text-white placeholder-gray-500"
          placeholder={`Întreabă ceva la ${materie}...`}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-6 rounded-xl text-lg font-bold hover:bg-blue-500">Trimite</button>
      </div>
    </div>
  );
}