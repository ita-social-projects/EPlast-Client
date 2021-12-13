import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import DecisionTable from "./pages/DecisionTable/DecisionTable";
import "./App.less";
import HeaderContainer from "./components/Header/HeaderContainer";
import Home from "./pages/Home/Home";
import FooterContainer from "./components/Footer/FooterContainer";
import PrivateLayout from "./components/PrivateLayout/PrivateLayout";
import RouteWithLayout from "./RouteWithLayout";
import Contacts from "./pages/Contacts/Contacts";
import ActionCities from "./pages/City/Cities/ActionCities";
import City from "./pages/City/City/City";
import CityMembers from "./pages/City/City/CityMembers";
import CityAdministration from "./pages/City/City/CityAdministration";
import CityDocuments from "./pages/City/City/CityDocuments";
import CityFollowers from "./pages/City/City/CityFollowers";
import CreateCity from "./pages/City/CreateCity/CreateCity";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import EventInfo from "./pages/Actions/ActionEvent/EventInfo/EventInfo";
import EventUser from "./pages/Actions/ActionEvent/EventUser/EventUser";
import Actions from "./pages/Actions/Actions";
import ActionEvent from "./pages/Actions/ActionEvent/ActionEvent";
import UserProfile from "./pages/userPage/personalData/PersonalData";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import UserRenewal from "./pages/UserRenewal/UserRenewal";
import ActionClubs from "./pages/Club/Clubs/ActionClubs";
import Club from "./pages/Club/Club/Club";
import CreateClub from "./pages/Club/CreateClub/CreateClub";
import ClubMembers from "./pages/Club/Club/ClubMembers";
import ClubFollowers from "./pages/Club/Club/ClubFollowers";
import ClubAdministration from "./pages/Club/Club/ClubAdministration";
import ClubDocuments from "./pages/Club/Club/ClubDocuments";
import { Demo } from "./pages/WebChat/Demo";
import EventTypes from "./pages/Actions/EventTypes/EventTypes";
import AnnualReportCreate from "./pages/AnnualReport/AnnualReportCreate/AnnualReportCreate";
import AnnualReportTable from "./pages/AnnualReport/AnnualReportTable/AnnualReportTable";
import AnnualReportEdit from "./pages/AnnualReport/AnnualReportEdit/AnnualReportEdit";
import NotFound from "./pages/Error/NotFound";
import UsersTable from "./pages/UserTable/UserTable";
import UserDistinctions from "./pages/Distinction/DistinctionTable/DistinctionTable";
import KadrasTable from "./pages/KadraVykhovnykiv/KadrasPage";
import Regions from "./pages/Regions/ActionRegion";
import ActionRegion from "./pages/Regions/Region";
import RegionEdit from "./pages/Regions/RegionEdit";
import AddNewRegionFormPage from "./pages/Regions/AddRegion";
import RegionAdministration from "./pages/Regions/RegionAdministration";
import RegionDocuments from "./pages/Regions/RegionDocuments";
import RegionMembers from "./../src/pages/Regions/RegionMembers";
import RegionFollowers from "./../src/pages/Regions/RegionFollowers";
import StatisticsCities from "./pages/Statistics/StatisticsCities";
import StatisticsRegions from "./pages/Statistics/StatisticsRegions";
import NotAuthorizedPage from "./pages/Error/NotAuthorized";
import { ClubAnnualReportCreate } from "./pages/AnnualReport/ClubAnnualReportCreate/ClubAnnualReportCreate";
import ClubAnnualReportEdit from "./pages/AnnualReport/ClubAnnualReportEdit/ClubAnnualReportEdit";
import DocumentsTable from "./pages/Documents/DocumentsTable";
import PrecautionTable from "./pages/Precaution/PrecautionTable/PrecautionTable"
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
import UserRenewalTable from "./pages/UserRenewal/UserRenewalTable/UserRenewalTable";
import TermsOfUse from "./pages/Terms/TermsOfUse";
import TermsEdit from "./pages/Terms/TermsEdit";

