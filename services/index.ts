export { EnterUser } from "./auth.service";
export { ErrorHandler, ValidationErrorHandler } from "./error.service";

import { ValidationChain } from "express-validator";
import { Handler } from "express";
export type Service = { validation: ValidationChain[]; main: Handler };
