// Vercel Serverless Proxy for DownloadEverything
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Referer, User-Agent');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check on GET
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'DE Proxy is running', service: 'defe-proxy', endpoint: '/api' });
  }

  const targetUrl = 'https://slave.downloadeverythingfromeverywhere.com/';

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Origin': 'https://downloadeverythingfromeverywhere.com',
        'Referer': 'https://downloadeverythingfromeverywhere.com/',
        'DNT': '1',
      },
      body: JSON.stringify(req.body),
    });

    const body = await response.text();
    res.status(response.status);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    res.send(body);

  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Proxy failed', detail: error.message });
  }
}
