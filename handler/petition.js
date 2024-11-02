import express from 'express';
import { uploadDocuments } from '../server/document.js';
import { insertPetition, deletePetition } from '../server/db.js'
const router = express.Router();

router.post('/api/upload', async (req, res) => {
    const { type, content, files } = req.body;

    if (!type || !content) {
        return res.status(400).json({ error: 'Type and content are required' });
    }

    try {
        if (type === 'add/remove') {
            return await addOrRemoveCourses(content, files);
        }
        return res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete('/api/delete', async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    try {
        return await deletePetition(id);
    } catch (error) {
        console.error("Fetch error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

router.put('/api/update', async (req, res) => {
    const { id, petition } = req.body;

    if (!id || !petition) {
        return res.status(400).json({ error: 'ID, type and content are required' });
    }

    try {
        if (type === 'add/remove') {

            return await updatePetition(id, petition);
        }
        return res.status(400).json({ error: 'Invalid type' });
    } catch (error) {
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

    // Validate the content object
    if (!content || !content.topic || !content.date || !content.person_in_charge || !content.student_info || !content.location || !content.phone_no || !content.telephone_no || !content.advisor || !content.is_add || !content.courses || !content.reason) {
        throw new Error('Invalid content object');
    }

    // Validate the student_info object
    if (!content.student_info || !content.student_info.name_title || !content.student_info.student_id || !content.student_info.year || !content.student_info.major) {
        throw new Error('Invalid student_info object');
    }

    // Validate the location object
    if (!content.location || !content.location.house_no || !content.location.village_no || !content.location.sub_district || !content.location.district || !content.location.province || !content.location.postal_code) {
        throw new Error('Invalid location object');
    }

    // Validate the courses array
    if (!content.courses || content.courses.length === 0) {
        throw new Error('Invalid courses array');
    }

    // Validate each course object
    for (const course of content.courses) {
        if (!course || !course.course_id || !course.course_name || !course.section || !course.date || !course.credit || !course.lecturer || !course.approve_by) {
            throw new Error('Invalid course object');
        }
    }
    /** @type {string[]} */
    const documentPublicIDs = await uploadDocuments(content);
    content['documents'] = documentPublicIDs;

    const row = await insertPetition(content);
    return row;
}


export default router;
