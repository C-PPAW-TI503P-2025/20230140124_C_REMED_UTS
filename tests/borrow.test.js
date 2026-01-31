const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');
const Book = require('../models/Book');

describe('Borrow API Endpoints', () => {
    let bookId;

    beforeAll(async () => {
        // Ensure we have a book to borrow
        const book = await Book.create({
            title: 'Borrowable Book',
            author: 'Author X',
            stock: 1
        });
        bookId = book.id;
    });

    it('should borrow a book successfully', async () => {
        const res = await request(app)
            .post('/api/borrow')
            .set('x-user-role', 'user')
            .set('x-user-id', '123')
            .send({
                bookId: bookId,
                latitude: 10.5,
                longitude: 120.5
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('Borrow successful');

        // Check stock decrease
        const updatedBook = await Book.findByPk(bookId);
        expect(updatedBook.stock).toEqual(0);
    });

    it('should fail to borrow if out of stock', async () => {
        const res = await request(app)
            .post('/api/borrow')
            .set('x-user-role', 'user')
            .set('x-user-id', '124')
            .send({
                bookId: bookId,
                latitude: 10.5,
                longitude: 120.5
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toEqual('Book out of stock');
    });

    it('should fail if latitude/longitude missing', async () => {
        const res = await request(app)
            .post('/api/borrow')
            .set('x-user-role', 'user')
            .set('x-user-id', '125')
            .send({
                bookId: bookId
            });

        expect(res.statusCode).toEqual(400);
    });
});
