const bcrypt = require('bcrypt');

// Password to verify
const password = 'Password123!';

// Full hash retrieved from the database
const fullHash = '$2b$10$272DmSxE2QeoZ.q6J1xGDuoydmfDRzJME96SCn5FSN9BBYzAaG.Xe';

// Compare the provided password with the stored hash
bcrypt.compare(password, fullHash, function(err, isMatch) {
  if (err) {
    console.error('Error comparing hashes:', err);
    return;
  }

  // Log the result of the comparison
  console.log('Do the hashes match?', isMatch);
});
