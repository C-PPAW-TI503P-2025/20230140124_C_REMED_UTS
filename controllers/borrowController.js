const Book = require('../models/Book');
const BorrowLog = require('../models/BorrowLog');
const sequelize = require('../config/database');

exports.borrowBook = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { bookId, latitude, longitude } = req.body;
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({ message: 'User ID required in headers (x-user-id)' });
        }

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ message: 'Invalid coordinates' });
        }

        const book = await Book.findByPk(bookId, { transaction });
        if (!book) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.stock <= 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Book out of stock' });
        }

        book.stock -= 1;
        await book.save({ transaction });

        const log = await BorrowLog.create({
            userId,
            bookId,
            latitude,
            longitude
        }, { transaction });

        await transaction.commit();
        res.status(201).json({ message: 'Borrow successful', data: log });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: error.message });
    }
};

exports.getBorrowHistory = async (req, res) => {
    try {
        const logs = await BorrowLog.findAll({
            order: [['borrowDate', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
