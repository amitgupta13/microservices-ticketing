import { Subjects, Publisher, TicketCreatedEvent } from "@agticket13/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
