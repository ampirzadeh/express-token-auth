import { Handler } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { tokenKey } from "../config";
import { httpDebug } from "../debug";

export const auth: Handler = (req, res, next) => {
  const token: string =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization || '';

  try {
    const decoded = verify(token.replace("Bearer ", ""), tokenKey);
    req.user = JSON.parse(JSON.stringify(decoded)).email;
    return next();
  } catch (error) {
    httpDebug(error);
    return next(new createHttpError.Unauthorized());
  }
};
