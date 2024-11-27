import request from "supertest";

import { expect } from "chai";
import express from "express";
import approvalRouter from "../handler/approval.js";
import petitionRouter from "../handler/petition.js";
import "../config.js";

const app = express();
app.use(express.json());

app.use(petitionRouter);
app.use(approvalRouter);

describe("Authorization API", () => {
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

	const agent = request.agent(app);

	let createdPetition;

	beforeEach(async () => {
		const res = await request(app)
			.post("/api/petition")
			.send({ type: "add/remove", content: samplePetition });
		createdPetition = res.body.data;
	});

	afterEach(async () => {
		await request(app).delete(`/api/petition/${createdPetition.id}`);
	});

	it("should create approval after creating petition", async () => {
		const res = await agent.get(`/api/approval/${createdPetition.id}`).send();

		expect(res.statusCode).to.equal(200);
		expect(res.body.data.petition_id).to.equal(createdPetition.id);
	});

	it("should update approval status", async () => {
		const res = await agent.put(`/api/approval/${createdPetition.id}`).send({
			authorizor: "advisor",
			status: "rejected",
		});

		expect(res.statusCode).to.equal(200);
		expect(res.body.data.advisor_status).to.equal("rejected");
	});
});
