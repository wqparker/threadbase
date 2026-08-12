// server/app.js
// Express app config only — no Mongoose connection, no app.listen(). Kept
// separate from index.js so tests can exercise routes via supertest
// without booting a real server.
const express = require('express');
const cors = require('cors');

// Registers every model with mongoose - see models/index.js for why this
// needs to be centralized rather than left to whichever routes happen to
// require a given model directly.
require('./models');

const closetsRouter = require('./routes/closets');
const itemsRouter = require('./routes/items');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/closets', closetsRouter);
app.use('/api/items', itemsRouter);

// Express 5 forwards rejected promises from async route handlers here
// automatically, so route handlers don't need their own try/catch.
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
