const request = require('supertest');
const app = require('../src/app');
const connectDB = require('../src/db/db');

// yaha seda app ko use kya la bina server start keye 

describe('POST /api/auth/register', () => {
    beforeAll(async () => {
        // connectDB uses process.env.MONGO_URI set in setup.js
        await connectDB();
    });


    it('creates a user and returns 201 with user (no password)', async () => {
        
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'gurjot',
                email: 'gurjot@gmail.com',
                password: '123456',
                fullName: {
                     firstName: 'gurjot', 
                     lastName: 'singh'
                     },
            });

        expect(res.status).toBe(201);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.username).toBe('gurjot');
        expect(res.body.user.email).toBe('gurjot@gmail.com');
        expect(res.body.user.password).toBeUndefined();
    });

    it('rejects duplicate username/email with 409', async () => {
        const payload = {
            username: 'dupuser',
            email: 'dup@gmail.com',
            password: '123456',
            fullName: { firstName: 'Dup', lastName: 'User' },
        };

        await request(app).post('/api/auth/register').send(payload).expect(201);
        const res = await request(app).post('/api/auth/register').send(payload);

        expect(res.status).toBe(409);
    });

    it('validates missing fields with 400', async () => {
        const res = await request(app).post('/api/auth/register').send({});
        expect(res.status).toBe(400);
    });
});