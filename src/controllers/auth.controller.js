import httpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";
import { authService } from "../services/index.js";

const register = expressAsyncHandler(async (req, res) => {
  const user = await authService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ data: user });
});

const login = expressAsyncHandler(async (req, res) => {
  const user = await authService.login(req.body)
  res.status(httpStatus.OK).send({ data: user });
});

export default {
  register,
  login
};
