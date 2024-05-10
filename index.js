require('dotenv').config();
const winston = require('winston');
const express = require('express');
const app = express();
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
app.use(cors());
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
  const { professorId, clarity, helpfulness, easiness, comment } = req.body;
  if (typeof professorId !== 'number' ||
      typeof clarity !== 'number' ||
      typeof helpfulness !== 'number' ||
      typeof easiness !== 'number' ||
      typeof comment !== 'string' ||
      clarity < 1 || clarity > 5 ||
      helpfulness < 1 || helpfulness > 5 ||
      easiness < 1 || easiness > 5) {
    return res.status(400).json({ error: 'Invalid input: Ensure that ratings are numbers between 1 and 5 and comment is a string.' });
  }
  const sql = `INSERT INTO ratings (professorId, clarity, helpfulness, easiness, comment) VALUES (?, ?, ?, ?, ?)`;
  const params = [professorId, clarity, helpfulness, easiness, comment];
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

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});