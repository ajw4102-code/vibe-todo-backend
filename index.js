require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not set. Please include DB name, e.g. ...mongodb.net/todo?...');
  process.exit(1);
}

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected to:', mongoose.connection.host);
});

// Development: allow all origins (simplified CORS)
app.use(cors());
app.options('*', cors());

// global request logger
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// routes
app.get('/', (req, res) => res.json({ message: 'Ledger backend is running' }));
app.use('/ledger', require('./routes/ledger'));

const start = async () => {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('연결성공');
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

start();
