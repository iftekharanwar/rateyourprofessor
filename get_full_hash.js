const sqlite3 = require('sqlite3').verbose();

// Open the database
let db = new sqlite3.Database('./ratings.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the ratings database.');
});

// Query the database for the password hash
db.get("SELECT password FROM users WHERE email = 'devintest@example.com'", [], (err, row) => {
  if (err) {
    console.error(err.message);
  } else if (row) {
    console.log('Password hash:', row.password);
  } else {
    console.log('No results found.');
  }
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Closed the database connection.');
});
