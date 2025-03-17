const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Import MySQL connection

const app = express();
app.use(bodyParser.json());

// Get all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// Get a user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
});

// Add a new user
// Add a new user
app.post('/users', (req, res) => {
    const { name, email, age } = req.body;
    
    // Validate input
    if (!name || !email || !age) {
        return res.status(400).json({ error: 'Name, email, and age are required' });
    }

    const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    
    db.query(query, [name, email, age], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err); // Log the error
            
            // Check for duplicate entry error
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: `User with email ${email} already exists` });
            }

            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        // If no error, return success
        res.status(201).json({ id: results.insertId });
    });
});



// Update a user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.body;
    db.query('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User updated successfully' });
        }
    });
});

// Delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json({ message: 'User deleted successfully' });
        }
    });
});

// Error Handling
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
