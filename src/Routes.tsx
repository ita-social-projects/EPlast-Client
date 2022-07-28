import ActionCities from "./pages/City/Cities/ActionCities";
import City from "./pages/City/City/City";
import CityMembers from "./pages/City/City/CityMembers";
import CityAdministration from "./pages/City/City/CityAdministration";
import CityDocuments from "./pages/City/City/CityDocuments";
import CityFollowers from "./pages/City/City/CityFollowers";
import CreateCity from "./pages/City/CreateCity/CreateCity";
import EventUser from "./pages/Actions/ActionEvent/EventUser/EventUser";
import Actions from "./pages/Actions/Actions";
import ActionEvent from "./pages/Actions/ActionEvent/ActionEvent";
import UserProfile from "./pages/userPage/personalData/PersonalData";
import ActionClubs from "./pages/Club/Clubs/ActionClubs";
import Club from "./pages/Club/Club/Club";
import CreateClub from "./pages/Club/CreateClub/CreateClub";
import ClubMembers from "./pages/Club/Club/ClubMembers";
import ClubFollowers from "./pages/Club/Club/ClubFollowers";
import ClubAdministration from "./pages/Club/Club/ClubAdministration";
import ClubDocuments from "./pages/Club/Club/ClubDocuments";
import EventTypes from "./pages/Actions/EventTypes/EventTypes";
import AnnualReportCreate from "./pages/AnnualReport/AnnualReportCreate/AnnualReportCreate";
import AnnualReportTable from "./pages/AnnualReport/AnnualReportTable/AnnualReportTable";
import AnnualReportEdit from "./pages/AnnualReport/AnnualReportEdit/AnnualReportEdit";
import UsersTable from "./pages/UserTable/UserTable";
import UserDistinctions from "./pages/Distinction/DistinctionTable/DistinctionTable";
import KadrasTable from "./pages/KadraVykhovnykiv/KadrasPage";
import Regions from "./pages/Regions/ActionRegion";
import ActionRegion from "./pages/Regions/Region";
import AddNewRegionFormPage from "./pages/Regions/AddRegion";
import RegionAdministration from "./pages/Regions/RegionAdministration";
import RegionDocuments from "./pages/Regions/RegionDocuments";
import RegionMembers from "./pages/Regions/RegionMembers";
import StatisticsCities from "./pages/Statistics/StatisticsCities";
import StatisticsRegions from "./pages/Statistics/StatisticsRegions";
import { ClubAnnualReportCreate } from "./pages/AnnualReport/ClubAnnualReportCreate/ClubAnnualReportCreate";
import ClubAnnualReportEdit from "./pages/AnnualReport/ClubAnnualReportEdit/ClubAnnualReportEdit";
import DocumentsTable from "./pages/Documents/DocumentsTable";
import PrecautionTable from "./pages/Precaution/PrecautionTable/PrecautionTable";
import RegionBoard from "./pages/RegionsBoard/RegionBoard";
import RegionBoardEdit from "./pages/RegionsBoard/RegionBoardEdit";
import RegionBoardAdministration from "./pages/RegionsBoard/RegionBoardAdministration";
import RegionBoardDocuments from "./pages/RegionsBoard/RegionBoardDocuments";
import GoverningBody from "./pages/GoverningBody/GoverningBody/GoverningBody";
import CreateGoverningBody from "./pages/GoverningBody/CreateGoverningBody";
import AboutBase from "./pages/AboutBase/AboutBase";
import CreateGoverningBodySector from "./pages/GoverningBody/Sector/CreateSector";
import RegionAnnualReportCreate from "./pages/AnnualReport/RegionAnnualReportCreateEditView/RegionAnnualReportCreate";
import RegionAnnualReportEdit from "./pages/AnnualReport/RegionAnnualReportCreateEditView/RegionAnnualReportEdit";
import RegionAnnualReportInformation from "./pages/AnnualReport/AnnualReportTable/RegionAnnualReportInformation";
import AnnualReportInformation from "./pages/AnnualReport/AnnualReportTable/AnnualReportInformation/AnnualReportInformation";
import ClubAnnualReportInformation from "./pages/AnnualReport/AnnualReportTable/ClubAnnualReportInformation/ClubAnnualReportInformation";
import GoverningBodyAdministration from "./pages/GoverningBody/GoverningBody/GoverningBodyAdministration";
import GoverningBodyDocuments from "./pages/GoverningBody/GoverningBody/GoverningBodyDocuments";
import GoverningBodySectors from "./pages/GoverningBody/Sector/Sectors";
import GoverningBodySector from "./pages/GoverningBody/Sector/Sector";
import EditGoverningBodySector from "./pages/GoverningBody/Sector/EditSector";
import GoverningBodySectorDocuments from "./pages/GoverningBody/Sector/SectorDocuments";
import GoverningBodySectorAdministration from "./pages/GoverningBody/Sector/SectorAdministration";
import Announcements from "./pages/GoverningBody/Announcement/Announcement";
import SectorAnnouncement from "./pages/GoverningBody/Sector/SectorAnnouncement/SectorAnnouncement";
import UserRenewalTable from "./pages/UserRenewal/UserRenewalTable/UserRenewalTable";
import TermsOfUse from "./pages/Terms/TermsOfUse";
import TermsEdit from "./pages/Terms/TermsEdit";
import AnnouncementsTable from "./pages/AnnouncementsTable/AnnouncementsTable";
import RegionBoardMainAdministration from "./pages/RegionsBoard/RegionBoardMainAdministration";
import DecisionTable from "./pages/DecisionTable/DecisionTable";

