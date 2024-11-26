import express from "express";
import {
    getComment,
    insertComment,
    updateComment,
} from "../server/db/comment.js";

const router = express.Router();

router.post("/api/comment", async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({ error: "Comment is required" });
    }
    try {
        const result = await insertComment(comment);

        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/api/comment/:id", async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "ID is required" });
    }
    try {
        const result = await getComment(id);
        if (result) {
            return res.status(200).json({ data: result });
        }
        return res.status(400).json({ error: "Invalid petition ID" });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/api/comment", async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).json({ error: "Comment is required" });
    }
    try {
        const result = await updateComment(comment);

        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
