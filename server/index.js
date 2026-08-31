import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Generic proxy endpoint for LLM requests.
// Configure provider via environment variables:
// - LLM_API_URL: full provider API URL
// - LLM_API_KEY: API key or bearer token

app.post('/api/llm', async (req, res) => {
  const { prompt } = req.body || {};
  const LLM_URL = process.env.LLM_API_URL;
  const LLM_KEY = process.env.LLM_API_KEY;
  const PROVIDER = (process.env.LLM_PROVIDER || '').toLowerCase();
  const MODEL = process.env.LLM_MODEL || '';

  // Support a local mock provider for safe testing without keys
  if (PROVIDER === 'mock' || (!LLM_URL && !LLM_KEY)) {
    const mockResult = { candidates: [{ output: `{"action":"BUY","shares":5,"rationale":"Mocked suggestion: favorable dip detected."}` }] };
    return res.status(200).json({ proxied: true, provider: 'mock', data: mockResult });
  }

  try {
    let fetchUrl = LLM_URL;
    let fetchOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

    if (PROVIDER === 'mock') {
      // Local mock response for testing without any external key
      const mockResult = { candidates: [{ output: `{"action":"BUY","shares":5,"rationale":"Mocked suggestion: favorable dip detected."}` }] };
      return res.status(200).json({ proxied: true, provider: 'mock', data: mockResult });
    }

    if (PROVIDER === 'gemini' || PROVIDER === 'vertex') {
      // For Google Generative API / Vertex AI: append key as query param and send { prompt: { text } }
      // Example LLM_API_URL: https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText
      const url = new URL(LLM_URL);
      url.searchParams.set('key', LLM_KEY);
      fetchUrl = url.toString();
      fetchOptions.body = JSON.stringify({ prompt: { text: prompt }, temperature: 0.2 });
    } else if (PROVIDER === 'openai') {
      // OpenAI chat completions endpoint expects Authorization header and messages array
      fetchOptions.headers['Authorization'] = `Bearer ${LLM_KEY}`;
      const model = MODEL || 'gpt-4o-mini';
      fetchUrl = LLM_URL; // e.g. https://api.openai.com/v1/chat/completions
      fetchOptions.body = JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.2 });
    } else {
      // Generic passthrough with Bearer
      fetchOptions.headers['Authorization'] = `Bearer ${LLM_KEY}`;
      fetchOptions.body = JSON.stringify({ prompt });
    }

    const response = await fetch(fetchUrl, fetchOptions);
    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) data = await response.json();
    else data = await response.text();

    res.status(response.status).json({ proxied: true, provider: PROVIDER || 'generic', data });
  } catch (err) {
    console.error('LLM proxy error:', err);
    res.status(502).json({ error: 'LLM proxy request failed', detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`LLM proxy running on port ${PORT}`);
});
