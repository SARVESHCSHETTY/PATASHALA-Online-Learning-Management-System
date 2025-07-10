import express from 'express';

import connectDB from './database/db.js';
import userRoute from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import courseRoute from './routes/course.route.js';
import mediaRoute from './routes/media.route.js';
import purchaseRoute from './routes/purchaseCourse.route.js';
import courseProgressRoute from './routes/courseProgress.route.js';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import superadminRoutes from './routes/superadmin.routes.js';
dotenv.config();
import path from 'path';



//call database connection 
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

app.use(cors({
    origin: 'https://patashala-online-learning-management.onrender.com',
    credentials: true,
}));

app.use(cookieParser());
//default middleware
app.use(express.json());

//apis
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/superadmin', superadminRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));
app.get(/^\/(?!api).*/, (_, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment variables loaded successfully');
});   