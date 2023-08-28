import { Publisher, OrderCreatedEvent, Subjects } from "@agticket13/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
