const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Library System API',
            version: '1.0.0',
            description: 'API Documentation for the Library System Backend (UCP 1)',
            contact: {
                name: 'Developer',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                userRole: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-user-role',
                    description: 'Role of the user (admin/user)',
                },
                userId: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-user-id',
                    description: 'ID of the user (required for borrowing)',
                },
            },
            schemas: {
                Book: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        title: { type: 'string' },
                        author: { type: 'string' },
                        stock: { type: 'integer' },
                    },
                },
                BorrowLog: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer' },
                        userId: { type: 'integer' },
                        bookId: { type: 'integer' },
                        borrowDate: { type: 'string', format: 'date-time' },
                        latitude: { type: 'number' },
                        longitude: { type: 'number' },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Files containing annotations
};

const specs = swaggerJsdoc(options);
module.exports = specs;
