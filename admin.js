// admin.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Connect to the SQLite database
const db = new sqlite3.Database('./src/data/db.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create the users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`, (err) => {
  if (err) {
    console.error('Could not create table', err);
  } else {
    console.log('Users table created or already exists');
  }
});

// Hash the password and insert the admin user
const insertAdminUser = async () => {
  const username = 'admin';
  const password = 'yrGLhrUFSk0ZKAh';
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        console.log('Admin user already exists');
      } else {
        console.error('Could not insert admin user', err);
      }
    } else {
      console.log('Admin user created successfully');
    }
  });
};

// Run the insertAdminUser function
insertAdminUser();
