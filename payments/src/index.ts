import mongoose from "mongoose";

import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'

import { natsWrapper } from "./nats-wrapper";
import { app } from "./app";

const PORT = 3000;

if (!process.env.MONGO_URI) {
  throw new Error("must provide mongodb uri")
}
if (!process.env.NATS_CLIENT_ID) {
  throw new Error("UNDEFINED CLIENT ID");
}
if (!process.env.NATS_URL) {
  throw new Error("UNDEFINED NATS URL");
}
if (!process.env.CLUSTER_ID) {
  throw new Error("UNDEFINED CLUSTER ID");
}

//connect to nats streaming server
natsWrapper.connect(
  process.env.CLUSTER_ID,
  process.env.NATS_CLIENT_ID,
  process.env.NATS_URL
)
  .then(() => { })
  .catch(err => {
    console.log(err);
  })

natsWrapper.client.on('close', () => {
  console.log("NATS connection closed!!!!!!!!!");
  process.exit();
})
process.on("SIGINT", () => natsWrapper.client.close());
process.on("SIGTERM", () => natsWrapper.client.close())

natsWrapper.client.on('connect', () => {
  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();
})

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
  .then(() => {
    console.log("connected to db");
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


