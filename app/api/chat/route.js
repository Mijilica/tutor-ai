export async function POST(request) {
  try {
    const { messages, clasa, materie, generateQuiz } = await request.json();

    let systemPrompt = "";

    if (generateQuiz) {
      systemPrompt = `Ești un profesor care generează teste pentru elevi din România.
Bazat pe conversația anterioară, generează EXACT 3 întrebări grilă în română.
Răspunde DOAR cu JSON valid, fără text suplimentar, în acest format exact:
{
  "questions": [
    {
      "question": "întrebarea aici",
      "options": ["A. varianta1", "B. varianta2", "C. varianta3"],
      "correct": 0
    }
  ]
}
"correct" este indexul răspunsului corect (0, 1 sau 2).`;
    } else {
      systemPrompt = `Ești Andi, un tutore AI prietenos pentru elevi din România la ${materie}, clasa ${clasa}.
Regulile tale:
- Vorbești DOAR în română corectă
- Răspunsuri SCURTE și clare, maxim 4-5 propoziții
- Nu dai niciodată răspunsul direct — ghidezi cu întrebări simple
- Folosești exemple din viața de zi cu zi
- Ești vesel și încurajator
- La final întrebi dacă a înțeles`;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      return Response.json({ message: "Eroare API: " + JSON.stringify(data) });
    }

    const content = data.choices[0].message.content;

   if (generateQuiz) {
      try {
        const clean = content
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        
        const jsonMatch = clean.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const quiz = JSON.parse(jsonMatch[0]);
          return Response.json({ quiz });
        }
        return Response.json({ message: "Nu am putut genera quizul." });
      } catch {
        return Response.json({ message: content });
      }
    }