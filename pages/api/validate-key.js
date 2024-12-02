// pages/api/validate-key.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { apiKey } = req.body;
  
    if (!apiKey || !apiKey.startsWith('sk-')) {
      return res.status(400).json({ error: 'Invalid API key format' });
    }
  
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-opus-20240229",
          messages: [{
            role: "user",
            content: "Hi"
          }]
        })
      });
  
      if (response.ok) {
        return res.status(200).json({ success: true });
      } else {
        const data = await response.text();
        return res.status(400).json({ error: 'Invalid API key' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Server error validating key' });
    }
  }