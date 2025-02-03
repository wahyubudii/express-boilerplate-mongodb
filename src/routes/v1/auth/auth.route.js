import express from "express";
import { validate } from "../../../middlewares/validate.js";
import authValidation from "../../../models/validations/auth/auth.validation.js"
import authController from "../../../controllers/auth.controller.js"

const router = express.Router();

router.get("/test", (req, res) =>
  res.json({ message: "auth router connected" })
);
router.post("/register", validate(authValidation.register), authController.register);
router.post("/login", validate(authValidation.login), authController.login);

export default router;
