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

export const getPetitionsByRole = async (role, status = "all") => {
    // Valid roles and mapping to column names
    const roleColumnMap = {
        dean: "dean",
        staff: "staff",
        instructor: "instructor",
        advisor: "advisor",
    };
    const roleColumn = roleColumnMap[role];
    if (!roleColumn) {
        throw new Error(`Invalid role: ${role}`);
    }

    // Base query
    let query = `
        SELECT p.*, a.*
        FROM petitions p
        JOIN approvals a ON p.id = a.petition_id
    `;

    // Parameters for the query
    const params = [];

    // Handle status filter logic
    if (status === "waiting") {
        // For waiting status, ${role}_id should be NULL
        query += `WHERE a.${roleColumn}_id IS NULL`;
    } else if (status === "rejected" || status === "approved") {
        // For rejected or approved status, ${role}_id should NOT be NULL
        query += `WHERE a.${roleColumn}_id IS NOT NULL AND a.${roleColumn}_status = $1`;
        params.push(status);
    } else if (status !== "all") {
        // Handle invalid status values (optional)
        throw new Error(`Invalid status: ${status}`);
    }

    try {
        // Execute the query with the parameters
        const { rows } = await POOL.query(query, params);
        return rows;
    } catch (error) {
        console.error("Error fetching petitions by role:", error);
        throw error;
    }
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

export const updatePetitionStatus = async (petition_id, status) => {
    const { rows } = await POOL.query(
        "UPDATE petitions SET status = $1 WHERE id = $2 RETURNING *",
        [status, petition_id],
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
