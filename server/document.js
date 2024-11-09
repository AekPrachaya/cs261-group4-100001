import { v2 as cloudinary } from 'cloudinary';
import { deleteFile, insertFile } from '../server/db.js';
import streamifier from 'streamifier';

/* upload document
 * @param {Multer.File} file
 * @param {string} petitionID
 * @returns {string} public_id
 */
export const uploadDocument = async (file, petitionID) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `petitions/${petitionID}`,
                resource_type: 'raw',  // For non-image files like PDFs
            },
            (error, result) => {
                if (error) {
                    reject(error);  // Reject if there's an error
                } else {
                    resolve(result.public_id);  // Resolve with the public_id
                }
            }
        );

        // Convert file buffer to a stream and pipe it to Cloudinary
        streamifier.createReadStream(file.buffer).pipe(stream);
    });
}
/* upload documents
 * @param {Array<Multer.File>} files
 * @param {string} petitionID
 * @returns {Array<string>} public_ids
 * */
export const uploadDocuments = async (fileBuffers, petitionID) => {
    if (!fileBuffers || fileBuffers.length === 0) {
        return [];
    }
    try {
        // Upload to Cloudinary
        const promises = fileBuffers.map((file) => uploadDocument(file, petitionID));

        const public_ids = await Promise.all(promises);

        // Insert to DB
        const insertPromises = public_ids.map((public_id) => insertFile(petitionID, public_id));
        await Promise.all(insertPromises);
        return public_ids;

    } catch (error) {

        console.error('error', error);
    }
    return [];
}

/* get documents by petition id
 * @param {string} petitionID
 * @returns {Array<Object>} files
 * */
export const getDocumentsByPetitionID = async (petitionID) => {
    try {
        const { resources } = await cloudinary.search.expression(`folder:petitions/${petitionID}`).execute();
        return resources;
    } catch (error) {
        console.error(error);
        return {};
    }
}

/* delete document by public_id
 * @param {string} public_id
 * @returns {string} file
 * */
export const deleteDocumentByPublicID = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        return public_id;
    } catch (error) {
        console.error(error);
    }
}

/* delete documents by public_ids
 * @param {Array<string>} public_ids
 * @return {Promise<Array<string>>} public_ids
 */
export const deleteDocumentsByPublicIDs = async (public_ids) => {
    try {
        // Delete files on Cloudinary
        const promises = public_ids.map((public_id) => deleteDocumentByPublicID(public_id));
        const results = await Promise.all(promises);
        const successResults = results.filter(res => res.success).map((res) => res.public_id); // Return only succes
        // Delete files on DB
        const validDocumentPromises = successResults.map((public_id) => deleteFile(public_id));
        await Promise.all(validDocumentPromises);

    } catch (error) {
        console.error(error);
    }
    return [];
}

