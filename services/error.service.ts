import createHttpError from "http-errors";
import { Handler, ErrorRequestHandler } from "express";
import { validationResult } from "express-validator";

export const ErrorHandler: ErrorRequestHandler = (err, req, res, next) =>
  res.status(err.status).json(err);

export const ValidationErrorHandler: Handler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) next();
  else next(new createHttpError.BadRequest(errors.array()[0].msg));
};
