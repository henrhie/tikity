import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from "../../models/tickets";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "kaljlda",
      price: 35
    })
    .expect(404)
})

it("returns a 401 if user is not authorized", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "kaljlda",
      price: 35
    })
    .expect(401)
})

it("returns a 401 if user does not own ticket", async () => {
  const title = "dkajlgda";
  const price = 33;
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(201)
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({ title, price })
    .expect(401);
})

it("returns a 400 if user provides invalid title or price", async () => {
  const cookies = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookies)
    .send({
      title: "dkgdagd",
      price: 4545
    })
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookies)
    .send({
      title: "",
      price: -23
    })
    .expect(400)
})

it("updates ticket with valid inputs", async () => {
  const title = "valid title";
  const price = 30;
  const cookies = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookies)
    .send({
      title: "dkgdagd",
      price: 4545
    })
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookies)
    .send({ title, price })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)
  expect(ticketResponse.body.title).toEqual(title)
  expect(ticketResponse.body.price).toEqual(price)
})

it("publishes an event when ticket is updated", async () => {
  const title = "valid title";
  const price = 30;
  const cookies = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookies)
    .send({
      title: "dkgdagd",
      price: 4545
    })
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookies)
    .send({ title, price })
    .expect(200)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('reject updates if ticket is reserved', async () => {
  const title = "valid title";
  const price = 30;
  const cookies = global.signin();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookies)
    .send({
      title: "dkgdagd",
      price: 4545
    })

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  ticket?.save();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookies)
    .send({ title, price })
    .expect(400)
})