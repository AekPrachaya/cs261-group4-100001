import argon2 from "argon2";
import { POOL } from "../db.js";

export const createUser = async (username, password, role) => {
	if (!username || !password || !role)
		throw new Error("Missing required fields");

	if (!["advisor", "staff", "instructor", "dean"].includes(role))
		throw new Error("Invalid role");

	let hashedPassword;
	try {
		hashedPassword = await argon2.hash(password, {
			type: argon2.argon2id, // Specify argon2id
		});
	} catch (error) {
		console.error("Error hashing password", error);
		throw new Error("Error creating user");
	}

	try {
		const { rows } = await POOL.query(
			"INSERT INTO users (username, password, role) VALUES ($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING *",
			[username, hashedPassword, role],
		);

		if (rows.length === 0) {
			return { message: "Username already exists" };
		}

		return rows[0]; // return the created user object
	} catch (error) {
		console.error("Error inserting user:", error.message);
		throw new Error("Database error: Unable to create user");
	}
};

export const getUser = async (username, password) => {
	if (!username || !password) throw new Error("Missing required fields");

	const { rows } = await POOL.query("SELECT * FROM users WHERE username = $1", [
		username,
	]);
	const user = rows[0];

	if (!user) {
		throw new Error("User not found");
	}

	const isPasswordValid = await argon2.verify(user.password, password);

	if (!isPasswordValid) {
		throw new Error("Invalid password");
	}
	return user;
};

export const removeUser = async (username) => {
	if (!username) {
		throw new Error("Missing required fields");
	}
	try {
		const { rows } = await POOL.query(
			"DELETE FROM users WHERE username = $1 RETURNING *",
			[username],
		);

		return rows[0] || null;
	} catch (error) {
		console.error("Error removing user:", error.message);
		throw new Error("Database error: Unable to remove user");
	}
};
