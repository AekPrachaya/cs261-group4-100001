import { v2 as cloudinary } from 'cloudinary';


/* upload document
 * @param {string} path
 * @param {string} petitionID
 * @returns {string} public_id
 */
export const uploadDocument = async (path, petitionID) => {
    try {
        const result = await cloudinary.uploader.upload(path, {
            folder: `petitions/${petitionID}`,
        });
        return result.public_id;
    } catch (error) {
        console.error(error);
    }
}
/* upload documents
 * @param {Array<string>} paths
 * @param {string} petitionID
 * @returns {Array<string>} public_ids
 * */
export const uploadDocuments = async (paths, petitionID) => {
    if (!paths || paths.length === 0) {
        return [];
    }

    try {
        const promises = paths.map((path) => uploadDocument(path, petitionID));
        const results = await Promise.all(promises);
        return results.filter(res => res).map((res) => res.public_id);
    } catch (error) {
        console.error(error);
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
    }
    return {};
}

/* delete document by public_id
 * @param {string} public_id
 * @returns {Object} {success: boolean, message: string}
 * */
export const deleteDocumentByPublicID = async (public_id) => {
    try {
        await cloudinary.uploader.destroy(public_id);
        return { success: true, message: `Document ${public_id} deleted` };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
}
