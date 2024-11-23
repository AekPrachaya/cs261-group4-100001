import { PORT } from './config.js';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { isAuthenticated } from './middleware.js';
import cors from 'cors';



import authRouter from './handler/auth.js';
import petitionRouter from './handler/petition.js';
import commentRouter from './handler/comment.js';
import fileRouter from './handler/file.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(session({
    secret: "f4e7945b-4a3e-4b34-bf56-6091e4d4f58b",
    resave: false,
    saveUninitialized: true,
    cookies: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}))

app.use(cors({
    origin: 'http://127.0.0.1:3000',  // ต้องเป็นโดเมนที่คุณต้องการอนุญาต
    credentials: true  // อนุญาตให้ส่งข้อมูลประจำตัว (cookies, HTTP authentication)
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());


// handlers

app.use(authRouter);
app.use(fileRouter);
app.use(petitionRouter);
app.use(commentRouter);


app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));

})
app.use(isAuthenticated);

app.get('/status', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'status.html'));
})

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'proflie.html'));
})

app.get('/request', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'request.html'));
})


const LISTENING_PORT = PORT || 3000;
app.listen(LISTENING_PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${LISTENING_PORT}`)
});
