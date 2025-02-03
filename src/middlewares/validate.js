import Joi from "joi";
import httpStatus from "http-status";
import { extract } from "../utils/extract.js";
import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  const validSchema = extract(schema, ["params", "query", "body"]);
  const object = extract(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};
