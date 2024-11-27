import express from "express";
import multer from "multer";
import { addDocument } from "../server/db/document.js";
import {
    deleteDocumentsByPublicIDs,
    getDocumentsByPetitionID,
    uploadDocuments,
} from "../server/document.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/api/files", upload.array("files"), async (req, res) => {
    const { petition_id, filename } = req.body;
    const files = req.files;
    if (!files || !petition_id) {
        return res
            .status(400)
            .json({ error: "Files and petition_id are required" });
    }

    try {
        const public_ids = await uploadDocuments(files, filename, petition_id);
        if (!public_ids) {
            return res.status(400).json({ error: "Error uploading files" });
        }
        const promises = public_ids.map((public_id) =>
            addDocument(petition_id, public_id),
        );
        const insertFileResult = await Promise.all(promises);
        if (!insertFileResult) {
            return res.status(400).json({ error: "Error inserting files" });
        }

        const insertPublicIDs = insertFileResult.map((result) => result);

        return res.status(200).json({ data: insertPublicIDs });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/api/files/:petition_id", async (req, res) => {
    const { petition_id } = req.params;
    if (!petition_id) {
        return res.status(400).json({ error: "petition_id is required" });
    }
    try {
        const result = await getDocumentsByPetitionID(petition_id);
        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/api/files", async (req, res) => {
    const { public_ids } = req.body;
    if (!public_ids) {
        return res.status(400).json({ error: "Public IDs is required" });
    }

    try {
        // Delete on Cloudinary
        const result = await deleteDocumentsByPublicIDs(public_ids);
        if (!result) {
            return res.status(400).json({ error: "Error deleting files" });
        }
        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/api/files/:petition_id", async (req, res) => {
    const { petition_id } = req.params;
    if (!petition_id) {
        return res.status(400).json({ error: "petition_id is required" });
    }
    try {
        const result = await getDocumentsByPetitionID(petition_id);
        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
