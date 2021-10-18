export enum AdminRole {
  Admin             = 0,  //Admin
  GoverningBodyHead = 1,  //Голова керівного органу
  OkrugaHead        = 2,  //Голова округи
  OkrugaHeadDeputy  = 3,  //Заступник голови округи
  CityHead          = 4,  //Голова станиці
  CityHeadDeputy    = 5,  //Заступник голови станиці 
  KurinHead         = 6,  //Голова куреня
  KurinHeadDeputy   = 7,  //Заступник голови куреня
}

//This enum is used to compare which one of two admins has more rights (user table)
//Roles in enum must be written strictly in descending order, starting with 
//role with most rights ('Admin')
