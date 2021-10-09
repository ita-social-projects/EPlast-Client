export enum AdminRole {
  Admin = 0,          //Admin
  GoverningBodyHead,  //Голова керівного органу
  RegionHead,         //Голова округи
  RegionHeadDeputy,   //Заступник голови округи
  CityHead,           //Голова станиці
  CityHeadDeputy,     //Заступник голови станиці 
  ClubHead,           //Голова куреня
  ClubHeadDeputy,     //Заступник голови куреня
}

//This enum is used to compare which one of two admins has more rights (user table)
//Roles in enum must be written strictly in descending order, starting with 
//role with most rights ('Admin')
