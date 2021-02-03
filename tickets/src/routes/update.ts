import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  BadRequestError
} from "@tikity/common";
import { Ticket } from "../models/tickets";
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put("/api/tickets/:id", requireAuth, [
  body("title")
    .not()
    .isEmpty()
    .withMessage("invalid input for ticket title"),
  body("price")
    .isFloat({ gt: 0 })
], validateRequest, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }
  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError()
  }

  if (ticket.orderId) {
    throw new BadRequestError('ticket already reserved')
  }

  const { title, price } = req.body;
  ticket.set({ title, price })
  await ticket.save();
  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version //updated version number
  })

  return res.send(ticket)
})


export { router as updateRouter }