const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000; // Railway নিজে থেকে PORT দেবে

app.use(cors()); // CORS চালু করা হলো

app.get('/', (req, res) => {
    const streamUrl = req.query.url;
    const userAgent = req.query.userAgent;

    if (!streamUrl) {
        return res.status(400).send('Error: URL parameter is missing.');
    }

    fetch(streamUrl, {
        headers: { 'User-Agent': userAgent || 'Mozilla/5.0' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        // হেডারগুলো ক্লায়েন্টের কাছে পাঠিয়ে দেওয়া
        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Content-Length', response.headers.get('content-length'));
        // স্ট্রিম পাইপ করা
        response.body.pipe(res);
    })
    .catch(error => {
        console.error('Proxy Error:', error);
        res.status(500).send(`Server Error: ${error.message}`);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
