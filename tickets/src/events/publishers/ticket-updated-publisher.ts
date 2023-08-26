import { Subjects, Publisher, TicketUpdatedEvent } from "@agticket13/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
