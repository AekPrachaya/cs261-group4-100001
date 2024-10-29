import express from 'express';
import session from 'express-session';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();
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

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized access' });
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/api/login', async (req, res) => {

    if (process.env.TU_API_KEY === undefined) {
        console.error("Please set the TU_API_KEY environment variable");
        return res.status(500).json({ message: "Internal Server Error" })
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }
    try {
        const response = await fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Application-Key": process.env.TU_API_KEY
            },
            body: JSON.stringify({
                "UserName": username,
                "PassWord": password
            })
        });

        if (response.status === 400) {
            return res.status(response.status).send(response.statusText);
        }

        if (response.status === 403) {
            console.error('Invalid API key');
            return res.status(response.status).send('Internal server error');
        }

        if (response.status === 401) {
            console.error("Application-Key header required");
            return res.status(response.status).send('Internal server error');
        }

        if (!response.ok) {
            console.error('Internal server error');
            return res.status(response.status).send(response.statusText);
        }

        const result = await response.json();
        req.session.user = {
            id: result["username"],
        }
        return res.status(200).send(result);
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error in logging out');
        }
        res.send('Logged out successfully');
    });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${PORT}`)
});
