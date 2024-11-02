import pg from 'pg'
import { CREATE_PETITION_TABLE } from './sql/table.js'
import { POSTGRESQL_URL } from '../config.js'
if (!POSTGRESQL_URL) {
    throw new Error('Please set POSTGRESQL_URL environment variable')
}

const { Pool } = pg;

const POOL = new Pool({
    connectionString: POSTGRESQL_URL,
})

try {
    await POOL.connect();
} catch (error) {
    console.error('Error connecting to database', error)
}

await POOL.query(CREATE_PETITION_TABLE);

/**
 * @typedef {Object} Petition
 * @property {number} student_id
 * @property {string} type
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
    const { student_id, type, advisor, documents, content } = petition
    try {

        const { rows } = await POOL.query(
            'INSERT INTO petitions (student_id, type, advisor, documents, content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [student_id, type, advisor, documents, content]
        )
        return {
            status: 'success',
            data: rows[0]
        }
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        }
    }
}

/** Get all petitions by student_id
 * @param {number} student_id
 * @returns {Promise<Petition[]>} all petitions
 * */
export const getPetitions = async (student_id) => {
    try {
        const { rows } = await POOL.query('SELECT * FROM petitions WHERE student_id = $1', [student_id])
        return {
            status: 'success',
            data: rows
        }
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        }
    }
}

/** Get a petition by petition_id
 * @param {string} petition_id
 * @returns {Promise<Object>} petition
 * */
export const getPetition = async (petition_id) => {
    try {
        const { rows } = await POOL.query('SELECT * FROM petitions WHERE id = $1', [petition_id])
        return {
            status: 'success',
            data: rows[0]
        }
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        }
    }
}

/** Update a petition by petition_id
 * @param {string} petition_id
 * @param {Petition} petition
 * @returns {Object} updated petition
 * */
export const updatePetition = async (petition_id, petition) => {
    const { student_id, type, advisor, documents, content } = petition
    try {

        const { rows } = await POOL.query(
            'UPDATE petitions SET student_id = $1, type = $2, advisor = $3, documents = $4, content = $5 WHERE id = $6 RETURNING *',
            [student_id, type, advisor, documents, content, petition_id]
        )
        return {
            status: 'success',
            data: rows[0]
        }
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        }
    }

}

/** Delete a petition by petition_id
 * @param {string} petition_id
 * @returns {Promise<void>}
 * */
export const deletePetition = async (petition_id) => {
    try {
        const { rows } = await POOL.query('DELETE FROM petitions WHERE id = $1 RETURNING *', [petition_id])
        return {
            status: 'success',
            data: rows[0],
            message: 'Petition deleted'
        }
    } catch (error) {
        return {
            status: 'error',
            message: error.message
        }
    }
}
