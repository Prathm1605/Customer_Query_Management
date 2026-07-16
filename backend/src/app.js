import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import queryRoutes from './routes/query.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB Database
connectDB();

//  Global Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));

// API Routes Mounting (We will create these next)
app.use('/api/auth', authRoutes);
app.use('/api/queries', queryRoutes);


app.get('/', (req, res) => {
    res.send('Customer Query Management System API is running...');
});


app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export default app;