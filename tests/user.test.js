import request from 'supertest';
import session from 'express-session';

import { expect } from 'chai';
import express from 'express';
import authRouter from '../handler/auth.js';
import userRouter from '../handler/user.js';
import '../config.js'
import { createUser, removeUser } from '../server/db/user.js';

const app = express()
app.use(express.json());

app.use(session({
    secret: "f4e7945b-4a3e-4b34-bf56-6091e4d4f58b",
    resave: false,
    saveUninitialized: true,
    cookies: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}))

app.use(authRouter);
app.use(userRouter);


describe("User test", () => {
    const agent = request.agent(app);

    it('should create a new user and session working', async () => {
        const user = await createUser('test', '123', 'staff');

        const res = await agent.post('/api/login').send({
            username: user.username,
            password: '123'
        }).redirects(0);

        expect(res.statusCode).to.equal(302);
        expect(res.session.user).to.be.an('object');

        await removeUser(user.username);

    })

})
