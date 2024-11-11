import request from 'supertest';
import { expect } from 'chai';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import petitionRouter from '../handler/petition.js';

const app = express()
app.use(express.json());

app.use(petitionRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @param Petition */
const petition = {
    student_id: 125124,
    type: "add/remove",
    advisor: "Dr.advisor",
    documents: [1, 2, 3],
    status: "pending",
    content: {
        topic: "Test Topic",
        date: new Date(),
        person_in_charge: "John Doe",
        student_info: {
            name_title: "Mr.",
            student_id: "12345",
            year: 2,
            major: "Computer Science"
        },
        location: {
            house_no: "1",
            village_no: "2",
            sub_district: "Test Sub-district",
            district: "Test District",
            province: "Test Province",
            postal_code: "12345"
        },
        phone_no: "1234567890",
        telephone_no: "0987654321",
        advisor: "Dr. Advisor",
        is_add: true,
        courses: [
            {
                course_id: "CS101",
                course_name: "Intro to CS",
                section: 1,
                date: new Date(),
                credit: 3,
                lecturer: "Prof. Smith",
                approve_by: "Dean"
            }
        ],
        reason: "For testing purposes"
    }
}

describe('Document Upload', () => {
    let insertedPetition;
    let public_ids;

    const createPetition = async () => {
        const result = await request(app)
            .post('/api/petition/upload')
            .send({ type: 'add/remove', content: petition });

        insertedPetition = result.body.data;
    }

    const deletePetition = async (id) => {
        await request(app).delete('/api/petition').send({
            id
        })
    }


    it('should able to upload document to cloudinary and also has data to document table', async () => {
        await createPetition();

        const filePath = path.resolve(__dirname, '../petition_test.pdf');
        const res = await request(app)
            .post('/api/petition/files')
            .field('petition_id', insertedPetition.id)
            .attach('files', filePath);

        public_ids = res.body.data;

        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('array');

        await deletePetition(insertedPetition.id);

    });

    it('should able to delete document from cloudinary and also delete data from document table', async () => {
        await createPetition();
        const res = await request(app)
            .delete('/api/petition/files')
            .send({ public_ids });

        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('array');

        await deletePetition(insertedPetition.id);
    })

    it('should delete document when delete petition in db', async () => {
        await createPetition();

        const filePath = path.resolve(__dirname, '../petition_test.pdf');
        await request(app)
            .post('/api/petition/files')
            .field('petition_id', insertedPetition.id)
            .attach('files', filePath);

        await deletePetition(insertedPetition.id);

        const res2 = await request(app)
            .post('/api/petition/files/get')
            .send({ petition_id: insertedPetition.id });

        // check if document is deleted
        expect(res2.status).to.equal(200);
        expect(res2.body.data).to.be.an('array');
        expect(res2.body.data.length).to.equal(0);
    })

})
