import Club from './Club';
import CityAdmin from './ClubAdmin';
import ClubAdmin from './ClubAdmin';
import ClubMember from './ClubMember';

export default class ClubProfile {
  club: Club;
  admin: CityAdmin;
  administration: ClubAdmin[];
  members: ClubMember[];
  documents: object;
  followers: ClubMember[];

  constructor() {
    this.club = new Club();
    this.admin = new CityAdmin();
    this.administration = [];
    this.members = [];
    this.documents = new Object();
    this.followers = [];
  }
}