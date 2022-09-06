export interface EventParticipant {
  participantId: number;
  fullName: string;
  email: string;
  userId: string;
  statusId: number;
  status: string;
  wasPresent: boolean;
}
