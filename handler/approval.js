import express from "express";
import {
	getApprovalByPetitionId,
	updateApproval,
} from "../server/db/approval.js";

const router = express.Router();

router.put("/api/approval/:petition_id", async (req, res) => {
	const { petition_id } = req.params;
	const { authorizor, status } = req.body;

	const authorizers = ["advisor", "staff", "instructor", "dean"];
	if (!authorizers.includes(authorizor)) {
		return res.status(400).json({ error: "Invalid authorizor" });
	}

	try {
		const approval = await updateApproval(petition_id, authorizor, status);
		return res.status(200).json({ data: approval });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

router.get("/api/approval/:petition_id", async (req, res) => {
	const { petition_id } = req.params;

	try {
		const approval = await getApprovalByPetitionId(petition_id);
		return res.status(200).json({ data: approval });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
