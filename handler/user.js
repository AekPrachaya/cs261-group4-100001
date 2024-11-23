import express from 'express';
import {
    insertPetition, deletePetition, updatePetition, getPetitions, getPetition
} from '../server/db/petition.js';

import { deleteDocumentsByPublicIDs, deleteDocumentsInDatabaseByPublicIDs } from '../server/document.js';
import { insertComment } from '../server/db/comment.js';
import { getDocumentsByPetitionId } from '../server/db/document.js';

const router = express.Router();

router.post('/api/user', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password and role are required' });
    }

    try {
        const result = await createUser(username, password, role);
        if (result) {
            return res.status(200).json({ data: result });
        }
        return res.status(400).json({ error: 'Invalid username or password' });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }

})

router.delete('/api/user/:username', async (req, res) => {
    if (req.session.user.role !== 'staff') {
        return res.status(403).json({ error: 'Unauthorized' });
    }
    const { username } = req.params;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    try {
        const result = await removeUser(username);
        if (result) {
            return res.status(200).json({ data: result });
        }
        return res.status(400).json({ error: 'Invalid username' });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;
