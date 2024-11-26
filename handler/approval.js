import express from "express";
import {
	getApprovalByPetitionId,
	updateApproval,
} from "../server/db/approval.js";

import { updatePetitionStatus } from "../server/db/petition.js";

const router = express.Router();

router.put("/api/approval/:petition_id", async (req, res) => {
	const { petition_id } = req.params;
	const { role, status } = req.body;

	const roles = ["advisor", "staff", "instructor", "dean"];
	if (!roles.includes(role)) {
		return res.status(400).json({ error: "Invalid authorizor" });
	}

	try {
		const approval = await updateApproval(
			petition_id,
			req.session.user.id,
			role,
			status,
		);

		const current_status = [
			approval.dean_status,
			approval.staff_status,
			approval.instructor_status,
			approval.advisor_status,
		];

		if (current_status.some((status) => status === "rejected")) {
			await updatePetitionStatus(petition_id, "rejected");
		} else if (current_status.every((status) => status === "approved")) {
			await updatePetitionStatus(petition_id, "approved");
		}

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
