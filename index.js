import { PORT } from './config.js';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { isAuthenticated } from './middleware.js';

// handlers
import authRouter from './handler/auth.js';
import petitionRouter from './handler/petition.js';
import commentRouter from './handler/comment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(session({
    secret: "f4e7945b-4a3e-4b34-bf56-6091e4d4f58b",
    resave: false,
    saveUninitialized: true,
    cookies: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}))

app.use(isAuthenticated);

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
})

app.get('/petition', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'petition.html'));
})

app.get('/profile', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
})

app.get('/request', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'request.html'));
})

app.use(authRouter);
app.use(petitionRouter);
app.use(commentRouter);

const LISTENING_PORT = PORT || 3000;
app.listen(LISTENING_PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${LISTENING_PORT}`)
});
