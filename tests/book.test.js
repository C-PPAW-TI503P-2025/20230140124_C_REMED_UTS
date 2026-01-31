const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Book = require('../models/Book');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Book API Endpoints', () => {
    it('should create a new book (Admin)', async () => {
        const res = await request(app)
            .post('/api/books')
            .set('x-user-role', 'admin')
            .send({
                title: 'Jest Testing',
                author: 'Facebook',
                stock: 5
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toEqual('Jest Testing');
    });

    it('should fetch all books', async () => {
        const res = await request(app).get('/api/books');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should prevent user from creating books', async () => {
        const res = await request(app)
            .post('/api/books')
            .set('x-user-role', 'user')
            .send({
                title: 'Hacker Book',
                author: 'Hacker',
                stock: 100
            });
        expect(res.statusCode).toEqual(403);
    });
});
