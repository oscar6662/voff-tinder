import express from 'express';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8000;
const IP = process.env.IP || '127.0.0.1';

const app = express();
app.use(express.static(path.join(__dirname, '/../client/build')));

app.get('/api/dog', async (req, res) => {
    try {
        const d = await fetch('https://dog.ceo/api/breeds/image/random');
        const j = await d.json();
        return res.json(j);
    } catch (error) {
        return res.status(500).json({'error': error })
    }
});

app.get('/api/breeds', async (req, res) => {
    try {
        const d = await fetch('https://dog.ceo/api/breeds/list/all');
        const j = await d.json();
        return res.json(j);
    } catch (error) {
        return res.status(500).json({'error': error })
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

function notFoundHandler(req, res) {
    res.status(500).json({ error: 'Something went wrong' });
}

function errorHandler(err, req, res) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
}

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});