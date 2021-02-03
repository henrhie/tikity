import { ExpirationCompleteEvent, Publisher, Subjects } from "@tikity/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}