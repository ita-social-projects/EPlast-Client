import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Blanks } from "../Blanks/Blanks";
import { Courses } from "./Courses";
import Menu from "../Menu/Menu";
import Spinner from "../../Spinner/Spinner";
import UserFields from "./UserFields";
import EditUserPage from "../EditUserPage/EditUserPage";
import Approvers from "../Approvers/Approvers";
import ActiveMembership from "../ActiveMembership/ActiveMembership";
import EventUser from "../../Actions/ActionEvent/EventUser/EventUser";
import Secretaries from "../Secretaries/SecretariesPage";
import UserApi from "../../../api/UserApi";
import notificationLogic from "../../../components/Notifications/Notification";
import ScrollToTop from "../../../components/ScrollToTop/ScrollToTop";
import { Data, IPersonalDataContext, User } from "../Interface/Interface";
import "./PersonalData.less";

const DefaultState: IPersonalDataContext = {
  userProfile: undefined,
  fullUserProfile: undefined,
  activeUserRoles: [],
  activeUserId: "",
  loading: false,
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
  const [dataLoaded, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [fullUserProfile, setFullUserProfile] = useState<Data>();
  const [userProfileAccess, setUserProfileAccess] = useState<{
    [key: string]: boolean;
  }>({});

  const [userProfile, setUserProfile] = useState<Data>();
  const changeUserProfile = (user: Data) => {
    setUserProfile(user);
  };

  const updateData = () => {
    fetchData();
  };

  const fetchData = async () => {
    let userRoles = UserApi.getActiveUserRoles();
    setActiveUserRoles(userRoles);
    let currentUserId = UserApi.getActiveUserId();
    let userProfileAccess = await UserApi.getUserProfileAccess(currentUserId, userId);
    setUserProfileAccess(userProfileAccess.data);
    setActiveUserId(currentUserId);
    let userProfile = await UserApi.getActiveUserProfile();
    setActiveUserProfile(userProfile);
    await UserApi.getById(userId)
      .then(async (response) => {
        setFullUserProfile(response.data);
      })
      .catch((error) => {
        notificationLogic("error", error.message);
      });

    await UserApi.getUserProfileById(userId)
      .then((response) => {
        setUserProfile(response.data);
        if (response.data?.user !== null) {
          UserApi.getImage(response.data?.user.imagePath).then(
            (response: { data: any }) => {
              setImageBase64(response.data);
            }
          );
        }
        if (response.data?.shortUser !== null) {
          UserApi.getImage(response.data?.shortUser.imagePath).then(
            (response: { data: any }) => {
              setImageBase64(response.data);
            }
          );
        }
      })
      .catch((error) => {
        notificationLogic("error", error.message);
      });
    setLoading(true);
  };

  useEffect(() => {
    if (!dataLoaded) {
      fetchData();
    }
  }, [dataLoaded]);

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
        changeUserProfile,
        updateData,
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
              <Courses />
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
