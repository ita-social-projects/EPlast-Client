import Club from "../../../models/Club/Club";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from "../../../models/Club/ClubMember";

interface ClubAnnualReport {
    id: number;
    idView: any;
    name: string;
    status: number;
    date: Date;
    currentClubMembers: number;
    currentClubFollowers: number;
    clubEnteredMembersCount: number;
    clubLeftMembersCount: number;
    clubCenters: string;
    clubContacts: string;
    clubPage: string;
    kbUSPWishes: string;
    clubId: number;
    club: Club | null;
    clubMembersSummary: string;
    clubAdminContacts: string;
    clubName: string;
    email?: string;
    phoneNumber?: string;
    head?: ClubAdmin;
    members?: ClubMember[];
    admins?: ClubAdmin[];
    followers?: ClubMember[];
}

export default ClubAnnualReport;
