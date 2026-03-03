import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/input.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'input.html'));
});

app.get('/gameplan.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'gameplan.html'));
});



app.listen(3000, () => console.log('Server running on port 3000'));
