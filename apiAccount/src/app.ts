import express, { Express } from "express";
import morgan from "morgan";
import passport from "passport";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

//Helpers
import { redisClient } from "./helpers/Redis";

//Middlwares
import { extractIp } from "./middlewares/routes/ExtractIp";
import {
  doubleCsrfProtection,
  csrfErrorHandler,
} from "./middlewares/routes/Csrf";
import { errorCustomization } from "./middlewares/routes/ErrorCustomization";

//Passport
import { signupStrategy } from "./middlewares/passport/Signup";
import { loginStrategy } from "./middlewares/passport/Login";
import { secondFactorStrategy } from "./middlewares/passport/SecondFactor";
import { authorizeStrategy } from "./middlewares/passport/Authorize";
import { accessStrategy } from "./middlewares/passport/Access";
import { refreshStrategy } from "./middlewares/passport/Refresh";

//Database
import initializeDatabase from "./database/db";

//Routes
import routesSession from "./routes/Session";
import routesCsrf from "./routes/Csrf";
import routesSatatus from "./routes/Status";
import routesSecondFactor from "./routes/authentication/SecondFactor";
import routeSignup from "./routes/authentication/Signup";
import routeLogin from "./routes/authentication/Login";
import routesPassword from "./routes/authentication/Password";
import routeAuthorize from "./routes/Authorize";
import routesAccount from "./routes/Account";
import routesApp from "./routes/App";

const app: Express = express();
dotenv.config();

// Middlewares
app.use(express.json());
app.use(passport.initialize());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_PARSER));

app.use(
  cors({
    credentials: true,
    origin: [process.env.ORIGIN_URL as string],
  })
);

app.use(
  morgan((tokens, req, res) => {
    return JSON.stringify({
      url: tokens.url(req, res),
      status: tokens.status(req, res),
    });
  })
);

//Rate limiter with Redis store
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes window
  max: 10000, // Limit each IP to 10,000 requests per windowMs
  message: "server.tooManyRequests",
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

app.use(limiter);

app.set("trust proxy", true);

//Initialize passport strategies
signupStrategy();
loginStrategy();
secondFactorStrategy();
authorizeStrategy();
accessStrategy();
refreshStrategy();

//Routes
app.use(
  "/",
  doubleCsrfProtection,
  csrfErrorHandler,
  extractIp,
  routesCsrf,
  routesSatatus
);
app.use(
  "/auth",
  routeSignup,
  routeLogin,
  routesPassword,
  routesSecondFactor,
  routesSession,
  routeAuthorize
);
app.use("/account", routesAccount);
app.use("/app", routesApp);
app.use(errorCustomization);

//Start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(process.env.PORT);
  } catch (error) {
    console.log(error);
  }
}

startServer();
