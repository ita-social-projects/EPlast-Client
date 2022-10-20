import { ReportStatus } from "./ReportStatus";

export class ClubAnnualReport {
  id: number;
  status: ReportStatus;
  date: Date;
  currentClubMembers: number;
  currentClubFollowers: number;
  clubEnteredMembersCount: number;
  clubLeftMembersCount: number;
  phoneNumber: string;
  email: string;
  clubURL: any;
  street: any;
  clubCenters: string;
  kbUSPWishes: string;
  clubId: number;
  clubName: string;
  creatorId: string;
  creatorFirstName: string;
  creatorLastName: string;
  creatorFatherName: string;
  head: any;
  admins: any;
  members: any;
  followers: any;

  constructor() {
    this.id = 0;
    this.date = new Date();
    this.currentClubMembers = 0;
    this.currentClubFollowers = 0;
    this.clubEnteredMembersCount = 0;
    this.currentClubMembers = 0;
    this.clubLeftMembersCount = 0;
    this.phoneNumber = '';  
    this.email = '';
    this.clubCenters = '';
    this.kbUSPWishes = '';
    this.creatorId = '';
    this.creatorFirstName = '';
    this.creatorLastName = '';
    this.creatorFatherName = '';
    this.status = 0;
    this.clubId = 0;
    this.clubName = '';
  }
}