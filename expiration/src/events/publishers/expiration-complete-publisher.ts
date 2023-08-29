import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@agticket13/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
