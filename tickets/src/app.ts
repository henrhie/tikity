import express from "express";
require("express-async-errors");
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler, NotFoundError, currentUser } from "@tikity/common"
import { createTicketRouter } from "./routes/new";
import { showTicketsRouter } from "./routes/show";
import { indexTicketsRouter } from "./routes/index";
import { updateRouter } from "./routes/update";

const app = express();

app.set("trust proxy", true);
app.use(bodyParser.json());
app.use(cookieSession({
  secure: false,
  signed: false
}))

app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketsRouter);
app.use(indexTicketsRouter)
app.use(updateRouter);


app.all("*", async () => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app }