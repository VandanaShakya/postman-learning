// services/db.js
const mongoose = require('mongoose');
const MONGO_URI = require('../services/db');

let isConnected = false;

async function connectDB(mongoUri) {
  if (isConnected) return mongoose.connection;
  if (!mongoUri) throw new Error(MONGO_URI);

  await mongoose.connect(mongoUri, {
  });
  isConnected = true;
  console.log('MongoDB connected');
  return mongoose.connection;
}

module.exports = { connectDB };
