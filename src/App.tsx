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
import Cities from "./pages/City/Cities/Cities";
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
import EventCalendar from "./pages/Actions/ActionEvent/EventCalendar/EventCalendar";
import Actions from "./pages/Actions/Actions";
import ActionEvent from "./pages/Actions/ActionEvent/ActionEvent";
import UserProfile from "./pages/userPage/personalData/PersonalData";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Clubs from "./pages/Club/Clubs/Clubs";
import Club from "./pages/Club/Club/Club";
import CreateClub from "./pages/Club/CreateClub/CreateClub";
import { Demo } from "../src/pages/WebChat/Demo";
import EventTypes from "./pages/Actions/EventTypes/EventTypes";
import AnnualReportCreate from "./pages/AnnualReport/AnnualReportCreate/AnnualReportCreate";
import AnnualReportTable from './pages/AnnualReport/AnnualReportTable/AnnualReportTable';
import AnnualReportEdit from "./pages/AnnualReport/AnnualReportEdit/AnnualReportEdit";
import NotFound from "./pages/Error/NotFound";
import UsersTable from "./pages/UserTable/UserTable";
import UserDistinctions from "./pages/Distinction/DistinctionTable/DistinctionTable";
import KadrasTable from "./pages/KadraVykhovnykiv/KadrasPage";

const App: FC = () => (
  <div className="App">
    <Router>
      <HeaderContainer />
      <div className="mainContent">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/signup" component={SignUp} />
          <Route path="/signin" component={SignIn} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetPassword" component={ResetPassword} />
          <Route path="/changePassword" component={ChangePassword} />
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
            path="/cities"
            component={Cities}
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
            path="/events/:id/details"
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
            path="/actions/eventCalendar"
            component={EventCalendar}
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
            path="/annualreport/edit/:id"
            component={AnnualReportEdit}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/table"
            component={AnnualReportTable}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/clubs"
            component={Clubs}
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
            path="/distinctions"
            component={UserDistinctions}
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
