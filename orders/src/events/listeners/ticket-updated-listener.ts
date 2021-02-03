import { Listener, Subjects, TicketUpdatedEvent } from "@tikity/common";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1
    })

    if (!ticket) {
      throw new Error("ticket not found");
    }
    const { title, price } = data;
    ticket.set({ title, price }); //increases version number
    await ticket.save()
    msg.ack();
  }
}