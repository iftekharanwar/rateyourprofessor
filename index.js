require('dotenv').config();
const winston = require('winston');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.set('trust proxy', 1);
const port = process.env.PORT || 3002;
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

app.use(express.json());

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ['https://shimmering-tanuki-543e93.netlify.app', /\.netlify\.app$/];
    if (!origin || allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));

// Simplified handling of OPTIONS requests for CORS preflight
app.options('*', cors());

// Middleware to log the request origin and response headers for debugging purposes
app.use((req, res, next) => {
  res.on('finish', () => {
    logger.info(`Request Origin: ${req.get('origin')}`);
    logger.info(`Response headers: ${JSON.stringify(res.getHeaders())}`);
  });
  next();
});

// Database setup
const db = new sqlite3.Database(process.env.DATABASE_PATH || './ratings.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    logger.error(err.message);
  }
  logger.info('Connected to the ratings database.');
});

// Authentication middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there's no token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // if the token is invalid
    req.user = user;
    next();
  });
};

// Route to test the server is working
app.get('/', (req, res) => {
  res.send('RateYourProfessor backend is running!');
});

// CRUD API endpoints for professor ratings
// Create a new rating with authentication check
app.post('/api/ratings', authenticateToken, (req, res) => {
  const { professorId, clarity, helpfulness, easiness, comment } = req.body;
  if (typeof professorId !== 'number' ||
      typeof clarity !== 'number' ||
      typeof helpfulness !== 'number' ||
      typeof easiness !== 'number' ||
      typeof comment !== 'string' ||
      clarity < 1 || clarity > 5 ||
      helpfulness < 1 || helpfulness > 5 ||
      easiness < 1 || easiness > 5) {
    return res.status(400).json({ error: 'Invalid input: Ensure that professorId is a number, ratings are numbers between 1 and 5, and comment is a string.' });
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
app.put('/api/ratings/:id', authenticateToken, (req, res) => {
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
app.delete('/api/ratings/:id', authenticateToken, (req, res) => {
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

// Add a new professor with authentication check
app.post('/api/professors', authenticateToken, (req, res) => {
  const { name, department } = req.body;
  if (!name || !department) {
    return res.status(400).json({ error: 'Please provide both name and department for the professor.' });
  }
  const sql = `INSERT INTO professors (name, department) VALUES (?, ?)`;
  const params = [name, department];
  db.run(sql, params, function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({
        message: 'New professor added successfully',
        data: { id: this.lastID, name, department },
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

// Get all professors
app.get('/api/professors', (req, res) => {
  const sql = `SELECT * FROM professors`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      logger.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Success',
      data: rows
    });
  });
});

// User registration endpoint
app.post('/api/register', async (req, res) => {
  // Removed explicit CORS headers, the cors package handles this
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
      const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
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
    // Log the request body to confirm the data being received
    logger.info(`Login attempt: email=${email}, password=${password}`);
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password.' });
    }
    // Query user from the database
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, email, async (err, user) => {
      if (err) {
        // Log any database errors during the login process
        logger.error(`Database error during login for email: ${email}: ${err.message}`);
        return res.status(400).json({ error: err.message });
      }
      if (!user) {
        // Log if user is not found
        logger.info(`Login failed: User not found for email: ${email}`);
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      // Log the user found in the database
      logger.info(`User found for email: ${email}: ${JSON.stringify(user)}`);
      // Compare hashed password
      const match = await bcrypt.compare(password, user.password);
      // Log the result of the password comparison
      logger.info(`Password comparison for email: ${email}: ${match}`);
      if (!match) {
        // Log failed password comparison
        logger.info(`Password comparison failed for email: ${email}.`);
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      // Create JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
      res.json({
        message: 'User logged in successfully',
        token
      });
      // This section has been removed to prevent redeclaration of 'token' variable
    });
  } catch (error) {
    // Log any errors during the login process
    logger.error(`Login error for email: ${req.body.email}: ${error.message}`);
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
