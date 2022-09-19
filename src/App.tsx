import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.less";
import HeaderContainer from "./components/Header/HeaderContainer";
import Home from "./pages/Home/Home";
import FooterContainer from "./components/Footer/FooterContainer";
import PrivateLayout from "./components/PrivateLayout/PrivateLayout";
import RouteWithLayout from "./RouteWithLayout";
import Contacts from "./pages/Contacts/Contacts";
import SignUp from "./pages/SignUp/SignUp";
import SignIn from "./pages/SignIn/SignIn";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import UserRenewal from "./pages/UserRenewal/UserRenewal";
import { Demo } from "./pages/WebChat/Demo";
import NotFound from "./pages/Error/NotFound";
import NotAuthorizedPage from "./pages/Error/NotAuthorized";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import routes from "./Routes";

const App: FC = () => (
  <div className="App">
    <Router>
      <ScrollToTop />
      <HeaderContainer />
      <div className="mainContent">
        <Switch>
          <RouteWithLayout
            exact
            path="/"
            component={Home}
            layout={PrivateLayout}
          />
          <Route path="/contacts" component={Contacts} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/resetPassword" component={ResetPassword} />
          <Route path="/changePassword" component={ChangePassword} />
          <Route path="/userRenewal" component={UserRenewal} />
          <Route path="/chat" component={Demo} />

          {routes.map(({ path, Component }) => (
            <RouteWithLayout
              layout={PrivateLayout}
              exact
              path={path}
              component={Component}
            />
          ))}

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
