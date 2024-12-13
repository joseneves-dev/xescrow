import express, {Express } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import Redis from 'ioredis';

//middlwares
import { errorCustomization } from './middlewares/ErrorCustomization';

//database
import initializeDatabase from './database/db';

//routes
import routesSatatus from './routes/Status';
import routesCsrf from './routes/Csrf';
import routesSignup from './routes/Signup'
import routesData from './routes/Data';

// Setting up the app
const app: Express = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_PARSER));

app.use(cors({
    credentials: true,
    origin: [process.env.ORIGIN_URL as string]
}));

app.use(morgan((tokens, req, res) => {
    return JSON.stringify({
        url: tokens.url(req, res),
        status: tokens.status(req, res),
    });
}));

// Create Redis client instance
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    connectTimeout: 5000, // 5 seconds
});

// Configure rate limiter with Redis store
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes window
    max: 10000, // Limit each IP to 10,000 requests per windowMs
    message: "server.to-many-request",
    skipFailedRequests: true, // Do not count failed requests (e.g., status >= 400)
    skipSuccessfulRequests: false, // Count successful requests (status < 400)
    keyGenerator: (req) => {
        return req.ip; // Rate limit based on IP address
    },
    store: new RedisStore({
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args) => redisClient.call(...args),
    }),
});

// Apply the rate limiter to all requests
app.use(limiter);

// Routes
app.use('/', routesSatatus, routesCsrf, routesSignup);
app.use('/data', routesData);
app.use(errorCustomization)

async function startServer() {
    try {
      await initializeDatabase()
      
      app.listen(process.env.PORT);
    } catch (error) {
      console.log(error)
    }
  }
  
startServer();