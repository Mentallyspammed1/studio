
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple Request Logger Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next(); // Don't forget to call next() to pass control to the next middleware/route handler
});


// Catch-all for 404 Not Found errors
app.use((req, res, next) => {
  const error = new Error('Not Found');
  res.status(404);
  next(error); // Pass the error to the next middleware
});

// Centralized error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack); // Log the error stack for debugging

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // If status is still 200, it's a server error
  res.status(statusCode);
  res.json({
    message: err.message,
    // In production, you might not want to send the stack trace
    // stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
