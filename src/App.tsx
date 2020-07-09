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
import Cities from "./pages/Cities/Cities";
import City from "./pages/City/City";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import EventInfo from "./pages/Actions/ActionEvent/EventInfo/EventInfo";
import EventCreate from "./pages/Actions/ActionEvent/EventCreate/EventCreate";
import Notifications from "./pages/Notifications/Notifications";
import Actions from "./pages/Actions/Actions";
import ActionEvent from "./pages/Actions/ActionEvent/ActionEvent";
//import UserProfile from "./pages/userPage/personalData/PersonalData";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";

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
          <Route path="/notification" component={Notifications} />
          <Route path="/forgotpassword" component={ForgotPassword}/>
          <Route path="/resetPassword" component={ResetPassword}/>

          { /*<RouteWithLayout
            layout={PrivateLayout}
            path="/userpage/:specify"
            component={UserProfile}
          /> */}
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
            path="/cities/:id"
            component={City}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/actions"
            component={Actions}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/actions/events/:id"
            component={ActionEvent}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/actions/eventinfo/:id"
            component={EventInfo}
          />
          <RouteWithLayout
            layout={PrivateLayout}
            exact
            path="/actions/eventCreate"
            component={EventCreate}
          />
        </Switch>
      </div>
      <FooterContainer />
    </Router>
  </div>
);

export default App;
