import express from 'express';
import { getComment, insertComment, updateComment } from '../server/db';

const router = express.Router();

router.post('/api/comment/add', async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({ error: 'Comment is required' });
    }
    try {
        const result = await insertComment(comment);

        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/api/comment/get', async (req, res) => {
    const { petition_id } = req.body;
    if (!petition_id) {
        return res.status(400).json({ error: 'Petition ID is required' });
    }
    try {
        const result = await getComment(petition_id);
        if (result) {
            return res.status(200).json({ data: result });
        }
        return res.status(400).json({ error: 'Invalid petition ID' });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/api/comment/update', async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({ error: 'Comment is required' });
    }
    try {
        const result = await updateComment(comment);

        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


export default router;
