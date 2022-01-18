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
import { Data, IPersonalDataContext, User } from "../Interface/Interface";
import notificationLogic from '../../../components/Notifications/Notification';
import ScrollToTop from "../../../components/ScrollToTop/ScrollToTop";

const DefaultState: IPersonalDataContext = {
  userProfile: undefined,
  fullUserProfile: undefined,
  activeUserRoles: [],
  activeUserId: "",
  loading: false,
  imageBase64: "",
  activeUserProfile: undefined,
  userProfileAccess: {}
}

export const PersonalDataContext = React.createContext<IPersonalDataContext>(DefaultState);

export default function ({
  match: {
    params: { specify },
  },
}: any) {

  const { userId } = useParams<{ userId: string }>();

  useEffect(() => {
    fetchData();
  }, [userId]);

  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>("");
  const [activeUserProfile, setActiveUserProfile] = useState<User>();
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [fullUserProfile, setFullUserProfile] = useState<Data>();
  const [userProfileAccess, setUserProfileAccess] = useState<{ [key: string]: boolean }>({})

  const [userProfile, SetUserProfile] = useState<Data>();
  const ChangeUserProfile = (user: Data) => {
    SetUserProfile(user);
  };

  const UpdateData = () => {
    fetchData();
  }

  const fetchData = async () => {
    setLoading(false);
    let userRoles = UserApi.getActiveUserRoles();
    setActiveUserRoles(userRoles);
    let currentUserId = UserApi.getActiveUserId();
    let UserProfileAccess = UserApi.getUserProfileAccess(currentUserId, userId);
    setUserProfileAccess((await UserProfileAccess).data);
    setActiveUserId(currentUserId);
    let userProfile = await UserApi.getActiveUserProfile();
    setActiveUserProfile(userProfile);
    await UserApi.getById(userId).then(async (response) => {
      setFullUserProfile(response.data);
    }).catch((error) => {
      notificationLogic("error", error.message);
    });

    await UserApi
      .getUserProfileById(currentUserId, userId)
      .then((response) => {
        SetUserProfile(response.data);
        if (response.data?.user !== null) {
          UserApi.getImage(response.data?.user.imagePath).then((response: { data: any }) => {
            setImageBase64(response.data);
          });
        }
        if (response.data?.shortUser !== null) {
          UserApi.getImage(response.data?.shortUser.imagePath).then((response: { data: any }) => {
            setImageBase64(response.data);
          });
        }
      })
      .catch((error) => {
        notificationLogic("error", error.message);
      });
    setLoading(true);
  }

  return (
    <PersonalDataContext.Provider value={{
      userProfile,
      fullUserProfile,
      activeUserRoles,
      activeUserId,
      activeUserProfile,
      userProfileAccess,
      loading,
      imageBase64,
      ChangeUserProfile,
      UpdateData
    }}>
      <ScrollToTop />
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
    </PersonalDataContext.Provider>
  );
}
