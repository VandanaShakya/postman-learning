// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./services/db');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('User CRUD MVC API running'));

app.use('/api/users', userRoutes);

// Error handler (last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || "";
const MONGO_URI = process.env.MONGO_URI;

(async () => {
  try {
    if (!MONGO_URI) {
      console.error('MONGO_URI env var missing. See .env.example');
      process.exit(1);
    }
    await connectDB(MONGO_URI);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
