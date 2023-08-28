import { Publisher, Subjects, OrderCancelledEvent } from "@agticket13/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
