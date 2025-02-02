import express from "express";
import helmet from "helmet";
import cors from "cors";
import passport from "passport";
import config from "./config/config.js";
import { jwtStrategy } from "./config/passport.js";
import morgan from "./config/morgan.js";
import ApiError from "./utils/ApiError.js";
import { errorConverter, errorHandler } from "./middlewares/error.js";
import httpStatus from 'http-status'

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// v1 api routes
// app.use("/v1", routes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
