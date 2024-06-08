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

    // Create patients table if it doesn't exist
    db.run(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        type TEXT NOT NULL,
        completedSessions INTEGER NOT NULL DEFAULT 0,
        totalSessions INTEGER NOT NULL,
        date TEXT DEFAULT (datetime('now', 'localtime'))
      )
    `);
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
  res.json({ success: true });
});

// Endpoint to add a new patient
app.post('/addPatient', (req, res) => {
  const { fullName, phoneNumber, type, totalSessions, date } = req.body;

  const completedSessions = 0; // Initialize completed sessions to 0

  db.run(`
    INSERT INTO patients (fullName, phoneNumber, type, completedSessions, totalSessions, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [fullName, phoneNumber, type, completedSessions, totalSessions, date], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Endpoint to update a patient
app.post('/updatePatient', (req, res) => {
  const { id, fullName, phoneNumber, type, totalSessions, completedSessions, date } = req.body;

  db.run(`
    UPDATE patients
    SET fullName = ?, phoneNumber = ?, type = ?, totalSessions = ?, completedSessions = ?, date = ?
    WHERE id = ?
  `, [fullName, phoneNumber, type, totalSessions, completedSessions, date, id], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Endpoint to get all patients
app.get('/patients', (req, res) => {
  db.all('SELECT * FROM patients', [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json(rows);
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

// Endpoint to retrieve statistics
app.get('/api/statistics', (req, res) => {
  const stats = {
    treatmentSessions: [],
    treatmentTypes: [],
    totalPatients: 0,
  };

  db.all('SELECT COUNT(*) AS count, strftime("%w", date) AS day FROM patients GROUP BY day', [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      stats.treatmentSessions = new Array(7).fill(0);
      rows.forEach(row => {
        stats.treatmentSessions[row.day] = row.count;
      });

      db.all('SELECT type, SUM(totalSessions) AS totalSessions, SUM(completedSessions) AS completedSessions FROM patients GROUP BY type', [], (err, rows) => {
        if (err) {
          res.status(500).json({ success: false, message: 'Internal server error' });
        } else {
          stats.treatmentTypes = rows.map(row => ({
            type: row.type,
            totalSessions: row.totalSessions,
            completedSessions: row.completedSessions,
            percentageCompleted: ((row.completedSessions / row.totalSessions) * 100).toFixed(2),
          }));

          db.get('SELECT COUNT(*) AS count FROM patients', [], (err, row) => {
            if (err) {
              res.status(500).json({ success: false, message: 'Internal server error' });
            } else {
              stats.totalPatients = row.count;
              res.json(stats);
            }
          });
        }
      });
    }
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
