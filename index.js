import { PORT } from './config.js';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { isAuthenticated } from './middleware.js';

// handlers
import authRouter from './handler/auth.js';
import petitionRouter from './handler/petition.js';

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.use(authRouter);
app.use(petitionRouter);

const LISTENING_PORT = PORT || 3000;
app.listen(LISTENING_PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${LISTENING_PORT}`)
});
