const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const connectDB = require('../src/db/db');
const userModel = require('../src/models/user.model');

// sub se phele db connect kr leya
describe("GET /api/auth/logout",()=>{
    beforeAll(async()=>{
        await connectDB()
    });

    // 1st test case
    it("clears the auth cookie and returns 200 when logged in", async()=>{
        //login krwana pde ga agar cookies len hai to ik user bna raha hu
         const password = 'Secret123!';
        const hash = await bcrypt.hash(password, 10);
        await userModel.create({
            username: 'logout_user',
            email: 'logout@example.com',
            password: hash,
            fullName: { firstName: 'Log', lastName: 'Out' },
        });

        //yaha pr login krwa raha hu
         const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'logout@example.com', password });

        expect(loginRes.status).toBe(200);
        const cookies = loginRes.headers[ 'set-cookie' ];
        expect(cookies).toBeDefined();

        //asli logout ka kaam yaha se hoga test
        const res = await request(app)
            .get('/api/auth/logout')
            .set('Cookie', cookies);

        expect(res.status).toBe(200);
        const setCookie = res.headers[ 'set-cookie' ] || [];
        const cookieStr = setCookie.join(';');

        //token cookies clear kr deya and expire 
        expect(cookieStr).toMatch(/token=;/);
        expect(cookieStr.toLowerCase()).toMatch(/expires=/);
    });

    //2nd test case (idemportent) meaning:performing an operation multiple times has the same effect as performing it once
    it("is idempotent: returns 200 even without auth cookie", async()=>{
        const res = await request(app).get('/api/auth/logout');
        expect(res.status).toBe(200);
    });

})