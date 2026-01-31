const sequelize = require('./config/database');
const Book = require('./models/Book');

const books = [
    { title: "Laskar Pelangi", author: "Andrea Hirata", stock: 5 },
    { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", stock: 3 },
    { title: "Filosofi Kopi", author: "Dewi Lestari", stock: 10 },
    { title: "Negeri 5 Menara", author: "Ahmad Fuadi", stock: 7 },
    { title: "Cantik Itu Luka", author: "Eka Kurniawan", stock: 4 }
];

const seedDatabase = async () => {
    try {
        await sequelize.sync(); // Ensure tables exist
        await Book.bulkCreate(books);
        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    }
};

seedDatabase();
