import express from "express";
require("express-async-errors");
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@tikity/common"
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(cookieSession({
  secure: process.env.NODE_ENV !== "test",
  signed: false
}))

app.use(currentUser);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter)
app.use(deleteOrderRouter);


app.all("*", async () => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app }