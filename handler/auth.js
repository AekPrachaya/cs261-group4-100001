import express from 'express';

const router = express.Router();

router.post('/api/login', async (req, res) => {

    if (!process.env.TU_API_KEY) {
        console.error("Please set the TU_API_KEY environment variable");
        return res.status(500).json({ error: "Internal Server Error" });
    }

    const { username, password } = req.body;
    // Validate request body
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
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

        // Handle API response statuses
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error: ${errorText}`);
            return res.status(response.status).json({ error: errorText });
        }

        const result = await response.json();
        delete result.status;
        delete result.message;
        req.session.user = result

        return res.redirect('/profile');
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Logout route
router.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.redirect('/');
    });
});

router.get('/api/session', (req, res) => {
    return res.json(req.session.user);
});

export default router;
