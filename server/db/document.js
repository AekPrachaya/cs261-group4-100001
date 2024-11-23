import { POOL } from "../db.js";

export const addDocument = async (petition_id, public_id) => {
	const { rows } = await POOL.query(
		"INSERT into documents (petition_id, public_id) VALUES ($1, $2) RETURNING *",
		[petition_id, public_id],
	);
	return rows[0];
};

export const deleteDocument = async (public_id) => {
	const { rows } = await POOL.query(
		"DELETE FROM documents WHERE public_id = $1 RETURNING *",
		[public_id],
	);
	return rows[0];
};

/*
 * get file info in document db
 * @param {string} petition_id
 * @returns {Promise<Object[]>} The file info
 * */
export const getDocumentsByPetitionId = async (petition_id) => {
	const { rows } = await POOL.query(
		"SELECT * FROM documents WHERE petition_id = $1",
		[petition_id],
	);
	return rows;
};
