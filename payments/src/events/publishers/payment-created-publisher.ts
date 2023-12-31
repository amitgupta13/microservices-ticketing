import { Subjects, Publisher, PaymentCreatedEvent } from "@agticket13/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
