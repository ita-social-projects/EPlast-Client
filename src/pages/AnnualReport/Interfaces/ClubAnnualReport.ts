import Club from '../../../models/Club/Club';

interface ClubAnnualReport {
    id: number;
    idView:any;
    name:string;
    status: number;
    date: Date;
    currentClubMembers: number;
    currentClubFollowers: number;
    clubEnteredMembersCount: number;
    clubLeftMembersCount: number;
    clubCenters: string;
    clubContacts: string;
    clubPage:string;
    kbUSPWishes:string;
    clubId:number;
    club: Club | null;
    clubMembersSummary: string;
    clubAdminContacts: string;
    clubName: string;
}

export default ClubAnnualReport;