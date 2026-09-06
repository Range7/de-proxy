const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Referer, User-Agent');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'DE Proxy is running', service: 'defe-proxy' });
});

// Proxy endpoint for DownloadEverything slave API
app.post('/api', async (req, res) => {
    try {
        const targetUrl = 'https://slave.downloadeverythingfromeverywhere.com/';

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
        res.set('Content-Type', response.headers.get('content-type') || 'application/json');
        res.send(body);

    } catch (error) {
        console.error('Proxy error:', error.message);
        res.status(500).json({ error: 'Proxy failed', detail: error.message });
    }
});

// Also support GET for health checks
app.get('/api', async (req, res) => {
    try {
        const response = await fetch('https://slave.downloadeverythingfromeverywhere.com/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            }
        });
        const body = await response.text();
        res.status(response.status).send(body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`DE Proxy running on port ${PORT}`);
});
