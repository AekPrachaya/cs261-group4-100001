import request from "supertest";
import { expect } from "chai";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import petitionRouter from "../handler/petition.js";
import fileRouter from "../handler/file.js";

const app = express();
app.use(express.json());
app.use(petitionRouter);
app.use(fileRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @param Petition */
const petitionTemplate = {
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
            major: "Computer Science",
        },
        location: {
            house_no: "1",
            village_no: "2",
            sub_district: "Test Sub-district",
            district: "Test District",
            province: "Test Province",
            postal_code: "12345",
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
                approve_by: "Dean",
            },
        ],
        reason: "For testing purposes",
    },
};

describe("Document Upload and Management", () => {
    const createPetition = async () => {
        const res = await request(app)
            .post("/api/petition/")
            .send({ type: "add/remove", content: petitionTemplate });

        return res.body.data;
    };

    const deletePetition = async (id) => {
        await request(app).delete(`/api/petition/${id}`).send();
    };

    it("should upload a document to cloud storage and store metadata in the database", async () => {
        const petition = await createPetition();
        const filePath = path.resolve(__dirname, "../petition_test.pdf");
        const res = await request(app)
            .post("/api/files")
            .field("petition_id", petition.id)
            .attach("files", filePath);

        await deletePetition(petition.id);
        expect(res.status).to.equal(200);
    });

    it("when deleted a document on cloud, will delete in database too", async () => {
        const petition = await createPetition();
        const filePath = path.resolve(__dirname, "../petition_test.pdf");

        // Upload a file to Cloudinary
        const uploadRes = await request(app)
            .post("/api/files")
            .field("petition_id", petition.id)
            .attach("files", filePath);

        const data = uploadRes.body.data;

        expect(uploadRes.status).to.equal(200);
        expect(data).to.be.an("array").that.is.not.empty;

        const publicIds = data.filter((file) => file).map((file) => file.public_id);

        const deleteResult = await request(app)
            .delete("/api/files")
            .send({ public_ids: publicIds });

        expect(deleteResult.status).to.equal(200);
        expect(deleteResult.body.data).to.be.an("array").that.is.not.empty;

        const getResult = await request(app).get(`/api/files/${petition.id}`);

        expect(getResult.status).to.equal(200);
        expect(getResult.body.data).to.be.an("array").that.is.empty;

        // await deletePetition(petition.id);
    });

    it("should delete documents on cloudinary when deleting a petition", async () => {
        const petition = await createPetition();
        const filePath = path.resolve(__dirname, "../petition_test.pdf");
        const uploadRes = await request(app)
            .post("/api/files")
            .field("petition_id", petition.id)
            .attach("files", filePath);

        expect(uploadRes.status).to.equal(200);
        await deletePetition(petition.id);

        const fetchRes = await request(app).get(`/api/files/${petition.id}`);
        expect(fetchRes.status).to.equal(200);
    });

    it("Should get documents by petition id", async () => {
        const petition = await createPetition();
        const filePath = path.resolve(__dirname, "../petition_test.pdf");
        const uploadRes = await request(app)
            .post("/api/files")
            .field("petition_id", petition.id)
            .attach("files", filePath);

        expect(uploadRes.status).to.equal(200);

        const fetchRes = await request(app).get(`/api/files/${petition.id}`);

        expect(fetchRes.status).to.equal(200);
        expect(fetchRes.body.data).to.be.an("array").that.is.not.empty;

        const deleteRes = await request(app).delete(`/api/petition/${petition.id}`);

        expect(deleteRes.status).to.equal(200);
    });
});
