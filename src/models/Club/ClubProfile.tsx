import Club from './Club';
import ClubAdmin from './ClubAdmin';
import ClubMember from './ClubMember';

export default class ClubProfile {
  club: Club;
  clubAdmin: ClubAdmin;
  clubAdministration: ClubAdmin[];
  members: ClubMember[];
  documents: object;
  followers: ClubMember[];

  constructor() {
    this.club = new Club();
    this.clubAdmin = new ClubAdmin();
    this.clubAdministration = [];
    this.members = [];
    this.documents = new Object();
    this.followers = [];
  }
}