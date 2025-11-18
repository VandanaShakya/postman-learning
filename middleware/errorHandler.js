// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err);
  // Mongoose duplicate key
  if (err.name === 'MongoServerError' && err.code === 11000) {
    return res.status(409).json({ ok: false, error: 'Duplicate key error', details: err.keyValue });
  }
  // Validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({ ok: false, error: err.message });
  }
  res.status(500).json({ ok: false, error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
