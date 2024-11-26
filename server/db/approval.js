import { POOL } from "../db.js";

/* Create a new approval
 * @param {Number} petition_id
 * @param {Number} advisor_id
 * @param {Number} staff_id
 * @param {Number} instructor_id
 * @param {Number} dean_id
 * @returns {Object} approval
 * */
export const createApproval = async (petition_id, comment_id) => {
    const { rows } = await POOL.query(
        "INSERT INTO approvals (petition_id, comment_id) VALUES ($1, $2) RETURNING *",
        [petition_id, comment_id],
    );
    return rows[0];
};

export const getApprovalByPetitionId = async (petition_id) => {
    const { rows } = await POOL.query(
        "SELECT * FROM approvals WHERE petition_id = $1 LIMIT 1",
        [petition_id],
    );
    return rows[0];
};

export const updateApproval = async (petition_id, authorizor, status) => {
    const { rows } = await POOL.query(
        `UPDATE approvals SET ${authorizor}_status = $1, ${authorizor}_date = NOW() WHERE petition_id = $2 RETURNING *`,
        [status, petition_id],
    );
    return rows[0];
};
