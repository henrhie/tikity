import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const PORT = 3000;

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

natsWrapper.client.on('connect', () => {
  new OrderCreatedListener(natsWrapper.client).listen();
})

natsWrapper.client.on('close', () => {
  console.log("NATS connection closed!!!");
  process.exit();
})
process.on("SIGINT", () => natsWrapper.client.close());
process.on("SIGTERM", () => natsWrapper.client.close())




