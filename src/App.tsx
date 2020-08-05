import React, { FC } from "react";
<<<<<<< HEAD
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
=======
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
>>>>>>> origin
import DecisionTable from "./pages/DecisionTable/DecisionTable";
import "./App.less";
import HeaderContainer from "./components/Header/HeaderContainer";
import Home from "./pages/Home/Home";
import FooterContainer from "./components/Footer/FooterContainer";
import PrivateLayout from "./components/PrivateLayout/PrivateLayout";
import RouteWithLayout from "./RouteWithLayout";
import Contacts from "./pages/Contacts/Contacts";
import Cities from "./pages/Cities/Cities";
import City from "./pages/City/City";
import CityMembers from "./pages/City/CityMembers";
import CityAdministration from "./pages/City/CityAdministration";
import CityDocuments from "./pages/City/CityDocuments";
import CityFollowers from "./pages/City/CityFollowers";
import CreateCity from "./pages/CreateCity/CreateCity";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import EventInfo from "./pages/Actions/ActionEvent/EventInfo/EventInfo";
import EventCreate from "./pages/Actions/ActionEvent/EventCreate/EventCreate";
import EventEdit from "./pages/Actions/ActionEvent/EventEdit/EventEdit";
import EventUser from "./pages/Actions/ActionEvent/EventUser/EventUser";
import EventCalendar from "./pages/Actions/ActionEvent/EventCalendar/EventCalendar";
import Actions from "./pages/Actions/Actions";
import ActionEvent from "./pages/Actions/ActionEvent/ActionEvent";
import UserProfile from "./pages/userPage/personalData/PersonalData";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Clubs from "./pages/Clubs/Clubs";
import Club from "./pages/Club/Club";
import CreateClub from "./pages/CreateClub/CreateClub";
import { Demo } from "../src/pages/WebChat/Demo";
import EventTypes from "./pages/Actions/EventTypes/EventTypes";
import AnnualReportCreate from "./pages/AnnualReport/AnnualReportCreate/AnnualReportCreate";
<<<<<<< HEAD
import NotFound from "./pages/Errors/NotFound";
=======
import UserFields from "./pages/userPage/personalData/UserFields";
import AnnualReportTable from './pages/AnnualReport/AnnualReportTable/AnnualReportTable';
import AnnualReportEdit from "./pages/AnnualReport/AnnualReportEdit/AnnualReportEdit";
>>>>>>> origin

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
<<<<<<< HEAD
            path="/userpage/:specify"
=======
            path="/userpage/:specify/:userId"
>>>>>>> origin
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
            exact
            path="/actions/eventCreate"
            component={EventCreate}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/actions/eventEdit/:id"
            component={EventEdit}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/actions/eventUser"
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
<<<<<<< HEAD
=======
            path="/annualreport/create"
            component={AnnualReportCreate}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
>>>>>>> origin
            path="/annualreport/create/:cityId"
            component={AnnualReportCreate}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
<<<<<<< HEAD
=======
            path="/annualreport/edit/:id"
            component={AnnualReportEdit}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/annualreport/edit/:cityId"
            component={AnnualReportCreate}
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
>>>>>>> origin
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
<<<<<<< HEAD
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="*"
            component={NotFound}
          />
=======
>>>>>>> origin
        </Switch>
      </div>
      <FooterContainer />
    </Router>
  </div>
);
export default App;
