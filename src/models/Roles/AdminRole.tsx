export enum AdminRole {
  Admin = 0, // Admin
  GoverningBodyAdmin = 1, // Крайовий адмін
  GoverningBodyHead = 2, // Голова керівного органу
  OkrugaHead = 3, // Голова округи
  OkrugaHeadDeputy = 4, // Заступник голови округи
  CityHead = 5, // Голова станиці
  CityHeadDeputy = 6, // Заступник голови станиці
  KurinHead = 7, // Голова куреня
  KurinHeadDeputy = 8, // Заступник голови куреня
}

// This enum is used to compare which one of two admins has more rights (user table)
// Roles in enum must be written strictly in descending order, starting with
// role with most rights ('Admin')
