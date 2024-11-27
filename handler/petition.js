import express from "express";
import {
	insertPetition,
	deletePetition,
	updatePetition,
	getPetitions,
	getPetition,
	getPetitionsByRole,
} from "../server/db/petition.js";

import {
	deleteDocumentsByPublicIDs,
	deleteDocumentsInDatabaseByPublicIDs,
} from "../server/document.js";
import { insertComment } from "../server/db/comment.js";
import { getDocumentsByPetitionId } from "../server/db/document.js";
import { createApproval } from "../server/db/approval.js";

const router = express.Router();

router.post("/api/petition", async (req, res) => {
	const { type, content } = req.body;

	if (!type || !content) {
		return res.status(400).json({ error: "Type and content are required" });
	}
	try {
		let result;
		if (type === "add/remove") {
			result = await addOrRemoveCourses(content);
		}

		if (result) {
			const comment = await insertComment({
				petition_id: result.data.id,
			});
			if (!comment) {
				return res.status(500).json({ error: "Failed to create comment" });
			}
			await createApproval(result.data.id, comment.id);
			return res.status(200).json({ data: result.data });
		}
		return res.status(400).json({ error: "Invalid type" });
	} catch (error) {
		console.error("Fetch error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/api/petition/:id", async (req, res) => {
	const { id } = req.params;
	if (!id) {
		return res.status(400).json({ error: "ID is required" });
	}
	try {
		const result = await getPetition(id);
		if (result) {
			return res.status(200).json({ data: result });
		}
		return res.status(400).json({ error: "Invalid ID" });
	} catch (error) {
		console.error("Fetch error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/api/petitions/:student_id", async (req, res) => {
	const { student_id } = req.params;

	if (!student_id) {
		return res
			.status(400)
			.json({ error: "student_id is required for students" });
	}

	// Fetch petitions for the student
	try {
		const result = await getPetitions(student_id);
		if (result.length > 0) {
			return res.status(200).json({ data: result });
		}
		return res
			.status(404)
			.json({ error: "No petitions found for the given student_id" });
	} catch (error) {
		console.error("Fetch error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.get("/api/petitions/role/:role", async (req, res) => {
	const { role } = req.params;
	const { status = "waiting" } = req.query;

	const roles = ["staff", "advisor", "instructor", "dean"];

	if (role && roles.includes(role)) {
		try {
			const result = await getPetitionsByRole(role, status);

			if (result.length > 0) {
				return res.status(200).json({ data: result });
			}
			return res
				.status(404)
				.json({ error: `No petitions found for role: ${role}` });
		} catch (error) {
			console.error("Fetch error:", error);
			return res.status(500).json({ error: "Internal server error" });
		}
	}

	return res.status(400).json({
		error: "Valid role is required (student, staff, advisor, instructor, dean)",
	});
});

router.delete("/api/petition/:id", async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).json({ error: "id is required" });
	}

	try {
		const documents = await getDocumentsByPetitionId(id);

		const result = await deletePetition(id);
		if (documents.length > 0 && result) {
			// Delete on Cloudinary
			const public_ids = documents.map((document) => document.public_id);
			await deleteDocumentsByPublicIDs(public_ids);

			// Delete on db
			await deleteDocumentsInDatabaseByPublicIDs(public_ids);
			return res.status(200).json({ data: result });
		}
		return res.status(400).json({ error: "Invalid student_id" });
	} catch (error) {
		console.error("Fetch error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

router.put("/api/petition", async (req, res) => {
	const { id, petition } = req.body;

	if (!id || !petition) {
		return res.status(400).json({ error: "ID, type and content are required" });
	}

	try {
		const result = await updatePetition(id, petition);
		if (result) {
			return res.status(200).json({ data: result });
		}
		return res.status(400).json({ error: "Invalid type" });
	} catch (error) {
		console.error("Fetch error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

/**
 * @typedef {Object} StudentInfo
 * @property {string} name_title
 * @property {string} student_id
 * @property {number} year
 * @property {string} major
 */

/**
 * @typedef {Object} Location
 * @property {string} house_no
 * @property {string} village_no
 * @property {string} sub_district
 * @property {string} district
 * @property {string} province
 * @property {string} postal_code
 */

/**
 * @typedef {Object} Course
 * @property {string} course_id
 * @property {string} course_name
 * @property {number} section
 * @property {Date} date
 * @property {number} credit
 * @property {string} lecturer
 * @property {string} approve_by
 */

/**
 * @typedef {Object} Content
 * @property {string} topic
 * @property {Date} date
 * @property {string} person_in_charge
 * @property {StudentInfo} student_info
 * @property {Location} location
 * @property {string} phone_no
 * @property {string} telephone_no
 * @property {string} advisor
 * @property {boolean} is_add
 * @property {Course[]} courses
 * @property {string} reason
 */

/**
 * Insert add/remove course document to the database.
 * @param {Content} content - The content object containing course details.
 * @returns {Promise<Petition>} The inserted row data.
 */
const addOrRemoveCourses = async (content) => {
	if (!content) {
		throw new Error("Content is required");
	}

	try {
		// Parse and validate the content using Zod
		const row = await insertPetition(content);
		return {
			data: row[0],
		};
	} catch (error) {
		throw new Error("Error inserting petition");
	}
};

export default router;
