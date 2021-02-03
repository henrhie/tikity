import nats from "node-nats-streaming";
import { randomBytes } from 'crypto'

import { TicketCreatedListener } from "./events/ticket-created-listener";

// console.clear();

const stan = nats.connect("tikity", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222"
});

stan.on("connect", () => {
  console.log("listener connected to NATS streaming server");
  stan.on("close", () => {
    console.log("closing service");
    process.exit();
  })
  new TicketCreatedListener(stan).listen();
})

process.on("SIGINT", stan.close);
process.on("SIGTERM", stan.close)



