import { EventInformation } from "./EventInformation";

export interface EventDetails {
  event: EventInformation;
  participantAssessment: number;
  isUserParticipant: boolean;
  isUserApprovedParticipant: boolean;
  isUserUndeterminedParticipant: boolean;
  isUserRejectedParticipant: boolean;
  isEventFinished: boolean;
  isEventNotApproved: boolean;
  canEstimate: boolean;
}
