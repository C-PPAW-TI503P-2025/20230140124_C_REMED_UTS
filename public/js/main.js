const API_URL = 'http://localhost:3000/api';

console.log("Main.js loaded successfully");

const roleSelect = document.getElementById('role');
const userIdInput = document.getElementById('userId');
const adminPanel = document.getElementById('adminPanel');
const booksContainer = document.getElementById('booksContainer');
const addBookForm = document.getElementById('addBookForm');

// Event Listeners
roleSelect.addEventListener('change', updateRoleUI);
addBookForm.addEventListener('submit', handleAddBook);

// Event Delegation for dynamically created buttons
booksContainer.addEventListener('click', (e) => {
    // Check if clicked element is a borrow button
    if (e.target.classList.contains('borrow-btn')) {
        const bookId = e.target.getAttribute('data-id');
        borrowBook(bookId);
    }
    // Check if clicked element is a delete button
    if (e.target.classList.contains('delete-btn')) {
        const bookId = e.target.getAttribute('data-id');
        deleteBook(bookId);
    }
});

// Initial Load
updateRoleUI();
fetchBooks();

function updateRoleUI() {
    // ... scope unchanged ...
    const role = roleSelect.value;
    if (role === 'admin') {
        adminPanel.classList.remove('hidden');
    } else {
        adminPanel.classList.add('hidden');
    }
    fetchBooks();
}

async function fetchBooks() {
    const search = document.getElementById('searchInput').value;
    let url = `${API_URL}/books`;
    if (search) {
        url += `?search=${search}`;
    }

    try {
        const response = await fetch(url);
        const books = await response.json();
        renderBooks(books);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function renderBooks(books) {
    booksContainer.innerHTML = '';
    const role = roleSelect.value;

    books.forEach(book => {
        const card = document.createElement('div');
        card.className = 'card';

        let actionButton = '';
        if (role === 'user') {
            actionButton = `<button class="borrow-btn" data-id="${book.id}" ${book.stock <= 0 ? 'disabled' : ''}>
                                ${book.stock > 0 ? 'Borrow' : 'Out of Stock'}
                            </button>`;
        } else {
            actionButton = `<button class="delete-btn" data-id="${book.id}">Delete</button>`;
        }

        card.innerHTML = `
            <h3>${book.title}</h3>
            <p>by ${book.author}</p>
            <span class="stock-badge">Stock: ${book.stock}</span>
            <div style="margin-top: auto; padding-top: 10px;">
                ${actionButton}
            </div>
        `;
        booksContainer.appendChild(card);
    });
}

async function handleAddBook(e) {
    e.preventDefault();

    const title = document.getElementById('newTitle').value;
    const author = document.getElementById('newAuthor').value;
    const stock = document.getElementById('newStock').value;

    try {
        const response = await fetch(`${API_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-role': 'admin'
            },
            body: JSON.stringify({ title, author, stock, description: "No description" }) // Added description if needed by future generic fields
        });

        if (response.ok) {
            alert('Book added successfully');
            addBookForm.reset();
            fetchBooks();
        } else {
            const data = await response.json();
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
}

async function deleteBook(id) {
    if (!confirm('Are you sure?')) return;

    try {
        const response = await fetch(`${API_URL}/books/${id}`, {
            method: 'DELETE',
            headers: {
                'x-user-role': 'admin'
            }
        });

        if (response.ok) {
            fetchBooks();
        } else {
            alert('Failed to delete book');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
    }
}

async function borrowBook(bookId, btnElement) {
    console.log('Borrow button clicked for book:', bookId);

    const userId = userIdInput.value;
    if (!userId) {
        alert('Please enter a User ID');
        return;
    }

    // Get Geolocation
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
    }

    // Show loading state
    const btn = btnElement || document.querySelector(`button[data-id="${bookId}"]`);
    let originalText = 'Borrow';
    if (btn) {
        originalText = btn.innerText;
        btn.innerText = 'Locating...';
        btn.disabled = true;
    }

    console.log('Requesting geolocation...');

    navigator.geolocation.getCurrentPosition(async (position) => {
        console.log('Location found:', position.coords);
        btn.innerText = 'Processing...';

        const { latitude, longitude } = position.coords;

        try {
            const response = await fetch(`${API_URL}/borrow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-role': 'user',
                    'x-user-id': userId
                },
                body: JSON.stringify({
                    bookId,
                    latitude,
                    longitude
                })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Book borrowed successfully! Log ID: ' + data.data.id);
                fetchBooks();
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error borrowing book:', error);
            alert('Error borrowing book: ' + error.message);
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }

    }, (error) => {
        console.error('Geolocation error:', error);
        let msg = 'Unable to retrieve location.';
        if (error.code === 1) msg = 'Location permission denied. Please allow location access.';
        if (error.code === 2) msg = 'Location unavailable.';
        if (error.code === 3) msg = 'Location request timed out.';

        alert(msg);
        alert(msg);
        if (btn) {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0
    });
}

async function fetchLogs() {
    try {
        const response = await fetch(`${API_URL}/borrow/history`, {
            headers: { 'x-user-role': 'admin' }
        });
        const logs = await response.json();

        const tbody = document.querySelector('#logsTable tbody');
        tbody.innerHTML = logs.map(log => `
            <tr>
                <td>${log.id}</td>
                <td>${log.userId}</td>
                <td>${log.bookId}</td>
                <td>${new Date(log.borrowDate).toLocaleString()}</td>
                <td>${log.latitude}, ${log.longitude}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}
