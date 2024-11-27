import session from "express-session";
import request from "supertest";

import { expect } from "chai";
import express from "express";
import authRouter from "../handler/auth.js";
import userRouter from "../handler/user.js";
import "../config.js";

const app = express();
app.use(express.json());

app.use(
	session({
		secret: "f4e7945b-4a3e-4b34-bf56-6091e4d4f58b",
		resave: false,
		saveUninitialized: true,
		cookies: {
			secure: false,
			maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
		},
	}),
);

app.use(authRouter);
app.use(userRouter);

describe("User test", () => {
	const agent = request.agent(app);

	// Dynamically generate a unique username for each test
	const generateTestUser = () => ({
		username: "test",
		password: "123",
		role: "staff",
	});

	let TEST_USER;

	beforeEach(async () => {
		// Generate a new test user before each test
		TEST_USER = generateTestUser();
		await agent.post("/api/user").send(TEST_USER);
	});

	afterEach(async () => {
		// Cleanup: Remove the test user after each test
		await agent.delete(`/api/user/${TEST_USER.username}`).send();
	});

	it("should create a new user", async () => {
		const login_res = await agent.post("/api/login").send({
			username: TEST_USER.username,
			password: TEST_USER.password,
		});

		expect(login_res.statusCode).to.equal(302);
	});

	it("should delete a user successfully", async () => {
		const delete_res = await agent
			.delete(`/api/user/${TEST_USER.username}`)
			.send();
		expect(delete_res.statusCode).to.equal(200);

		// Ensure the user is actually deleted
		const fetch_res = await agent.post("/api/login").send({
			username: TEST_USER.username,
			password: TEST_USER.password,
		});

		expect(fetch_res.body).to.have.property("error");
	});
});
