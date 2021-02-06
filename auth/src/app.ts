import express from "express";
require("express-async-errors");
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup"
import { errorHandler, NotFoundError } from "@tikity/common"

const app = express();
const PORT = 3000;

app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(cookieSession({
  secure: false,
  signed: false
}))

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all("*", async () => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app }