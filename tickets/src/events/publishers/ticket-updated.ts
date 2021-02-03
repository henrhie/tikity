import { Publisher, Subjects, TicketUpdatedEvent } from "@tikity/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated;
}