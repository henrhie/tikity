import { Listener, OrderCreatedEvent, Subjects } from "@tikity/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from '../publishers/ticket-updated';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('ticket not found');
    }
    ticket.set({ orderId: data.id });
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })
    msg.ack();
  }
}