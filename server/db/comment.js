import { POOL } from "../db.js";
/**
 * Adds a comment to the comments table.
 *
 * @param {Object} comment - The comment data to insert.
 * @param {string} comment.petition_id - The UUID of the associated petition.
 * @param {string} [comment.advisor_comment] - The comment from the advisor (optional).
 * @param {Date} [comment.advisor_date] - The date of the advisor's comment (optional).
 * @param {string} [comment.staff_comment] - The comment from the staff (optional).
 * @param {string} [comment.staff_signature] - The staff member's signature (optional).
 * @param {Date} [comment.staff_date] - The date of the staff's comment (optional).
 * @param {string} [comment.instructor_comment] - The comment from the instructor (optional).
 * @param {string} [comment.instructor_signature] - The instructor's signature (optional).
 * @param {Date} [comment.instructor_date] - The date of the instructor's comment (optional).
 * @param {string} [comment.dean_status] - The dean's status ('approved', 'rejected', 'proceed') (optional).
 * @param {string} [comment.dean_comment] - The dean's comment (optional).
 * @param {string} [comment.dean_signature] - The dean's signature (optional).
 * @param {Date} [comment.dean_date] - The date of the dean's comment (optional).
 * @returns {Promise<Object>} The inserted comment data.
 */
export const insertComment = async (comment) => {
	const { rows } = await POOL.query(
		"INSERT INTO comments (petition_id, advisor_comment, advisor_date, staff_comment, staff_signature, staff_date, instructor_comment, instructor_signature, instructor_date, dean_status, dean_comment, dean_signature, dean_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *",
		[
			comment.petition_id,
			comment.advisor_comment,
			comment.advisor_date,
			comment.staff_comment,
			comment.staff_signature,
			comment.staff_date,
			comment.instructor_comment,
			comment.instructor_signature,
			comment.instructor_date,
			comment.dean_status,
			comment.dean_comment,
			comment.dean_signature,
			comment.dean_date,
		],
	);
	return rows[0];
};

/**
 * Gets all comments for a petition.
 *
 * @param {string} petition_id - The UUID of the petition.
 * @returns {Promise<Object[]>} The comments for the petition.
 */
export const getComment = async (petition_id) => {
	const { rows } = await POOL.query(
		"SELECT * FROM comments WHERE petition_id = $1",
		[petition_id],
	);
	return rows;
};

/**
 * Updates a comment by petition_id.
 *
 * @param {string} petition_id - The UUID of the petition.
 * @param {Object} comment - The updated comment data.
 * @param {string} comment.petition_id - The UUID of the associated petition.
 * @param {string} [comment.advisor_comment] - The comment from the advisor (optional).
 * @param {Date} [comment.advisor_date] - The date of the advisor's comment (optional).
 * @param {string} [comment.staff_comment] - The comment from the staff (optional).
 * @param {string} [comment.staff_signature] - The staff member's signature (optional).
 * @param {Date} [comment.staff_date] - The date of the staff's comment (optional).
 * @param {string} [comment.instructor_comment] - The comment from the instructor (optional).
 * @param {string} [comment.instructor_signature] - The instructor's signature (optional).
 * @param {Date} [comment.instructor_date] - The date of the instructor's comment (optional).
 * @param {string} [comment.dean_status] - The dean's status ('approved', 'rejected', 'proceed') (optional).
 * @param {string} [comment.dean_comment] - The dean's comment (optional).
 * @param {string} [comment.dean_signature] - The dean's signature (optional).
 * @param {Date} [comment.dean_date] - The date of the dean's comment (optional).
 * @returns {Promise<Object>} The updated comment data.
 */
export const updateComment = async (petition_id, comment) => {
	const { rows } = await POOL.query(
		"UPDATE comments SET advisor_comment = $1, advisor_date = $2, staff_comment = $3, staff_signature = $4, staff_date = $5, instructor_comment = $6, instructor_signature = $7, instructor_date = $8, dean_status = $9, dean_comment = $10, dean_signature = $11, dean_date = $12 WHERE petition_id = $13 RETURNING *",
		[
			comment.advisor_comment,
			comment.advisor_date,
			comment.staff_comment,
			comment.staff_signature,
			comment.staff_date,
			comment.instructor_comment,
			comment.instructor_signature,
			comment.instructor_date,
			comment.dean_status,
			comment.dean_comment,
			comment.dean_signature,
			comment.dean_date,
			petition_id,
		],
	);
	return rows[0];
};
