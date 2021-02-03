import { Publisher, Subjects, TicketCreatedEvent } from "@tikity/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated;
}