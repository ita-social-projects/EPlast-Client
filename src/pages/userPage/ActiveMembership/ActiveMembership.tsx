import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classes from "./ActiveMembership.module.css";
import {Typography, List, Button, Tooltip, Tag, Empty, Skeleton} from "antd";
import "../personalData/PersonalData.less";
import activeMembershipApi, {
  UserPlastDegree,
} from "../../../api/activeMembershipApi";
import userApi from "../../../api/UserApi";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import ModalAddPlastDegree from "./PlastDegree/ModalAddPlastDegree";
import moment from "moment";
import ModalChangeUserDates from "./UserDates/ModalChangeUserDates";
import DeleteDegreeConfirm from "./PlastDegree/DeleteDegreeConfirm";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import AvatarAndProgressStatic from "../personalData/AvatarAndProgressStatic";
import notificationLogic from "../../../components/Notifications/Notification";
import jwt_decode from "jwt-decode";
import { Roles } from "../../../models/Roles/Roles";
import { Data } from '../Interface/Interface';
import { successfulAddDegree, successfulDeleteDegree } from "../../../components/Notifications/Messages";
const { Title } = Typography;

const ActiveMembership = () => {
  const { userId } = useParams();
  const [accessLevels, setAccessLevels] = useState([]);
  const [dates, setDates] = useState<any>({});
  const [data, setUserData] = useState<Data>();
  const [currentUser, setCurrentUser] = useState<any>({});
  const [LoadInfo, setLoadInfo] = useState<boolean>(false);
  const [plastDegrees, setPlastDegrees] = useState<Array<UserPlastDegree>>([]);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [datesVisibleModal, setDatesVisibleModal] = useState<boolean>(false);
  const [roles, setRoles]=useState<Array<string>>([]);
  const [userToken, setUserToken] = useState<any>([{ nameid: "" }]);

  const userAdminTypeRoles = [
    Roles.Admin,
    Roles.OkrugaHead,
    Roles.OkrugaHeadDeputy,
    Roles.CityHead,
    Roles.CityHeadDeputy,
    Roles.KurinHead,
    Roles.KurinHeadDeputy,
    Roles.RegionBoardHead
  ];
  const userGenders = ["Чоловік", "Жінка", "Не маю бажання вказувати"];

  const handleAddDegree = async () => {
    await activeMembershipApi.getUserPlastDegrees(userId).then((response) => {
      setPlastDegrees(response);
    });
    notificationLogic("success", successfulAddDegree());
  };
  const getAppropriateToGenderDegree = (plastDegreeName: string): string => {
    if (userGenders[0] === data?.user.gender?.name && plastDegreeName.includes("/")) {
      return plastDegreeName.split("/")[0];
    } else if (userGenders[1] === data?.user.gender?.name && plastDegreeName.includes("/")) {
      return plastDegreeName.split("/")[1];
    } else return plastDegreeName;
  };


  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    setUserToken(jwt(token));
    const currentUserId=(jwt(token) as { nameid: "" }).nameid;
    let decodedJwt = jwt_decode(token) as any;
    setRoles([].concat(decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']));

    await userApi.getById(currentUserId).then(async (response) => {
      setCurrentUser(response.data.user);
    }).catch((error) => {
      notificationLogic("error", error.message);
    });

    await userApi.getById(userId).then(async (response) => {
      setUserData(response.data);
    }).catch((error) => {
      notificationLogic("error", error.message);
    });

    setAccessLevels(await activeMembershipApi.getAccessLevelById(userId));

    await activeMembershipApi.getUserDates(userId).then((response) => {
      response.dateEntry =
        response.dateEntry === "0001-01-01T00:00:00" ? "" : response.dateEntry;
      response.dateOath =
        response.dateOath === "0001-01-01T00:00:00" ? "" : response.dateOath;
      response.dateEnd =
        response.dateEnd === "0001-01-01T00:00:00" ? "" : response.dateEnd;
      setDates(response);
      setLoadInfo(true);
    });

    await activeMembershipApi.getUserPlastDegrees(userId).then((response) => {
      setPlastDegrees(response);
    });
  };


  const IsUserHasAccessToManageDegree = (userRoles: Array<string>): boolean => {
    return (userRoles?.includes(Roles.KurinHead) && currentUser.clubId == data?.user.clubId) ||
           (userRoles?.includes(Roles.KurinHeadDeputy) && currentUser.clubId == data?.user.clubId) ||
           (userRoles?.includes(Roles.CityHead) && currentUser.cityId == data?.user.cityId) ||
           (userRoles?.includes(Roles.CityHeadDeputy) && currentUser.cityId == data?.user.cityId) ||
           (userRoles?.includes(Roles.OkrugaHead) && currentUser.regionId == data?.user.regionId) ||
           (userRoles?.includes(Roles.OkrugaHeadDeputy) && currentUser.regionId == data?.user.regionId) ||
           userRoles?.includes(Roles.RegionBoardHead) ||
           userRoles?.includes(Roles.Admin);
  };

  const IsUserHasAnyAdminTypeRoles = (userRoles: Array<string>): boolean => {
    let IsUserHasAnyAdminRole = false;
    if (userRoles === null || userRoles === undefined)
      return IsUserHasAnyAdminRole;
    userAdminTypeRoles.forEach((role: string) => {
      if (userRoles.includes(role)) {
        IsUserHasAnyAdminRole = true;
      }
    });
    return IsUserHasAnyAdminRole;
  };

  const handleDelete = async (plastDegreeId: number) => {
    const currentPlastDegree = plastDegrees.find(
      (p) => p.plastDegree.id === plastDegreeId
    );
    if (currentPlastDegree) {
      await NotificationBoxApi.createNotifications(
        [userId],
        `На жаль вас було позбавлено ступеня: ${getAppropriateToGenderDegree(
          currentPlastDegree.plastDegree.name
        )} в `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/userpage/activeMembership/${userId}`,
        `Дійсному членстві`
      );
    }
    await fetchData();
    notificationLogic("error", successfulDeleteDegree());
  };

  const setTagColor = (userRoles: string) => {
    let color = "";
    if (userRoles.includes("Доступ члена проводу організації")) {
      color = "red";
    }
    if (userRoles.includes("Доступ члена організації")) {
      color = "green";
    }
    if (userRoles.includes("Доступ прихильника організації")) {
      color = "orange";
    }
    if (userRoles.includes("Колишній член")) {
      color = "black";
    }
    return color;
  };

  const handleChangeDates = async () => {
    await fetchData();
  };

  const AppropriateButtonText=():string=>{
    const amount= plastDegrees.length;
    if(amount === 1) return "Змінити ступінь"
    else if(amount === 0) return "Додати ступінь"
    return "Додати ступінь"
  }
  
  useEffect(() => {
    fetchData();
  }, []);
  return LoadInfo === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : (
    <div className={classes.wrapper}>
      <div className={classes.avatarWrapper}>
        <AvatarAndProgressStatic
          time={data?.timeToJoinPlast}
          imageUrl={data?.user.imagePath as string}
          firstName={data?.user.firstName}
          lastName={data?.user.lastName}
          isUserPlastun={true}
          pseudo={data?.user.pseudo}
          governingBody={data?.user.governingBody}
          region={data?.user.region}
          city={data?.user.city}
          club={data?.user.club}
          governingBodyId={data?.user.governingBodyId}
          regionId={data?.user.regionId}
          cityId={data?.user.cityId}
          clubId={data?.user.clubId}
        />
      </div>

      <div className={classes.wrapperCol}>
        <div className={classes.wrapper}>
          <div className={classes.wrapperGeneralInfo}>
            <Title level={2}> Загальна інформація </Title>
            <div className={classes.textBlock}>
              {LoadInfo ? (
                <>
                  <ul className={classes.textList}>
                    <li className={classes.textListItem} key={1}>
                      <div>
                        <span className={classes.date}>Дата вступу: </span>
                        {dates?.dateEntry === ""
                          ? "Не задано"
                          : moment(dates.dateEntry).format("DD.MM.YYYY")}
                      </div>
                    </li>
                    <li className={classes.textListItem} key={2}>
                      <div>
                        <span className={classes.date}>Дата присяги: </span>
                        {dates?.dateOath === ""
                          ? "Без присяги"
                          : moment(dates.dateOath).format("DD.MM.YYYY")}
                      </div>
                    </li>
                    <li className={classes.textListItem} key={3}>
                      <div>
                        <span className={classes.date}>Дата завершення: </span>
                        {dates?.dateEnd === ""
                          ? "Ще в Пласті"
                          : moment(dates.dateEnd).format("DD.MM.YYYY")}
                      </div>
                    </li>
                  </ul>

                  {IsUserHasAccessToManageDegree(roles) && (
                    <Button
                      type="primary"
                      className={classes.buttonChange}
                      onClick={() => {
                        setDatesVisibleModal(true);
                      }}
                    >
                      Змінити
                    </Button>
                  )}
                </>
              ) : (
                <div></div>
              )}
            </div>

            <div className={""}>
              <Title level={4}> Рівні доступу </Title>
              <div className={classes.textBlock}>
                <List
                  style={{ overflow: "hidden" }}
                  dataSource={accessLevels}
                  renderItem={(item, index) => (
                    <List.Item
                      className={classes.textListItem}
                      style={{ padding: "6px 0" }}
                    >
                      <Tag color={setTagColor(item)} key={index}>
                        <Tooltip placement="topLeft" title={item}>
                          {item}
                        </Tooltip>
                      </Tag>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
          <div className={classes.wrapper}>
            <div className={classes.wrapperGeneralInfo}>
              <Title level={2}> Ступені користувача </Title>
              {plastDegrees.length===0? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Без ступеня"/> : plastDegrees.map((pd) => (
                <React.Fragment key={pd.id}>
                  <div style={{ marginBottom: "7px" }}>
                    <div className={classes.textFieldsMain}>
                    {<SafetyCertificateOutlined />}{" "}
                      {getAppropriateToGenderDegree(pd.plastDegree.name)}
                    </div>
                    <div className={classes.textFieldsOthers}>
                      Дата початку ступеню:{" "}
                      {moment(pd.dateStart).format("DD.MM.YYYY")}
                    </div>
                    {IsUserHasAccessToManageDegree(roles?.map((role:any) => {
                      if(!(role === Roles.KurinHead || role === Roles.KurinHeadDeputy || 
                        role === Roles.CityHead || role === Roles.CityHeadDeputy))
                        return role
                    })) && (
                      <div className={classes.buttons}>
                        <Button type="primary"
                          className={classes.buttonChange}
                          onClick={() => {
                            DeleteDegreeConfirm(
                              userId,
                              pd.plastDegree.id,
                              handleDelete
                            );
                          }}
                        >
                          Видалити
                        </Button>
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
               {IsUserHasAccessToManageDegree(roles?.map((role:any) => {
                      if(!(role === Roles.KurinHead || role === Roles.KurinHeadDeputy))
                        return role
                    })) && (
                  <div className={classes.buttons}>
                    <Button type="primary"
                      className={classes.buttonChange}
                      onClick={() =>
                        setVisibleModal(true)
                      }
                    >
                      {AppropriateButtonText()}
                    </Button>
                  </div>
               )}
            </div>
          </div>
      </div>
      <ModalAddPlastDegree
        userId={userId}
        isCityAdmin={!IsUserHasAnyAdminTypeRoles(roles?.map((role:any) => {
          if(!(role === Roles.CityHead || role === Roles.CityHeadDeputy)) return role}))}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        handleAddDegree={handleAddDegree}
      />
      <ModalChangeUserDates
        userId={userId}
        dates={dates}
        datesVisibleModal={datesVisibleModal}
        setDatesVisibleModal={setDatesVisibleModal}
        handleChangeDates={handleChangeDates}
      
      />
    </div>
  );
};
export default ActiveMembership;
