import express from 'express';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import redis from 'redis';

/**
 * Express, redis and enviroment vairables set up.
 */
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 8000;
const API_URL = process.env.API_URL;
const redisOptions = {
    url: 'redis://127.0.0.1:6379/0  ',
};

const app = express();
const client = redis.createClient(redisOptions);

app.use(express.static(path.join(__dirname, '/../client/build')));
await client.connect();

/**
 * Random pic with optional breed&subreed query parameters
 */
app.get('/api/dog', async (req, res) => {
    const { breed } = req.query;
    const { subreed } = req.query;
    try {
        let url = `${API_URL}/api/breeds/image/random`;
        breed.trim() && (
            url = `${API_URL}/api/breed/${breed}/images/random`
        );
        subreed.trim() && (
            url = `${API_URL}/api/breed/${breed}/${subreed}/images/random`
        );
        const d = await fetch(url);
        const j = await d.json();
        return res.json(j);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 'error': error })
    }
});

/**
 * List of available breeds&subreeds (uses cacheing)
 */
app.get('/api/breeds', async (req, res) => {
    try {
        const cached = await client.get('listOfBreeds');
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        const d = await fetch(`${API_URL}/api/breeds/list/all`);
        const j = await d.json();
        await client.set('listOfBreeds', JSON.stringify(j));
        return res.json(j);
    } catch (error) {
        return res.status(500).json({ 'error': error })
    }
});

/**
 * Exception Calls
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

function notFoundHandler(req, res) {
    res.status(404).json({ error: 'Something went wrong' });
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