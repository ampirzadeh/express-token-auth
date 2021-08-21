import { Handler } from "express";
import { verify } from "jsonwebtoken";
import { tokenKey } from "../config";

export const auth: Handler = (req, res, next) => {
  const token: string =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization;

  try {
    const decoded = verify(token.replace("Bearer ", ""), tokenKey);
    req.user = JSON.parse(JSON.stringify(decoded)).email;
    return next();
  } catch (err) {
    return res.sendStatus(401);
  }
};
