const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = import.meta.env.VITE_OPENAI_KEY ?? '';
const MODEL = 'gpt-4o';

let history = [
  { role: 'system', content: 'You are a helpful assistant.' },
];

export async function sendMessage(text) {
  history.push({ role: 'user', content: text });

  if (!API_KEY) {
    await delay(800 + Math.random() * 600);
    const reply = mockReply(text);
    history.push({ role: 'assistant', content: reply });
    return reply;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages: history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `Request failed: ${res.status}`);
  }

  const data = await res.json();
  const reply = data.choices[0].message.content;
  history.push({ role: 'assistant', content: reply });
  return reply;
}

export function resetHistory() {
  history = [history[0]];
}

function mockReply(input) {
  const t = input.toLowerCase().trim();
  if (t.match(/^(hi|hello|hey)/)) return 'Hello! How can I help you today?';
  if (t.includes('how are you')) return "I'm doing well, thanks for asking. What can I help you with?";
  if (t.includes('joke')) return "Why did the developer quit? Because they didn't get arrays.";
  if (t.includes('your name')) return "I'm ChatGPT, made by OpenAI.";
  return `This is a mock response. To get real answers, add your API key to \`.env\` as \`VITE_OPENAI_KEY\`.\n\nYou asked: "${input}"`;
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
