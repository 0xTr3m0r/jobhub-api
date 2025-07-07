import express from 'express';
import dotenv from 'dotenv';
import userRoute from './routes/auth_route.js';
import cookieParser from 'cookie-parser';
import { ConnectDB } from './config/db.js';
import jobRoute from './routes/job_route.js';
import rateLimit from 'express-rate-limit';
const app = express();
dotenv.config();
const PORT = process.env.PORT;

const Limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later.",
})

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(Limiter);
app.use('/api/auth',userRoute);
app.use('/api/jobs', jobRoute);
ConnectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`I'm listening on http://localhost:${PORT}`);
    });
});

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not found" }));

//global error handler (it catches all errors thrown in the app)
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal server error" });
});

