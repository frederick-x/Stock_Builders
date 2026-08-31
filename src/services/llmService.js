// Frontend wrapper that talks to the local proxy at /api/llm
export async function generateAgentSignal(prompt) {
  const res = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`LLM proxy error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  // Server wraps provider response as { proxied: true, provider, data }
  const payload = data && data.proxied ? data.data : data;

  // Common provider shapes
  if (!payload) return JSON.stringify(data);
  if (typeof payload === 'string') return payload;
  if (payload.outputText) return payload.outputText;

  // OpenAI-style
  if (payload.choices && payload.choices[0]) {
    return payload.choices[0].text || (payload.choices[0].message && payload.choices[0].message.content) || JSON.stringify(payload.choices[0]);
  }

  // Vertex / Gemini style: candidates array
  if (payload.candidates && payload.candidates[0]) {
    const cand = payload.candidates[0];
    return cand.output || cand.content || cand.text || JSON.stringify(cand);
  }

  // Generic result fields
  if (payload.result) return payload.result;
  if (payload.data && Array.isArray(payload.data) && payload.data[0]) return JSON.stringify(payload.data[0]);

  return JSON.stringify(payload);
}
