import { NextFunction, Request, Response } from "express";
import { ValidationChain, validationResult } from "express-validator";

export interface IValidationError {
  type?: string;
  msg?: string;
  path?: string;
  location?: string;
}

export const validate = (validations: Array<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      // If there are no validation errors, move to the next middleware
      return next();
    }

    const errorMessages = errors.array().map((error: IValidationError) => {
      const obj = {};
      obj[error.path] = error.msg;
      return obj;
    });

    return res
      .status(400)
      .json({ statusCode: 400, status: "error", errors: errorMessages });
  };
};
