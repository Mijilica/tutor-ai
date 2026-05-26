"use client";
import { useState } from "react";

export default function Home() {
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
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.message }]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-blue-700 my-6">
        Andi - Tutorele tău AI 🎓
      </h1>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-4 flex flex-col gap-3 min-h-[500px] max-h-[500px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-20 text-lg">
            Salut! Eu sunt Andi. Cu ce materie te ajut azi? 😊
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] text-gray-800 ${
              m.role === "user"
                ? "bg-blue-200 self-end text-right"
                : "bg-green-200 self-start"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="bg-green-200 self-start p-3 rounded-xl text-gray-800">
            Andi scrie... ✏️
          </div>
        )}
      </div>
      <div className="w-full max-w-2xl flex gap-2 mt-4">
        <input
          className="flex-1 border-2 border-blue-300 rounded-xl p-3 text-lg text-gray-800"
          placeholder="Scrie întrebarea ta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 rounded-xl text-lg font-bold hover:bg-blue-700"
        >
          Trimite
        </button>
      </div>
    </div>
  );
}