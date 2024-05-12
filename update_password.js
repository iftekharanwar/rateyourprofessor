const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ratings.db');

// New plaintext password to hash
const newPassword = 'Password123!';
const email = 'testuser@example.com';

// Generate a new hash for the new password
bcrypt.hash(newPassword, 10, function(err, hash) {
  if (err) {
    return console.error('Error hashing new password:', err);
  }

  // Update the user's password in the database with the new hash
  db.run('UPDATE users SET password = ? WHERE email = ?', [hash, email], function(err) {
    if (err) {
      return console.error('Error updating password:', err.message);
    }
    console.log(`Password updated for ${email}`);
  });
});
