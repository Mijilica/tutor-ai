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
      systemPrompt = `Ești Andi, tutore AI pentru elevi din România la ${materie}, clasa ${clasa}.
Stilul tău:
- Vorbești DOAR în română corectă
- Explici simplu și clar în 2-3 propoziții
- Exemplele trebuie să ARATE procesul pas cu pas, nu să repete același lucru
- Folosești povești scurte: "Mama are 2 mere, cumpără încă 3, numără împreună: 1,2,3,4,5!"
- La final pui o întrebare care VERIFICĂ înțelegerea, nu opinia
- Ești vesel și încurajator
- Maxim 5-6 propoziții total`;
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "z-ai/glm-4.5-air:free",
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

    return Response.json({ message: content });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Eroare: " + error.message }, { status: 500 });
  }
}