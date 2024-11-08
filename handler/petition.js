import express from 'express';
// import { uploadDocuments } from '../server/document.js';
import { insertPetition, deletePetition, updatePetition, getPetitions, getPetition, insertComment } from '../server/db.js'
const router = express.Router();

router.post('/api/petition/upload', async (req, res) => {
    const { type, content } = req.body;
    if (!type || !content) {
        return res.status(400).json({ error: 'Type and content are required' });
    }
    try {
        let result
        if (type === 'add/remove') {
            result = await addOrRemoveCourses(content);

        }

        if (result) {
            insertComment({
                petition_id: result.data.id,
            })
            return res.status(200).json({ data: result.data });
        }
        return res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/api/petition/get', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    try {
        const result = await getPetition(id);
        if (result) {
            return res.status(200).json({ data: result });
        }
        return res.status(400).json({ error: 'Invalid ID' });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})


router.post('/api/petition/get_all', async (req, res) => {
    const { student_id } = req.body;
    if (!student_id) {
        return res.status(400).json({ error: 'student_id is required' });
    }

    try {
        const result = await getPetitions(student_id);
        if (result) {
            return res.status(200).json({ data: result });
        }
        return res.status(400).json({ error: 'Invalid student_id' });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/api/petition', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'student_id is required' });
    }

    try {
        const result = await deletePetition(id);
        if (result) {
            return res.status(200).json({ status: 'success' });
        }
        return res.status(400).json({ error: 'Invalid student_id' });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/api/petition', async (req, res) => {
    const { id, petition } = req.body;

    if (!id || !petition) {
        return res.status(400).json({ error: 'ID, type and content are required' });
    }

    try {
        const result = await updatePetition(id, petition);
        if (result) {
            return res.status(200).json({ data: result });
        }
        return res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
        console.log(petition)
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

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
 */
const addOrRemoveCourses = async (content) => {
    if (!content) {
        throw new Error('Content is required');
    }

    try {
        // Parse and validate the content using Zod
        const row = await insertPetition(content);
        return {
            data: row[0]
        }
    } catch (error) {
        throw new Error('Error inserting petition');
    }

    /** @type {string[]} */
    // const documentPublicIDs = await uploadDocuments(content);
    // content['documents'] = documentPublicIDs;


}


export default router;
