import request from 'supertest';
import session from 'express-session';

import { expect } from 'chai';
import express from 'express';
import authRouter from '../handler/auth.js';

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

describe("Session Test", () => {
    const agent = request.agent(app);
    it('should create a new session', async () => {
        const res = await agent
            .post('/api/login')
            .send({
                username: "6609611816",
                password: "1102200218882"
            });

        expect(res.statusCode).to.equal(200);

        const session = await agent.get('/api/session').send();

        console.log("session", session.body);
        expect(session.statusCode).to.equal(200);
        expect(session.body).to.be.an('object');
    })
})

