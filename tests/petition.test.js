import { expect } from "chai";
import express from "express";
import request from "supertest";

import petitionRouter from "../handler/petition.js";

const app = express();
app.use(express.json());
app.use(petitionRouter);

describe("Petition Handlers API", () => {
	// Sample petition content
	const samplePetition = {
		student_id: 125124,
		type: "add/remove",
		advisor: "Dr.advisor",
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

	const createPetition = async () => {
		const res = await request(app)
			.post("/api/petition")
			.send({ type: "add/remove", content: samplePetition });
		return res.body.data;
	};

	const deletePetition = async (id) => {
		const res = await request(app).delete(`/api/petition/${id}`).send();
		return res.body.data;
	};

	// Test cases
	it("should create a new petition with add/remove course content", async () => {
		const petition = await createPetition();
		expect(petition).to.be.an("object");
		await deletePetition(petition.id);
	});

	it("should get a petition by id", async () => {
		const petition = await createPetition();
		const res = await request(app).get(`/api/petition/${petition.id}`).send();

		expect(res.status).to.equal(200);
		expect(res.body.data).to.be.an("object");
		await deletePetition(petition.id);
	});

	it("should get multiple petitions by student_id", async () => {
		const petition = await createPetition();
		const res = await request(app)
			.get(`/api/petitions/${petition.student_id}`)
			.send();

		expect(res.status).to.equal(200);
		expect(res.body.data).to.be.an("array");
		await deletePetition(petition.id);
	});

	it("should update a petition", async () => {
		const petition = await createPetition();

		const updatedContent = {
			...samplePetition,
			advisor: "New Advisor",
		};

		const res = await request(app)
			.put("/api/petition")
			.send({ id: petition.id, petition: updatedContent });

		expect(res.status).to.equal(200);
		expect(res.body.data.advisor).to.equal(updatedContent.advisor);

		await deletePetition(petition.id);
	});

	it("should delete a petition", async () => {
		const petition = await createPetition();
		await deletePetition(petition.id);
	});

	it("should able to get petitions by role", async () => {
		const petition = await createPetition();
		const res = await request(app).get("/api/petitions/role/staff").send();

		expect(res.status).to.equal(200);
		expect(res.body.data).to.be.an("array");
		await deletePetition(petition.id);
	});
});
