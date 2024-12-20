import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import session from "express-session";
import { PORT } from "./config.js";
import { isAuthenticated, isAuthorizer } from "./middleware.js";

import approvalRouter from "./handler/approval.js";
// Handlers
import authRouter from "./handler/auth.js";
import commentRouter from "./handler/comment.js";
import fileRouter from "./handler/file.js";
import petitionRouter from "./handler/petition.js";

import userRouter from "./handler/user.js";
import { createUser } from "./server/db/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

app.use(
	cors({
		origin: `http://127.0.0.1:${PORT || 3000}`, // ต้องเป็นโดเมนที่คุณต้องการอนุญาต
		credentials: true, // อนุญาตให้ส่งข้อมูลประจำตัว (cookies, HTTP authentication)
	}),
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());


app.get("/", (_, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

// handlers
app.use(fileRouter);
app.use(petitionRouter);
app.use(userRouter);
app.use(commentRouter);
app.use(approvalRouter);

app.use(authRouter);
app.use(isAuthenticated);

app.get("/petition", (_, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "status.html"));
});

app.get("/profile", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "proflie.html"));
});

app.get("/request", (_, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "request.html"));
});

app.get("/edit", (_, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "request_edit.html"));
});

app.get("/advisor", (_, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "advisor.html"));
});

app.get("/check", (_, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "check.html"));
});

app.get("/read", (_, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "check_readonly.html"));
});

app.get("/advisor-profile", (_, res) => {
	res.sendFile(path.join(__dirname, "public", "html", "profile_advisor.html"));
});



// DEMO: Create new advisor, staff, instructor, dean
await createUser("advisor", "123", "advisor");
await createUser("staff", "123", "staff");
await createUser("instructor", "123", "instructor");
await createUser("dean", "123", "dean");

const LISTENING_PORT = PORT || 3000;
app.listen(LISTENING_PORT, () => {
	console.log(`Server running on port http://127.0.0.1:${LISTENING_PORT}`);
});
