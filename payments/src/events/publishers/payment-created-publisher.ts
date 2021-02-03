import { PaymentCreatedEvent, Publisher, Subjects } from "@tikity/common";


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}