import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from '../../nats-wrapper';

it("has a route handler listening to /api/tickets for post request", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .send({})
  expect(response.status).not.toEqual(400);
})

it("can only be accessed if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "helloworld", price: 2.1 })
  expect(response.status).toEqual(201)

})

it("does not return a 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({})
  expect(response.status).not.toEqual(401);
})

it("fails if invalid title is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "" })
  expect(response.status).toEqual(400)
})

it("fails if invalid price is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "" })
  expect(response.status).toEqual(400)
})

it("returns a 201 if valid document is created", async () => {
  const title = "title";
  const price = 20;
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
  expect(response.status).toEqual(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
})

it("publishes an event when ticket is created", async () => {
  const title = "title";
  const price = 20;
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title, price })
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
