import express, { json } from "express";
import { dbConnect } from "./db/";
import router from "./router";

dbConnect();

declare global {
  namespace Express {
    interface Request {
      user: string;
    }
  }
}

const app = express();
app.use(json());
app.use((req, _, next) => {
  req.user = "";
  next();
});
app.use("/", router);

export default app;
