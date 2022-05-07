import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();
const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const IP = process.env.IP || '127.0.0.1';

const app = express();
app.use(express.static(path.join(__dirname, '/../client/build')));

app.get('/api/authenticated', async (req, res) => {
    if (req.user && req.user.id) {
        return res.json({ loggedIn: req.user.id });
    }
    return res.json({ loggedIn: false });
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