import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  baseURL: "https://api.minimax.io/anthropic",
  apiKey:
    "sk-cp-tdoMmVYW-JzFgMXdH6OiMzwR3JSY_QGxc6eY-GcrdYxS4FEHR-Ej4-XUlLY_YGQGp1fUXh9T6vVs7xTAo1Iopm9yumSFuagoNKzy7d0GgkxtBsv9XhS-Djg",
});

const message = await client.messages.create({
  model: "MiniMax-M2.7",
  max_tokens: 1000,
  messages: [
    {
      role: "user",
      content: "Generate a AI report about the LATAM and Spain tech job market",
    },
  ],
});

for (const block of message.content) {
  if (block.type === "thinking") {
    console.log(`Thinking:\n${block.thinking}\n`);
  } else if (block.type === "text") {
    console.log(`Text:\n${block.text}\n`);
  }
}
