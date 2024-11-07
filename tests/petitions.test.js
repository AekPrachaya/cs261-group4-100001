// tests/handlers.test.js
import request from 'supertest';
import { expect } from 'chai';
import express from 'express';

import petitionRouter from '../handler/petition.js';
import { insertPetition } from '../server/db.js';

const app = express()
app.use(express.json());

app.use(petitionRouter);


describe('Petition Handlers API', () => {
    const petition = {
        student_id: 125124,
        type: "add/remove",
        advisor: "Dr.advisor",
        documents: [1, 2, 3],
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

    let insertedPetition;
    // POST /api/petition/upload
    it('should create a new petition with add/remove course content', async () => {
        const res = await request(app)
            .post('/api/petition/upload')
            .send({ type: 'add/remove', content: petition });

        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('object');

        insertedPetition = res.body.data;
    });

    it('should get a petition by id', async () => {
        const res = await request(app)
            .post('/api/petition/get')
            .send({ id: insertedPetition.id });

        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('object');
    })


    it('should get multple petitions by student_id', async () => {
        const res = await request(app)
            .post('/api/petition/get_all')
            .send({ student_id: petition.student_id });

        expect(res.status).to.equal(200);
        expect(res.body.data).to.be.an('array');
    })



    // PUT /api/petition/update
    it('should update a petition', async () => {
        const updatedContent = {
            ...petition,
            advisor: "New Advisor"
        };
        const res = await request(app)
            .put('/api/petition')
            .send({ id: insertedPetition.id, petition: updatedContent });
        expect(res.status).to.equal(200);
        expect(res.body.data.advisor).to.equal(updatedContent.advisor);

    });

    // DELETE /api/petition/delete
    it('should delete a petition', async () => {
        const res = await request(app)
            .delete('/api/petition')
            .send({ id: insertedPetition.id });

        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal('success');
    });
});
