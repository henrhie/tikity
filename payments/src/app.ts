import express from "express";
require("express-async-errors");
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@tikity/common"
import { createChargeRouter } from './routes/new';


const app = express();

app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(cookieSession({
  secure: process.env.NODE_ENV !== "test",
  signed: false
}))

app.use(currentUser);
app.use(createChargeRouter);

app.all("*", async () => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app }