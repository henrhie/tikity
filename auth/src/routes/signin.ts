import express from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@tikity/common";
import { Password } from "../services/password";
import { User } from "../models/user";

const router = express.Router();

router.post("/api/users/signin",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password")
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("invalid credentials");
    }
    const match = await Password.compare(existingUser.password, password);
    if (!match) {
      throw new BadRequestError("invalid credentials");
    }
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    }, process.env.JWT_KEY!);
    req.session = { jwt: userJwt }

    return res.status(200).send(existingUser)
  })

export { router as signinRouter };