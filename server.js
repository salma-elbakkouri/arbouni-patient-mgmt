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



        // Create users table if it doesn't exist
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL
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


// User endpoints

// Endpoint to add a new user
app.post('/addUser', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(`
    INSERT INTO users (username, password)
    VALUES (?, ?)
  `, [username, hashedPassword], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json({ success: true });
    }
  });
});

// Endpoint to update a user
app.post('/updateUser', async (req, res) => {
  const { id, username, currentPassword, newPassword } = req.body;

  if (!id || !username || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    db.get('SELECT * FROM users WHERE id = ?', [id], async (err, row) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
      } else if (!row) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }

      const match = await bcrypt.compare(currentPassword, row.password);
      if (!match) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.run(`
        UPDATE users
        SET username = ?, password = ?
        WHERE id = ?
      `, [username, hashedPassword, id], function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Internal server error' });
        } else {
          return res.json({ success: true });
        }
      });
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error hashing password' });
  }
});



// Endpoint to get all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      res.json(rows);
    }
  });
});

// Endpoint to delete a user
app.post('/deleteUser', (req, res) => {
  const { id } = req.body;

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
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

app.get('/api/statistics', (req, res) => {
  const stats = {
    treatmentSessions: [],
    treatmentTypes: [],
    totalPatients: 0,
  };

  // Query to get the count of treatment sessions per day of the week
  db.all('SELECT COUNT(*) AS count, strftime("%w", date) AS day FROM patients GROUP BY day', [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    } else {
      stats.treatmentSessions = new Array(7).fill(0);
      rows.forEach(row => {
        stats.treatmentSessions[row.day] = row.count;
      });

      // Query to get the total sessions and completed sessions per type
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

          // Sort treatment types by total sessions in descending order
          stats.treatmentTypes.sort((a, b) => b.totalSessions - a.totalSessions);

          // Query to get the total number of patients
          db.get('SELECT COUNT(*) AS count FROM patients', [], (err, row) => {
            if (err) {
              res.status(500).json({ success: false, message: 'Internal server error' });
            } else {
              stats.totalPatients = row.count;

              // Additional statistics
              stats.totalSessions = stats.treatmentTypes.reduce((sum, type) => sum + type.totalSessions, 0);
              stats.topServices = stats.treatmentTypes.slice(0, 2);

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
