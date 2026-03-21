import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dotenv from 'dotenv';
import applicationRoutes from './routes/applications.js';
import exceptionRoutes from './routes/exceptions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://frontend',  // Docker service name
    'http://localhost',
    '*'  // Allow all origins in development
  ],
  credentials: true,
}));

app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
}));

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/exceptions', exceptionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 API: http://localhost:${PORT}/api`);
});
