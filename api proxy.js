// File: api/proxy.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const streamUrl = req.query.url;
    const userAgent = req.query.userAgent;

    if (!streamUrl) {
        return res.status(400).send('Error: URL parameter is missing.');
    }

    // CORS Headers - Vercel এর জন্য আবশ্যক
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const headers = {
            'User-Agent': userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };

        const response = await fetch(streamUrl, { headers });

        if (!response.ok) {
            return res.status(response.status).send(`Error fetching stream: ${response.statusText}`);
        }

        // Response হেডারগুলো ক্লায়েন্টের কাছে পাঠিয়ে দেওয়া
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/vnd.apple.mpegurl');
        res.setHeader('Content-Length', response.headers.get('content-length'));

        // স্ট্রিম পাইপ করা
        response.body.pipe(res);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).send(`Server Error: ${error.message}`);
    }
};