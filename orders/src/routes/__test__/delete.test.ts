import request from 'supertest';
import mongoose from 'mongoose';
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus, Order } from '../../models/order';

it('marks an order as cancelled', async () => {
  const user = global.signin();
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'title',
    price: 20
  })
  await ticket.save();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it.todo('publishes an event when order is cancelled')