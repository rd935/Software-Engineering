const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Inroad02@004',
    database: 'my_database'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Stop the app if DB connection fails
    } else {
        console.log('Connected to the database');
    }
});

module.exports = db;
