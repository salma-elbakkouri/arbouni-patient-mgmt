const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Connect to the SQLite database
const db = new sqlite3.Database('./src/data/db.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create the users table if it doesn't exist
// db.run(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     username TEXT UNIQUE,
//     password TEXT
//   )
// `, (err) => {
//   if (err) {
//     console.error('Could not create table', err);
//   } else {
//     console.log('Users table created or already exists');
//   }
// });

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else if (!row) {
      res.status(400).json({ success: false, message: 'User not found' });
    } else {
      bcrypt.compare(password, row.password, (err, result) => {
        if (result) {
          res.json({ success: true });
        } else {
          res.status(400).json({ success: false, message: 'Incorrect password' });
        }
      });
    }
  });
});

// Logout endpoint
app.post('/logout', (req, res) => {
  // Perform any necessary cleanup, e.g., invalidate session, etc.
  res.json({ success: true });
});




// Create the patients table if it doesn't exist
// db.run(`
//   CREATE TABLE IF NOT EXISTS patients (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     fullName TEXT,
//     phoneNumber TEXT,
//     type TEXT,
//     completedSessions INTEGER,
//     totalSessions INTEGER
//   )
// `, (err) => {
//   if (err) {
//     console.error('Could not create patients table', err);
//   } else {
//     console.log('Patients table created or already exists');
//   }
// });

// Endpoint to add a new patient
app.post('/addPatient', (req, res) => {
  const { fullName, phoneNumber, type, totalSessions } = req.body;

  const completedSessions = 0; // Initialize completed sessions to 0

  db.run(`
    INSERT INTO patients (fullName, phoneNumber, type, completedSessions, totalSessions)
    VALUES (?, ?, ?, ?, ?)
  `, [fullName, phoneNumber, type, completedSessions, totalSessions], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Endpoint to retrieve patients
app.get('/patients', (req, res) => {
  db.all('SELECT * FROM patients', [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});