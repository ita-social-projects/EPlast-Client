import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Card, Avatar, Tooltip, Spin, Skeleton } from "antd";
import "./Approvers.less";
import AddUser from "../../../assets/images/user_add.png";
import { ApproversData, ApproveType } from "../Interface/Interface";
import jwt from "jwt-decode";
import AuthLocalStorage from "../../../AuthLocalStorage";
import userApi from "../../../api/UserApi";
import { Link } from "react-router-dom";
import moment from "moment";
import { useHistory } from "react-router-dom";
import notificationLogic from "../../../components/Notifications/Notification";
import {
  fileIsNotUpload,
  successfulDeleteAction,
  failDeleteAction,
  successfulCreateAction,
} from "../../../components/Notifications/Messages";
import { StickyContainer } from "react-sticky";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import DeleteApproveButton from "./DeleteApproveButton";
import { Roles } from "../../../models/Roles/Roles";
import AvatarAndProgressStatic from "../personalData/AvatarAndProgressStatic";
import { PersonalDataContext } from "../personalData/PersonalData";
import ApproversCard from "./ApproversCard";

const Assignments = () => {
  const history = useHistory();
  const { userId } = useParams();
  const [loadingApprovers, setLoadingApprovers] = useState<boolean>(false);
  const [approveAsMemberLoading, setApproveAsMemberLoading] = useState(false);
  const [approveAsHovelHeadLoading, setApproveAsHovelHeadLoading] = useState(
    false
  );
  const [approveAsCityHeadLoading, setApproveAsCityHeadLoading] = useState(
    false
  );
  const [data, setData] = useState<ApproversData>();
  const [approverName, setApproverName] = useState<string>();
  const [userGender, setuserGender] = useState<string>();
  const {
    userProfile,
    activeUserRoles,
    loading,
    userProfileAccess,
  } = useContext(PersonalDataContext);
  const userGenders = ["Чоловік", "Жінка", "Не маю бажання вказувати"];

  const fetchData = async () => {
    setLoadingApprovers(false);
    const token = AuthLocalStorage.getToken() as string;
    const user: any = jwt(token);
    await userApi
      .getApprovers(userId, user.nameid)
      .then((response) => {
        setData(response.data);
        setLoadingApprovers(true);
      })
      .catch(() => {
        notificationLogic("error", fileIsNotUpload("даних"));
      });
    fetchApproverName(user.nameid);
  };

  const AccessToManage = (roles: string[]): boolean => {
    for (var i = 0; i < roles.length; i++) {
      if (Roles.PlastMember.includes(roles[i])) return true;
    }
    return false;
  };

  const fetchApproverName = async (id: string) => {
    await userApi.getById(id).then((response) => {
      setApproverName(
        response.data.user.firstName + " " + response.data.user.lastName
      );
    });
    await userApi.getById(userId).then((response) => {
      setuserGender(response.data.user.gender.name);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const setGreeting = () => {
    let greeting = "Друже/подруго";
    if (userGender === userGenders[0]) {
      greeting = "Друже";
    }
    if (userGender === userGenders[1]) {
      greeting = "Подруго";
    }
    return greeting;
  };

  const deleteApprove = async (id: number) => {
    await userApi
      .deleteApprove(id)
      .then(() => {
        notificationLogic("success", successfulDeleteAction("Поручення"));
      })
      .catch(() => {
        notificationLogic("error", failDeleteAction("поручення"));
      });
    await NotificationBoxApi.createNotifications(
      [userId],
      `${setGreeting()}, повідомляємо, що користувач 
        ${approverName} скасував своє поручення за тебе.`,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/userpage/main/${data?.currentUserId}`,
      "Переглянути користувача"
    );
    fetchData();
  };

  const approveClick = async (
    userId: string,
    approveType: ApproveType
  ) => {
    approveType === ApproveType.City
      ? setApproveAsCityHeadLoading(true)
      : approveType === ApproveType.Club
        ? setApproveAsHovelHeadLoading(true)
        : setApproveAsMemberLoading(true);
    await userApi
      .approveUser(userId, approveType)
      .then(() => {
        notificationLogic("success", successfulCreateAction("Поручення"));
      })
      .catch(() => {
        notificationLogic("error", "Не вдалося поручитися");
      });
    await NotificationBoxApi.createNotifications(
      [userId],
      `${setGreeting()}, повідомляємо, що користувач 
        ${approverName} поручився за тебе.
        Будь тією зміною, яку хочеш бачити у світі!`,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/userpage/main/${data?.currentUserId}`,
      "Переглянути користувача"
    );
    await fetchData();
    approveType === ApproveType.City
      ? setApproveAsCityHeadLoading(false)
      : approveType === ApproveType.Club
        ? setApproveAsHovelHeadLoading(false)
        : setApproveAsMemberLoading(false);
  };

  const { Meta } = Card;
  return (loading && loadingApprovers) === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : (
    <div className="displayFlex">
      <div className="avatarWrapperApprovers">
        <StickyContainer className="kadraWrapper">
          <AvatarAndProgressStatic
            time={data?.timeToJoinPlast}
            firstName={data?.user.firstName}
            lastName={data?.user.lastName}
            isUserPlastun={data?.isUserPlastun}
            pseudo={data?.user.pseudo}
            governingBody={data?.user.governingBody}
            region={data?.user.region}
            city={data?.user.city}
            club={data?.user.club}
            cityId={data?.user.cityId}
            clubId={data?.user.clubId}
            regionId={data?.user.regionId}
            governingBodyId={data?.user.governingBodyId}
            cityMemberIsApproved={data?.user.cityMemberIsApproved}
            clubMemberIsApproved={data?.user.clubMemberIsApproved}
            showPrecautions={userProfile?.shortUser === null}
          />
        </StickyContainer>
      </div>
      <div className="approversContentApprovers">

        <ApproversCard
          title="Поручення дійсних членів"
          data={data!}
          confirmedUsers={data?.confirmedUsers || []}
          activeUserRoles={activeUserRoles}
          approveType={ApproveType.PlastMember}
          onDeleteApprove={deleteApprove}
          approveAsMemberLoading={approveAsMemberLoading}
          onApproveClick={approveClick}
          canApprove={
            userProfile!.isUserPlastun === false &&
            data!.canApprovePlastMember &&
            userProfileAccess["CanApproveUser"]}
          canDelete={activeUserRoles.includes(Roles.Admin)
            || activeUserRoles.includes(Roles.GoverningBodyAdmin)}
        />

        <ApproversCard
          title="Поручення куреня УСП/УПС"
          data={data!}
          confirmedUsers={!data?.clubApprover ? [] : [data.clubApprover]}
          activeUserRoles={activeUserRoles}
          approveType={ApproveType.Club}
          onDeleteApprove={deleteApprove}
          approveAsMemberLoading={approveAsMemberLoading}
          onApproveClick={approveClick}
          canApprove={
            userProfile!.isUserPlastun === false &&
            data?.clubApprover == null &&
            userProfileAccess["CanApproveAsClubHead"]}
          canDelete={
            data?.clubApprover?.approver?.userID == data?.currentUserId ||
            activeUserRoles.includes(Roles.Admin) ||
            activeUserRoles.includes(Roles.GoverningBodyAdmin)}
        />

        <ApproversCard
          title="Поручення Голови осередку/Осередкового УСП/УПС"
          data={data!}
          confirmedUsers={!data?.cityApprover ? [] : [data.cityApprover]}
          activeUserRoles={activeUserRoles}
          approveType={ApproveType.City}
          onDeleteApprove={deleteApprove}
          approveAsMemberLoading={approveAsMemberLoading}
          onApproveClick={approveClick}
          canApprove={
            userProfile!.isUserPlastun === false &&
            data?.cityApprover == null &&
            userProfileAccess["CanApproveAsCityHead"]}
          canDelete={userProfile?.isUserPlastun ||
            data?.cityApprover?.approver?.userID == data?.currentUserId ||
            activeUserRoles.includes(Roles.Admin) ||
            activeUserRoles.includes(Roles.GoverningBodyAdmin)}
        />
      </div>
    </div>
  );
};
export default Assignments;
