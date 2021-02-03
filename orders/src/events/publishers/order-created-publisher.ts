import { Publisher, OrderCreatedEvent, Subjects } from '@tikity/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}