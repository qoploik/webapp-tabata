import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import presetsRouter from './routes/presets.js';
import { errorHandler } from './middleware/errorHandler.js';

const PORT = process.env.PORT ?? 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/presets', presetsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Server listening', { port: PORT });
});