export default [
  {
    path: "/userpage/:specify/:userId",
    name: "Профіль користувача",
    Component: UserProfile,
  },
  {
    path: "/regionalBoard",
    name: "Крайовий Провід Пласту",
    Component: RegionBoard,
  },
  {
    path: "/regionalBoard/new",
    name: "Створити керівний орган",
    Component: CreateGoverningBody,
  },
  {
    path: "/regionalBoard/edit",
    name: "Редагувати Провід Пласту",
    Component: RegionBoardEdit,
  },
  {
    path: "/regionalBoard/governingBodies",
    name: "Керівні органи",
    Component: RegionBoardAdministration,
  },
  {
    path: "/regionalBoard/administrations",
    name: "Адміністрація Крайового Проводу",
    Component: RegionBoardMainAdministration,
  },
  {
    path: "/regionalBoard/documents/:id",
    name: "Документообіг Крайового Проводу",
    Component: RegionBoardDocuments,
  },

  {
    path: "/governingBodies/documents/:id",
    name: "Документообіг Керівного Органу",
    Component: GoverningBodyDocuments,
  },
  {
    path: "/governingBodies/administration/:id",
    name: "Провід Керівного Органу",
    Component: GoverningBodyAdministration,
  },
  {
    path: "/governingBodies/edit/:id",
    name: "Редагування Керівного Органу",
    Component: CreateGoverningBody,
  },
  {
    path: "/regionalBoard/governingBodies/:governingBodyId",
    name: "Керівний орган",
    Component: GoverningBody,
  },
  {
    path: "/regionalBoard/governingBodies/:governingBodyId/sectors",
    name: "Напрями",
    Component: GoverningBodySectors,
  },
  {
    path: "/regionalBoard/governingBodies/:governingBodyId/sectors/:sectorId",
    name: "Напрям",
    Component: GoverningBodySector,
  },
  {
    path: "/governingBodies/:governingBodyId/sectors/new",
    name: "Створення напряму Керівного Органу",
    Component: CreateGoverningBodySector,
  },
  {
    path: "/governingBodies/announcements/:id/:p",
    name: "Оголошення",
    Component: Announcements,
  },
  {
    path: "/sector/announcements/:governingBodyId/:sectorId/:p",
    name: "Оголошення",
    Component: SectorAnnouncement,
  },
  {
    path: "/governingBodies/:governingBodyId/sectors/edit/:sectorId",
    name: "Редагування Напряму Керівного Органу",
    Component: EditGoverningBodySector,
  },
  {
    path: "/governingBodies/:governingBodyId/sectors/:sectorId/documents",
    name: "Документообіг Напряму Керівного Органу",
    Component: GoverningBodySectorDocuments,
  },
  {
    path: "/governingBodies/:governingBodyId/sectors/:sectorId/administration",
    name: "Провід Напряму Керівного Органу",
    Component: GoverningBodySectorAdministration,
  },
  {
    path: "/regions/members/:id",
    name: "Члени округи",
    Component: RegionMembers,
  },

  {
    path: "/regions/page/:p",
    name: "Округи",
    Component: Regions,
  },
  {
    path: "/regions",
    name: "Округи",
    Component: Regions,
  },
  {
    path: "/regions/:id",
    name: "Округа",
    Component: ActionRegion,
  },
  {
    path: "/regions/new",
    name: "Створити округу",
    Component: AddNewRegionFormPage,
  },
  {
    path: "/region/administration/:id",
    name: "Провід округи",
    Component: RegionAdministration,
  },
  {
    path: "/regions/documents/:id",
    name: "Документообіг округи",
    Component: RegionDocuments,
  },
  {
    path: "/cities/page/:p",
    name: "Станиці",
    Component: ActionCities,
  },
  {
    path: "/cities",
    name: "Станиці",
    Component: ActionCities,
  },
  {
    path: "/cities/new",
    name: "Створити станицю",
    Component: CreateCity,
  },
  {
    path: "/cities/edit/:id",
    name: "Редагувати станицю",
    Component: CreateCity,
  },

  //Wrong! URL MUST BE CHANGED!
  {
    path: "/regions/follower/edit/:id",
    name: "Подати заявку на створення станиці",
    Component: CreateCity,
  },

  {
    path: "/cities/members/:id",
    name: "Члени станиці",
    Component: CityMembers,
  },
  {
    path: "/cities/administration/:id",
    name: "Провід станиці",
    Component: CityAdministration,
  },

  {
    path: "/cities/documents/:id",
    name: "Документообіг станиці",
    Component: CityDocuments,
  },
  {
    path: "/cities/followers/:id",
    name: "Зголошені до станиці",
    Component: CityFollowers,
  },
  {
    path: "/cities/:id",
    name: "Станиця",
    Component: City,
  },
  {
    path: "/clubs/page/:p",
    name: "Курені",
    Component: ActionClubs,
  },
  {
    path: "/clubs",
    name: "Курені",
    Component: ActionClubs,
  },
  {
    path: "/clubs/new",
    name: "Створення куреня",
    Component: CreateClub,
  },
  {
    path: "/clubs/:id",
    name: "Курінь",
    Component: Club,
  },
  {
    path: "/clubs/edit/:id",
    name: "Редагування куреня",
    Component: CreateClub,
  },
  {
    path: "/clubs/members/:id",
    name: "Члени Куреня",
    Component: ClubMembers,
  },
  {
    path: "/clubs/followers/:id",
    name: "Прихильники Куреня",
    Component: ClubFollowers,
  },
  {
    path: "/clubs/administration/:id",
    name: "Провід Куреня",
    Component: ClubAdministration,
  },
  {
    path: "/clubs/documents/:id",
    name: "Документообіг Куреня",
    Component: ClubDocuments,
  },
  {
    path: "/events/types",
    name: "Типи подій",
    Component: EventTypes,
  },
  {
    path: "/events/:typeId/categories",
    name: "Категорії подій",
    Component: Actions,
  },
  {
    path: "/types/:typeId/categories/:categoryId/events",
    name: "Події",
    Component: ActionEvent,
  },
  {
    path: "/events/details/:id",
    name: "Подія",
    Component: ActionEvent,
  },
  {
    path: "/userpage/eventUsers/:userId",
    name: "Користувач",
    Component: EventUser,
  },
  {
    path: "/decisions",
    name: "Рішення",
    Component: DecisionTable,
  },
  {
    path: "/announcements/:page",
    name: "Дошка оголошень",
    Component: AnnouncementsTable,
  },
  {
    path: "/annualreport/create/:cityId",
    name: "Створити річний звіт станиці",
    Component: AnnualReportCreate,
  },
  {
    path: "/annualreport/createClubAnnualReport/:clubId",
    name: "Створити річний звіт станиці",
    Component: ClubAnnualReportCreate,
  },
  {
    path: "/annualreport/region/create/:regionId/:year",
    name: "Створити річний звіт округи",
    Component: RegionAnnualReportCreate,
  },
  {
    path: "/annualreport/region/edit/:annualreportId/:year",
    name: "Редагувати річний звіт округи",
    Component: RegionAnnualReportEdit,
  },
  {
    path: "/annualreport/region/:annualreportId/:year",
    name: "",
    Component: RegionAnnualReportInformation,
  },
  {
    path: "/annualreport/edit/:id",
    name: "",
    Component: AnnualReportEdit,
  },
  {
    path: "/annualreport/cityAnnualReport/:id",
    name: "",
    Component: AnnualReportInformation,
  },
  {
    path: "/annualreport/clubAnnualReport/:id",
    name: "",
    Component: ClubAnnualReportInformation,
  },
  {
    path: "/club/editClubAnnualReport/:id",
    name: "",
    Component: ClubAnnualReportEdit,
  },
  {
    path: "/annualreport/table/:noTitleKey",
    name: "",
    Component: AnnualReportTable,
  },
  {
    path: "/aboutBase",
    name: "Про Базу",
    Component: AboutBase,
  },
  {
    path: "/terms",
    name: "Політика конфіденційності",
    Component: TermsOfUse,
  },
  {
    path: "/terms/edit",
    name: "",
    Component: TermsEdit,
  },
  {
    path: "/annualreport/create/:cityId",
    name: "",
    Component: AnnualReportCreate,
  },
  {
    path: "/user/table",
    name: "",
    Component: UsersTable,
  },
  {
    path: "/kadra",
    name: "Кадра Виховників",
    Component: KadrasTable,
  },
  {
    path: "/distinctions",
    name: "Відзначення",
    Component: UserDistinctions,
  },
  {
    path: "/legislation",
    name: "Репозитарій",
    Component: DocumentsTable,
  },
  {
    path: "/precautions",
    name: "Перестороги",
    Component: PrecautionTable,
  },
  {
    path: "/renewals",
    name: "Запити на відновлення статусу",
    Component: UserRenewalTable,
  },
  {
    path: "/statistics/cities",
    name: "Статистика Станиць",
    Component: StatisticsCities,
  },
  {
    path: "/statistics/regions",
    name: "Статистика Округ",
    Component: StatisticsRegions,
  },
];
