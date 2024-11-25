import { POOL } from "../db.js";
/**
 * @typedef {Object} Petition
 * @property {number} student_id
 * @property {string} type
 * @property {'pending' | 'approved' | 'rejected'} status
 * @property {string} advisor
 * @property {number[]} documents
 * @property {Object} content
 */

/**
 * Insert a new petition into the database
 * @param {Petition} petition
 * @returns {Promise<Petition>} inserted row
 */
export const insertPetition = async (petition) => {
	const { student_id, type, advisor, content } = petition;
	const { rows } = await POOL.query(
		"INSERT INTO petitions (student_id, type, advisor, content) VALUES ($1, $2, $3, $4) RETURNING *",
		[student_id, type, advisor, content],
	);

	return rows;
};

/** Get all petitions by student_id
 * @param {number} student_id
 * @returns {Promise<Petition[]>} all petitions
 * */
export const getPetitions = async (student_id) => {
	const { rows } = await POOL.query(
		"SELECT * FROM petitions WHERE student_id = $1",
		[student_id],
	);
	return rows;
};

export const getPetitionsByRole = async (role) => {
	const { rows } = await POOL.query(
		`SELECT p.*
        FROM petitions p
        JOIN approvals a ON p.id = a.petition_id
        WHERE a.${role}_id IS NULL`,
	);
	return rows;
};

/** Get a petition by petition_id
 * @param {string} petition_id
 * @returns {Promise<Object>} petition
 * */
export const getPetition = async (petition_id) => {
	const { rows } = await POOL.query(
		"SELECT * FROM petitions WHERE id = $1 LIMIT 1",
		[petition_id],
	);
	return rows[0];
};

/** Update a petition by petition_id
 * @param {string} petition_id
 * @param {Petition} petition
 * @returns {Object} updated petition
 * */
export const updatePetition = async (petition_id, petition) => {
	const { advisor, content, status } = petition;

	const { rows } = await POOL.query(
		"UPDATE petitions SET advisor = $1, content = $2, status = $3 WHERE id = $4 RETURNING *",
		[advisor, content, status, petition_id],
	);
	return rows[0];
};

/** Delete a petition by petition_id
 * @param {string} petition_id
 * @returns {Promise<Petition>}
 * */
export const deletePetition = async (petition_id) => {
	const { rows } = await POOL.query(
		"DELETE FROM petitions WHERE id = $1 RETURNING *",
		[petition_id],
	);
	return rows[0];
};
