import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@tikity/common";

const router = express.Router();

router.post("/api/users/signup", [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("password length must be between 4 and 20")
],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("email already in use");
    }

    User.build({ email, password }).save((err, user) => {
      const userJwt = jwt.sign({
        id: user.id,
        email: user.email
      }, process.env.JWT_KEY!);
      req.session = { jwt: userJwt }
      res.status(201).send(user);
    })
  })

export { router as signupRouter };