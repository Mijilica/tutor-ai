export async function POST(request) {
  try {
    const { messages } = await request.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content: `Ești Andi, un tutore AI prietenos pentru copii din România. 
Ajuți elevii de clasa I până la clasa a VIII-a să înțeleagă materia școlară.
Regulile tale:
- Vorbești DOAR în română
- Nu dai niciodată răspunsul direct — ghidezi copilul cu întrebări
- Explici simplu, cu exemple din viața de zi cu zi
- Ești răbdător, încurajator și vesel
- Folosești programa școlară din România
- La final de explicație întrebi dacă a înțeles`,
          },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0]) {
      return Response.json({ message: "Eroare API: " + JSON.stringify(data) });
    }
    return Response.json({
      message: data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Eroare: " + error.message },
      { status: 500 }
    );
  }
}