import EventFeedback from "../EventUser/EventFeedback";
import { EventAdmin } from "./EventAdmin";
import { EventParticipant } from "./EventParticipant";

export interface EventInformation {
  eventId: number;
  eventName: string;
  description: string;
  eventDateStart: string;
  eventDateEnd: string;
  eventLocation: string;
  eventTypeId: number;
  eventType: string;
  eventCategoryId: number;
  eventCategory: string;
  eventStatus: string;
  formOfHolding: string;
  forWhom: string;
  rating: number;
  numberOfPartisipants: number;
  eventAdmins: EventAdmin[];
  eventParticipants: EventParticipant[];
  eventFeedbacks: EventFeedback[];
  gallery: number[];
}
