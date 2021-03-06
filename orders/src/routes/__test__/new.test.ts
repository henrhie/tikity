import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from "../../models/ticket";
import { Order, OrderStatus } from "../../models/order";


it('returns an error if the ticket does not exist', async () => {
  const ticketId = mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId
    })
    .expect(404);
})

it('returns an error  if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30
  })
  await ticket.save();

  const order = Order.build({
    userId: 'some-random-stuff',
    status: OrderStatus.Created,
    ticket,
    expiresAt: new Date()
  })
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId: ticket.id
    })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 30
  })
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
})

it.todo("emits an order event")

