import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserApi from "../../../api/UserApi";
import notificationLogic from "../../../components/Notifications/Notification";
import ScrollToTop from "../../../components/ScrollToTop/ScrollToTop";
import EventUser from "../../Actions/ActionEvent/EventUser/EventUser";
import Spinner from "../../Spinner/Spinner";
import ActiveMembership from "../ActiveMembership/ActiveMembership";
import Approvers from "../Approvers/Approvers";
import { Blanks } from "../Blanks/Blanks";
import EditUserPage from "../EditUserPage/EditUserPage";
import { Data, IPersonalDataContext, User } from "../Interface/Interface";
import Menu from "../Menu/Menu";
import Secretaries from "../Secretaries/SecretariesPage";
import Course from "./Course";
import "./PersonalData.less";
import UserFields from "./UserFields";

const DefaultState: IPersonalDataContext = {
  userProfile: undefined,
  fullUserProfile: undefined,
  activeUserRoles: [],
  activeUserId: "",
  loading: true,
  imageBase64: "",
  activeUserProfile: undefined,
  userProfileAccess: {},
};

export const PersonalDataContext = React.createContext<IPersonalDataContext>(
  DefaultState
);

export default function ({
  match: {
    params: { specify },
  },
}: any) {
  const { userId } = useParams<{ userId: string }>();

  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [activeUserId, setActiveUserId] = useState<string>("");
  const [activeUserProfile, setActiveUserProfile] = useState<User>();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [fullUserProfile, setFullUserProfile] = useState<Data>();
  const [userProfileAccess, setUserProfileAccess] = useState<{
    [key: string]: boolean;
  }>({});

  const [userProfile, SetUserProfile] = useState<Data>();
  const ChangeUserProfile = (user: Data) => {
    SetUserProfile(user);
  };

  const UpdateData = () => {
    fetchData();
  };

  const fetchData = async () => {
    setDataLoaded(false);

    let userRoles = UserApi.getActiveUserRoles();
    setActiveUserRoles(userRoles);

    let currentUserId = UserApi.getActiveUserId();
    let UserProfileAccess = UserApi.getUserProfileAccess(currentUserId, userId);
    setUserProfileAccess((await UserProfileAccess).data);
    setActiveUserId(currentUserId);

    let userProfile = await UserApi.getActiveUserProfile();
    setActiveUserProfile(userProfile);

    try {
      let user = await UserApi.getById(userId);
      setFullUserProfile(user.data);
    } catch (e) {
      notificationLogic("error", e.message);
    }

    try {
      let focusUserProfile = await UserApi.getUserProfileById(userId);
      SetUserProfile(focusUserProfile.data);
      if (focusUserProfile.data?.user !== null) {
        let userImage = await UserApi.getImage(
          focusUserProfile.data?.user.imagePath
        );
        setImageBase64(userImage.data);
      }
      if (focusUserProfile.data?.shortUser !== null) {
        let userImage = await UserApi.getImage(
          focusUserProfile.data?.shortUser.imagePath
        );
        setImageBase64(userImage.data);
      }
    } catch (e) {
      notificationLogic("error", e.message);
    }

    setDataLoaded(true);
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return (
    <PersonalDataContext.Provider
      value={{
        userProfile,
        fullUserProfile,
        activeUserRoles,
        activeUserId,
        activeUserProfile,
        userProfileAccess,
        loading: dataLoaded,
        imageBase64,
        ChangeUserProfile,
        UpdateData,
      }}
    >
      <ScrollToTop />
      {!dataLoaded ? (
        <Spinner />
      ) : (
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
          ) : specify === "course" ? (
            <div className="content">
              <Course />
            </div>
          ) : (
            <div className="content">
              <UserFields />
            </div>
          )}
        </div>
      )}
    </PersonalDataContext.Provider>
  );
}
