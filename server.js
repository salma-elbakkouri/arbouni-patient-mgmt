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

// Endpoint to update a patient
app.post('/updatePatient', (req, res) => {
  const { id, fullName, phoneNumber, type, totalSessions, completedSessions } = req.body;

  db.run(`
    UPDATE patients
    SET fullName = ?, phoneNumber = ?, type = ?, totalSessions = ?, completedSessions = ?
    WHERE id = ?
  `, [fullName, phoneNumber, type, totalSessions, completedSessions, id], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Endpoint to delete a patient
app.post('/deletePatient', (req, res) => {
  const { id } = req.body;

  db.run('DELETE FROM patients WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});