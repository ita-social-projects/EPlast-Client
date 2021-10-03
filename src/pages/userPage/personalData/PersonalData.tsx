import React, { useEffect, useState } from "react";
import Menu from "../Menu/Menu";
import "./PersonalData.less";
import UserFields from "./UserFields";
import EditUserPage from "../EditUserPage/EditUserPage";
import Approvers from "../Approvers/Approvers";
import ActiveMembership from "../ActiveMembership/ActiveMembership";
import EventUser from "../../Actions/ActionEvent/EventUser/EventUser";
import { useParams } from "react-router-dom";
import Secretaries from "../Secretaries/SecretariesPage";
import { Blanks } from "../Blanks/Blanks";
import UserApi from "../../../api/UserApi";
import { Data, IProfileContext } from "../Interface/Interface";
import notificationLogic from '../../../components/Notifications/Notification';

export const UserProfileContext = React.createContext<Partial<IProfileContext>>({});

export default function ({
  match: {
    params: { specify },
  },
}: any) {

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    fetchData();
  }, []);

  const [userProfile, SetUserProfile] = useState<Data>();
  const ChangeUserProfile = (user: Data) => {
    SetUserProfile(user);
  };

  const fetchData = async () => {
    const currentUserId = UserApi.getActiveUserId();
    await UserApi
      .getUserProfileById(currentUserId, userId)
      .then((response) => {
        SetUserProfile(response.data);
      })
      .catch((error) => {
        notificationLogic("error", error.message);
      });
  }

  return (
    <UserProfileContext.Provider value={{userProfile, ChangeUserProfile}}>
      <div className="mainContainer">
        <Menu id={userId} />
        {specify === "main" ? (
          <div className="content">
            <UserFields />
          </div>
        ) : specify === "edit" ? (
          <div className="content">
            <EditUserPage />
          </div>
        ) : specify === "activeMembership" ? (
          <div className="content">
            <ActiveMembership />
          </div>
        ) : specify === "secretaries" ? (
          <div className="content">
            <Secretaries />
          </div>
        ) : specify === "eventuser" ? (
          <div className="content">
            <EventUser />
          </div>
        ) : specify === "blank" ? (
          <div className="content">
            <Blanks />
          </div>
        ) : specify === "approvers" ? (
          <div className="content">
            <Approvers />
          </div>
        ) : (
          <div className="content">
            <UserFields />
          </div>
        )}
      </div>
    </UserProfileContext.Provider>
  );
}
