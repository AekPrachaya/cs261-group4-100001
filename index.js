import { PORT } from "./config.js";
import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isAuthenticated } from "./middleware.js";
import cors from "cors";

// Handlers
import authRouter from "./handler/auth.js";
import petitionRouter from "./handler/petition.js";
import commentRouter from "./handler/comment.js";
import fileRouter from "./handler/file.js";
import approvalRouter from "./handler/approval.js";

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

// handlers
app.use(authRouter);
app.use(fileRouter);
app.use(petitionRouter);
app.use(commentRouter);
app.use(userRouter);
app.use(approvalRouter);

app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});
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

app.get('/edit', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'request_edit.html'));
})

app.get('/advisor', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'advisor.html'));
})

app.get('/check', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'check.html'));
})

// DEMO: Create new advisor, staff, instructor, dean
await createUser("advisor", "123", "advisor");
await createUser("staff", "123", "staff");
await createUser("instructor", "123", "instructor");
await createUser("dean", "123", "dean");

const LISTENING_PORT = PORT || 3000;
app.listen(LISTENING_PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${LISTENING_PORT}`);
});
