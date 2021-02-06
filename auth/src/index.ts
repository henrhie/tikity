import mongoose from "mongoose";
import { app } from "./app";

const PORT = 3000;

if (!process.env.MONGO_URI) {
  throw new Error("must provide mongodb uri")
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    console.log("connected to database...");
    if (!process.env.JWT_KEY) {
      throw new Error("jwt key must be defined");
    }
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  })


