const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const borrowController = require('../controllers/borrowController');
const { checkRole } = require('../middleware/auth');

// Book Routes

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     description: Retrieve a list of books. Can filter by search query.
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title or author
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get('/books', bookController.getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get('/books/:id', bookController.getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - userRole: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - stock
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book created successfully
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/books', checkRole('admin'), bookController.createBook);

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - userRole: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated
 *       403:
 *         description: Forbidden
 */
router.put('/books/:id', checkRole('admin'), bookController.updateBook);

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - userRole: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted
 *       403:
 *         description: Forbidden
 */
router.delete('/books/:id', checkRole('admin'), bookController.deleteBook);

/**
 * @swagger
 * /borrow/history:
 *   get:
 *     summary: Get borrow history (Admin)
 *     tags: [Borrowing]
 *     security:
 *       - userRole: []
 *     responses:
 *       200:
 *         description: List of borrow logs
 *       403:
 *         description: Forbidden
 */
router.get('/borrow/history', checkRole('admin'), borrowController.getBorrowHistory);

// Borrow Routes

/**
 * @swagger
 * /borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Borrowing]
 *     security:
 *       - userRole: []
 *       - userId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - latitude
 *               - longitude
 *             properties:
 *               bookId:
 *                 type: integer
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Borrow successful
 *       400:
 *         description: Out of stock or invalid coordinates
 */
router.post('/borrow', checkRole('user'), borrowController.borrowBook);

module.exports = router;
