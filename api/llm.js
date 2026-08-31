export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { prompt } = req.body || {};
    const LLM_URL = process.env.LLM_API_URL;
    const LLM_KEY = process.env.LLM_API_KEY;
    const PROVIDER = (process.env.LLM_PROVIDER || '').toLowerCase();
    const MODEL = process.env.LLM_MODEL || '';

    // Mock fallback when no provider configured
    if (PROVIDER === 'mock' || (!LLM_URL && !LLM_KEY)) {
      const mockResult = { candidates: [{ output: JSON.stringify({ action: 'BUY', shares: 5, rationale: 'Mocked suggestion: favorable dip detected.' }) }] };
      return res.status(200).json({ proxied: true, provider: 'mock', data: mockResult });
    }

    let fetchUrl = LLM_URL;
    let fetchOptions = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

    if (PROVIDER === 'gemini' || PROVIDER === 'vertex') {
      const u = new URL(LLM_URL);
      if (LLM_KEY) u.searchParams.set('key', LLM_KEY);
      fetchUrl = u.toString();
      fetchOptions.body = JSON.stringify({ prompt: { text: prompt }, temperature: 0.2 });
    } else if (PROVIDER === 'openai') {
      if (LLM_KEY) fetchOptions.headers['Authorization'] = `Bearer ${LLM_KEY}`;
      const model = MODEL || 'gpt-4o-mini';
      fetchOptions.body = JSON.stringify({ model, messages: [{ role: 'user', content: prompt }], temperature: 0.2 });
    } else {
      if (LLM_KEY) fetchOptions.headers['Authorization'] = `Bearer ${LLM_KEY}`;
      fetchOptions.body = JSON.stringify({ prompt });
    }

    const r = await fetch(fetchUrl, fetchOptions);
    const contentType = r.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) data = await r.json();
    else data = await r.text();

    return res.status(r.status).json({ proxied: true, provider: PROVIDER || 'generic', data });
  } catch (err) {
    console.error('LLM function error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
