const fetch = require('node-fetch'); // Ensure node-fetch is installed or use built-in fetch in Node 18+

const BASE_URL = 'http://localhost:3000/api';

async function testEndpoints() {
    console.log('--- Starting API Tests ---\n');

    try {
        // 1. GET Books (Public)
        console.log('1. Testing GET /books...');
        const resBooks = await fetch(`${BASE_URL}/books`);
        const books = await resBooks.json();
        console.log(`Status: ${resBooks.status}`);
        console.log('Response:', books.slice(0, 2)); // Show first 2
        console.log('Passed ✅\n');

        // 2. Add Book (Admin)
        console.log('2. Testing POST /books (Admin)...');
        const newBook = { title: "Test Book", author: "Tester", stock: 5 };
        const resAdd = await fetch(`${BASE_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-role': 'admin' },
            body: JSON.stringify(newBook)
        });
        const addedBook = await resAdd.json();
        console.log(`Status: ${resAdd.status}`);
        console.log('Response:', addedBook);
        console.log('Passed ✅\n');

        // 3. User Borrow (User)
        console.log('3. Testing POST /borrow (User)...');
        const borrowData = { bookId: addedBook.id || 1, latitude: -6.2, longitude: 106.8 };
        const resBorrow = await fetch(`${BASE_URL}/borrow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-user-role': 'user', 'x-user-id': '999' },
            body: JSON.stringify(borrowData)
        });
        const borrowResult = await resBorrow.json();
        console.log(`Status: ${resBorrow.status}`);
        console.log('Response:', borrowResult);
        console.log('Passed ✅\n');

    } catch (error) {
        console.error('Test Failed ❌:', error.message);
        console.log('Make sure the server is running on port 3000!');
    }
}

// Check for node-fetch or native fetch
if (!globalThis.fetch) {
    console.log('Node.js version < 18 detected. Please install node-fetch: npm install node-fetch');
} else {
    testEndpoints();
}
