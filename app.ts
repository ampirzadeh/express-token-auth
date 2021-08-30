import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import slowDown from "express-slow-down";
import { ErrorHandler } from "./controllers";
import { dbConnect } from "./db/";
import router from "./router";
import { swaggerConfig } from "./config";

dbConnect();

declare global {
  namespace Express {
    interface Request {
      user: string;
    }
  }
}

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});
const app = express();
app.use(speedLimiter);
app.use(cors());
app.use(helmet());
app.use(json());
app.use((req, _, next) => {
  req.user = "";
  next();
});
app.use("/", router);

const swaggerSpec = swaggerJSDoc(swaggerConfig);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(ErrorHandler);
``;
export default app;
