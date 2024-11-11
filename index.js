import { PORT } from './config.js';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



app.use(cors({
    origin: 'http://127.0.0.1:3000',  // ต้องเป็นโดเมนที่คุณต้องการอนุญาต
    credentials: true  // อนุญาตให้ส่งข้อมูลประจำตัว (cookies, HTTP authentication)
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "f4e7945b-4a3e-4b34-bf56-6091e4d4f58b",
    resave: false,
    saveUninitialized: true,
}))

app.use(express.json());


// handlers
import authRouter from './handler/auth.js';
import petitionRouter from './handler/petition.js';
import commentRouter from './handler/comment.js';

app.use(authRouter);
app.use(petitionRouter);
app.use(commentRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
})

app.get('/petition', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'petition.html'));
})

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
})

app.get('/request', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'request.html'));
})


const LISTENING_PORT = PORT || 3000;
app.listen(LISTENING_PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${LISTENING_PORT}`)
});