const App: FC = () => (
  <div className="App">
    <Router>
      <HeaderContainer />
      <div className="mainContent">
        <Switch>
          <RouteWithLayout exact path="/" component={Home} layout={PrivateLayout} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetPassword" component={ResetPassword} />
          <Route path="/changePassword" component={ChangePassword} />
          <Route path="/userRenewal" component={UserRenewal} />
          <Route path="/chat" component={Demo} />
          <RouteWithLayout
            layout={PrivateLayout}
            path="/userpage/:specify/:userId"
            component={UserProfile}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            path="/decisions"
            component={DecisionTable}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/cities/page/:p"
            component={ActionCities}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/members/:id"
            component={RegionMembers}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/followers/:id"
            component={RegionFollowers}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/cities/new"
            component={CreateCity}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/cities/edit/:id"
            component={CreateCity}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/follower/new"
            component={CreateCity}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/follower/edit/:id"
            component={CreateCity}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/cities/members/:id"
            component={CityMembers}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/cities/administration/:id"
            component={CityAdministration}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/region/administration/:id"
            component={RegionAdministration}
          />

          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/documents/:id"
            component={RegionDocuments}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/cities/documents/:id"
            component={CityDocuments}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/cities/followers/:id"
            component={CityFollowers}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/cities/:id"
            component={City}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/events/types"
            component={EventTypes}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/new"
            component={AddNewRegionFormPage}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/edit/:regionid"
            component={RegionEdit}
          />

          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/events/:typeId/categories"
            component={Actions}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/types/:typeId/categories/:categoryId/events"
            component={ActionEvent}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/events/details/:id"
            component={EventInfo}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            path="/userpage/eventUsers/:userId"
            component={EventUser}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/create/:cityId"
            component={AnnualReportCreate}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/createClubAnnualReport/:clubId"
            component={ClubAnnualReportCreate}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/region/create/:regionId/:year"
            component={RegionAnnualReportCreate}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/region/edit/:annualreportId/:year"
            component={RegionAnnualReportEdit}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/region/:annualreportId/:year"
            component={RegionAnnualReportInformation}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/edit/:id"
            component={AnnualReportEdit}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/cityAnnualReport/:id"
            component={AnnualReportInformation}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/clubAnnualReport/:id"
            component={ClubAnnualReportInformation}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/club/editClubAnnualReport/:id"
            component={ClubAnnualReportEdit}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/table/:noTitleKey"
            component={AnnualReportTable}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs/page/:p"
            component={ActionClubs}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs/new"
            component={CreateClub}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs/:id"
            component={Club}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs/edit/:id"
            component={CreateClub}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/page/:p"
            component={Regions}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regionsBoard"
            component={RegionBoard}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regionsBoard/new"
            component={CreateGoverningBody}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regionsBoard/edit"
            component={RegionBoardEdit}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regionsBoard/governingBodies"
            component={RegionBoardAdministration}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies"
            component={RegionBoardAdministration}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regionsBoard/documents/:id"
            component={RegionBoardDocuments}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/documents/:id"
            component={GoverningBodyDocuments}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/administration/:id"
            component={GoverningBodyAdministration}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/edit/:id"
            component={CreateGoverningBody}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/:id"
            component={GoverningBody}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/:governingBodyId/sectors"
            component={GoverningBodySectors}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/:governingBodyId/sectors/new"
            component={CreateGoverningBodySector}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/announcements"
            component={Announcements}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/:governingBodyId/sectors/:sectorId"
            component={GoverningBodySector}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/:governingBodyId/sectors/edit/:sectorId"
            component={EditGoverningBodySector}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/:governingBodyId/sectors/:sectorId/documents"
            component={GoverningBodySectorDocuments}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/governingBodies/:governingBodyId/sectors/:sectorId/administration"
            component={GoverningBodySectorAdministration}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs/members/:id"
            component={ClubMembers}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs/followers/:id"
            component={ClubFollowers}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs/administration/:id"
            component={ClubAdministration}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs/documents/:id"
            component={ClubDocuments}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            path="/aboutBase"
            component={AboutBase}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/terms"
            component={TermsOfUse}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/terms/edit"
            component={TermsEdit}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/create/:cityId"
            component={AnnualReportCreate}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/user/table"
            component={UsersTable}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/kadra"
            component={KadrasTable}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/regions/:id"
            component={ActionRegion}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/distinctions"
            component={UserDistinctions}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/legislation"
            component={DocumentsTable}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/precautions"
            component={PrecautionTable}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/renewals"
            component={UserRenewalTable}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/statistics/cities"
            component={StatisticsCities}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/statistics/regions"
            component={StatisticsRegions}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/notAuthorized"
            component={NotAuthorizedPage}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="*"
            component={NotFound}
          />

        </Switch>
      </div>
      <FooterContainer />
    </Router>
  </div>
);
export default App;
