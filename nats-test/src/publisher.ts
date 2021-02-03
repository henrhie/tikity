import nats from 'node-nats-streaming';

import { TicketCreatedPublisher } from './events/ticket-created-publisher';


const stan = nats.connect('tikity', 'abc', {
  url: 'http://localhost:4222'
});

stan.on('connect', async () => {
  console.log('publisher connected to NATS streaming server');
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      title: "concert",
      id: "123",
      price: 123
    })
  } catch (error) {
    console.log(error);
  }
  // const message = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 34
  // })

  // stan.publish('ticket:created', message, () => {
  //   console.log("message published");
  // })
})

