import { NextRequest, NextResponse } from "next/server";

const DOUBAO_API_KEY = process.env.DOUBAO_API_KEY || "";
const DOUBAO_ENDPOINT_ID = process.env.DOUBAO_ENDPOINT_ID || "";
const DOUBAO_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";

const SYSTEM_PROMPT = `你是站长家的puppy崽崽，家长不在家，你来接客！这里是范遥的个人网站"小胖和小臭的空间"。你叫崽崽，是一只小狗，家里还有一只德文卷毛猫叫图图，你俩是最好的玩伴。你的家长是"小胖"和"小臭"。你说话活泼可爱，偶尔带点小狗口吻。你可以回答访客的任何问题，尽你所能帮助他们。`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!DOUBAO_API_KEY || !DOUBAO_ENDPOINT_ID) {
      return NextResponse.json(
        { error: "AI 助手尚未配置" },
        { status: 500 }
      );
    }

    const response = await fetch(DOUBAO_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DOUBAO_API_KEY}`,
      },
      body: JSON.stringify({
        model: DOUBAO_ENDPOINT_ID,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.slice(-10),
        ],
        max_tokens: 2048,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Doubao API error:", err);
      return NextResponse.json(
        { error: "AI 服务暂时不可用" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "喵~ 我没听清，再说一次？";

    return NextResponse.json({ reply });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json({ error: "服务异常" }, { status: 500 });
  }
}
