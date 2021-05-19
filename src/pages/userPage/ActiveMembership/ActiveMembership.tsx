import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classes from "./ActiveMembership.module.css";
import {Typography, List, Button, Tooltip, Tag, Empty} from "antd";
import "../personalData/PersonalData.less";
import activeMembershipApi, {
  UserPlastDegree,
} from "../../../api/activeMembershipApi";
import userApi from "../../../api/UserApi";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import ModalAddPlastDegree from "./PlastDegree/ModalAddPlastDegree";
import moment from "moment";
import ModalAddEndDatePlastDegree from "./PlastDegree/ModalAddEndDatePlastDegree";
import ModalChangeUserDates from "./UserDates/ModalChangeUserDates";
import DeleteDegreeConfirm from "./PlastDegree/DeleteDegreeConfirm";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import AvatarAndProgressStatic from "../personalData/AvatarAndProgressStatic";
import notificationLogic from "../../../components/Notifications/Notification";
import jwt_decode from "jwt-decode";
const { Title } = Typography;

const ActiveMembership = () => {
  const { userId } = useParams();
  const [data, setData] = useState<any>({});
  const [accessLevels, setAccessLevels] = useState([]);
  const [dates, setDates] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<any>({});
  const [LoadInfo, setLoadInfo] = useState<boolean>(false);
  const [plastDegrees, setPlastDegrees] = useState<Array<UserPlastDegree>>([]);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [datesVisibleModal, setDatesVisibleModal] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<any>([{ nameid: "" }]);
  const [roles, setRoles]=useState<Array<string>>([]);
  const [city, setCity]=useState<{id: number, name: string}>();
  const [club, setClub]=useState<{id: number, name: string}>();
  const [endDateVisibleModal, setEndDateVisibleModal] = useState<boolean>(
    false
  );
  const [plastDegreeIdToAddEndDate, setPlastDegreeIdToAddEndDate] = useState<
    number
  >(0);
  const [startDateToAddEndDate, setStartDateToAddEndDate] = useState<string>(
    ""
  );

  const userAdminTypeRoles = [
    "Admin",
    "Голова Куреня",
    "Голова Округи",
    "Голова Станиці",
  ];
  const userGenders = ["Чоловік", "Жінка", "Інша"];

  const handleAddDegree = async () => {
    await activeMembershipApi.getUserPlastDegrees(userId).then((response) => {
      setPlastDegrees(response);
    });
  };
  const getAppropriateToGenderDegree = (plastDegreeName: string): string => {
    if (userGenders[0] === user.gender?.name && plastDegreeName.includes("/")) {
      return plastDegreeName.split("/")[0];
    } else if (userGenders[1] === user.gender?.name && plastDegreeName.includes("/")) {
      return plastDegreeName.split("/")[1];
    } else return plastDegreeName;
  };

  const handleChangeAsCurrent = (plastDegreeIdToSetAsCurrent: number) => {
    const upd: Array<UserPlastDegree> = plastDegrees.map((pd) => {
      if (pd.isCurrent) {
        pd.isCurrent = !pd.isCurrent;
      }
      if (pd.plastDegree.id === plastDegreeIdToSetAsCurrent) {
        pd.isCurrent = !pd.isCurrent;
      }
      return pd;
    });
    setPlastDegrees(upd);
  };

  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    setUserToken(jwt(token));
    const currentUserId=(jwt(token) as { nameid: "" }).nameid;
    let decodedJwt = jwt_decode(token) as any;
    setRoles([].concat(decodedJwt['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']));
    await userApi.getById(userId).then(async (response) => {
      setUser(response.data.user);
    }).catch((error) => {
      notificationLogic("error", error.message);
    });

      await userApi.getById(currentUserId).then(async (response) => {
        setCurrentUser(response.data.user);
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

    await userApi.getImage(user.imagePath).then((response: { data: any }) => {
      setData(response.data);
    });
  };


  const IsUserHasAccessToManageDegree = (userRoles: Array<string>): boolean => {
    return (userRoles?.includes("Голова Куреня") && currentUser.clubId==user.clubId) ||
        (userRoles?.includes("Голова Станиці") && currentUser.cityId==user.cityId) ||
        (userRoles?.includes("Голова Округи") && currentUser.regionId==user.regionId) ||
        userRoles?.includes("Admin");
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

  const handleAddEndDate = async () => {
    await fetchData();
  };

  const handleChangeDates = async () => {
    await fetchData();
  };

  const showModal = () => setVisibleModal(true);

  useEffect(() => {
    fetchData();
  }, [accessLevels]);
  return (
    <div className={classes.wrapper}>
      <div className={classes.avatarWrapper}>
        <AvatarAndProgressStatic
          imageUrl={user.imagePath}
          time={data.timeToJoinPlast}
          firstName={user.firstName}
          lastName={user.lastName}
          isUserPlastun={true}
          pseudo={user.pseudo}
          city={user.city}
          club={user.club}
          cityId={user.cityId}
          clubId={user.clubId}
        />
        {IsUserHasAccessToManageDegree(roles?.filter(role=>role!="Голова Куреня"))
        && (
          <div>
            <Button
              type="primary"
              onClick={showModal}
              className={classes.buttonChange}
            >
              Додати ступінь
            </Button>
          </div>
        )}
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
          <div className={classes.wrapperScrollDegree}>
            <div className={classes.wrapperPlastDegree}>
              <Title level={2}> Ступені користувача </Title>
              {plastDegrees.length===0? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Без ступеня"/> : plastDegrees.map((pd) => (
                <React.Fragment key={pd.id}>
                  <div style={{ marginBottom: "7px" }}>
                    <div className={classes.textFieldsMain}>
                      {pd.isCurrent && <SafetyCertificateOutlined />}{" "}
                      {getAppropriateToGenderDegree(pd.plastDegree.name)}
                    </div>
                    <div className={classes.textFieldsOthers}>
                      Дата початку ступеню:{" "}
                      {moment(pd.dateStart).format("DD.MM.YYYY")}
                    </div>
                    {pd.dateFinish !== null && (
                      <div className={classes.textFieldsOthers}>
                        Дата завершення ступеню:{" "}
                        {moment(pd.dateFinish).format("DD.MM.YYYY")}
                      </div>
                    )}
                    {IsUserHasAccessToManageDegree(roles?.map((role:any)=>{
                      if(!(role==="Голова Куреня" || role==="Голова Станиці"))
                        return role
                    })) && (
                      <div className={classes.buttons}>
                        <button
                          onClick={() => {
                            DeleteDegreeConfirm(
                              userId,
                              pd.plastDegree.id,
                              handleDelete
                            );
                          }}
                          className={classes.button}
                        >
                          Видалити
                        </button>
                        <button
                          onClick={() => {
                            setPlastDegreeIdToAddEndDate(pd.plastDegree.id);
                            setStartDateToAddEndDate(pd.dateStart);
                            setEndDateVisibleModal(true);
                          }}
                          className={classes.button}
                        >
                          Надати дату завершення
                        </button>
                        {!pd.isCurrent && pd.dateFinish === null && (
                          <button
                            onClick={async () => {
                              await activeMembershipApi
                                .setPlastDegreeAsCurrent(
                                  userId,
                                  pd.plastDegree.id
                                )
                                .then(() => {
                                  handleChangeAsCurrent(pd.plastDegree.id);
                                });
                            }}
                            className={classes.button}
                          >
                            Обрати поточним
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ModalAddPlastDegree
        handleAddDegree={handleAddDegree}
        userId={userId}
        isCityAdmin={!IsUserHasAnyAdminTypeRoles(roles?.map((role:any)=>{if(role!="Голова Станиці") return role}))}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
      />
      <ModalAddEndDatePlastDegree
        userId={userId}
        plastDegreeId={plastDegreeIdToAddEndDate}
        dateOfStart={startDateToAddEndDate}
        endDateVisibleModal={endDateVisibleModal}
        setEndDateVisibleModal={setEndDateVisibleModal}
        handleAddEndDate={handleAddEndDate}
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
