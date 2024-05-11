require('dotenv').config();
const winston = require('winston');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3001;
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Set up winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Middleware to parse request body, enable CORS, set security headers, and rate limiting
app.use(express.json());
app.use(cors({ origin: 'https://fastidious-zuccutto-ebad83.netlify.app', credentials: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", allowedHeaders: "Content-Type,Authorization" }));
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Database setup
const db = new sqlite3.Database(process.env.DATABASE_PATH || './ratings.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    logger.error(err.message);
  }
  logger.info('Connected to the ratings database.');
});

// Route to test the server is working
app.get('/', (req, res) => {
  res.send('RateYourProfessor backend is running!');
});

// CRUD API endpoints for professor ratings
// Create a new rating
app.post('/api/ratings', (req, res) => {
  const { professorName, rating, comments } = req.body;
  if (typeof professorName !== 'string' ||
      typeof rating !== 'number' ||
      typeof comments !== 'string' ||
      rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid input: Ensure that professorName is a string, rating is a number between 1 and 5, and comments is a string.' });
  }
  const sql = `INSERT INTO ratings (professorName, rating, comments) VALUES (?, ?, ?)`;
  const params = [professorName, rating, comments];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'Success',
      data: req.body,
      id: this.lastID
    });
  });
});

// Get all ratings
app.get('/api/ratings', (req, res) => {
  const sql = `SELECT * FROM ratings`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'Success',
      data: rows
    });
  });
});

// Update a rating
app.put('/api/ratings/:id', (req, res) => {
  const { clarity, helpfulness, easiness, comment } = req.body;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID: ID must be a number.' });
  }
  if (typeof clarity !== 'number' ||
      typeof helpfulness !== 'number' ||
      typeof easiness !== 'number' ||
      typeof comment !== 'string' ||
      clarity < 1 || clarity > 5 ||
      helpfulness < 1 || helpfulness > 5 ||
      easiness < 1 || easiness > 5) {
    return res.status(400).json({ error: 'Invalid input: Ensure that ratings are numbers between 1 and 5 and comment is a string.' });
  }
  const sql = `UPDATE ratings SET clarity = ?, helpfulness = ?, easiness = ?, comment = ? WHERE id = ?`;
  const params = [clarity, helpfulness, easiness, comment, id];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Rating not found with the provided ID.' });
    }
    res.json({
      message: 'Success',
      data: req.body,
      changes: this.changes
    });
  });
});

// Delete a rating
app.delete('/api/ratings/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID: ID must be a number.' });
  }
  const sql = `DELETE FROM ratings WHERE id = ?`;
  db.run(sql, id, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Rating not found with the provided ID.' });
    }
    res.json({
      message: 'Deleted successfully',
      changes: this.changes
    });
  });
});

// Get a single professor's details
app.get('/api/professors/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID: ID must be a number.' });
  }
  const sql = `SELECT * FROM professors WHERE id = ?`;
  db.get(sql, id, (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Professor not found with the provided ID.' });
    }
    res.json({
      message: 'Success',
      data: row
    });
  });
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email, and password.' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user into the database
    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    const params = [username, email, hashedPassword];
    db.run(sql, params, function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // Create JWT token
      const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({
        message: 'User registered successfully',
        data: { id: this.lastID, username, email },
        token
      });
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }
    // Query user from the database
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, email, async (err, user) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      // Compare hashed password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      // Create JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({
        message: 'User logged in successfully',
        token
      });
    });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
