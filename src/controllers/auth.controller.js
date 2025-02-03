import httpStatus from "http-status";
import expressAsyncHandler from "express-async-handler";
import { authService } from "../services/index.js";

const register = expressAsyncHandler(async (req, res) => {
  const user = await authService.createUser(req.body);
  // const token = await tokenService.generateAuthToken(user)
  // const token = "ey.token mock up";
  res.status(httpStatus.CREATED).send({ data: user });
});

export default {
  register,
};
