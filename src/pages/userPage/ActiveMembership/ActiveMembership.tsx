import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classes from "./ActiveMembership.module.css";
import { Avatar, Typography, List, Button } from "antd";

import "../personalData/PersonalData.less";
import activeMembershipApi, {
  UserDates,
  UserPlastDegree,
} from "../../../api/activeMembershipApi";
import userApi from "../../../api/UserApi";
import AuthStore from "../../../stores/AuthStore";
import jwt from "jwt-decode";
import ModalAddPlastDegree from "./PlastDegree/ModalAddPlastDegree";
import moment from "moment";
import AvatarAndProgress from "../personalData/AvatarAndProgress";
import ModalAddEndDatePlastDegree from "./PlastDegree/ModalAddEndDatePlastDegree";
import ModalChangeUserDates from "./UserDates/ModalChangeUserDates";
import DeleteDegreeConfirm from "./PlastDegree/DeleteDegreeConfirm";
import { SafetyCertificateOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ActiveMembership = () => {
  const { userId } = useParams();
  const [data, setData] = useState<any>({});
  const [accessLevels, setAccessLevels] = useState([]);
  const [dates, setDates] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [LoadInfo, setLoadInfo] = useState<boolean>(false);
  const [plastDegrees, setPlastDegrees] = useState<Array<UserPlastDegree>>([]);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [datesVisibleModal, setDatesVisibleModal] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<any>([{ nameid: "" }]);
  const [endDateVisibleModal, setEndDateVisibleModal] = useState<boolean>(
    false
  );
  const [plastDegreeIdToAddEndDate, setPlastDegreeIdToAddEndDate] = useState<
    number
  >(0);
  const userAdminTypeRoles = [
    "Admin",
    "Голова Пласту",
    "Адміністратор подій",
    "Голова Куреня",
    "Діловод Куреня",
    "Голова Округу",
    "Діловод Округу",
    "Голова Станиці",
    "Діловод Станиці",
  ];
  const userGenders = ["Чоловік", "Жінка"];

  const handleAddDegree = async () => {
    await activeMembershipApi.getUserPlastDegrees(userId).then((response) => {
      setPlastDegrees(response);
    });
  };
  const getAppropriateToGenderDegree = (plastDegreeName: string): string => {
    if (userGenders[0] === user.gender.name) {
      return plastDegreeName.split("/")[0];
    } else if (userGenders[1] === user.gender.name) {
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

    await userApi.getById(userId).then(async (response) => {
      setUser(response.data.user);
    });

    setAccessLevels(await activeMembershipApi.getAccessLevelById(userId));

    await activeMembershipApi.getUserDates(userId).then((response) => {
      response.dateEntry = response.dateEntry === "0001-01-01T00:00:00" ? "" : response.dateEntry;
      response.dateOath = response.dateOath === "0001-01-01T00:00:00" ? "" : response.dateOath;
      response.dateEnd = response.dateEnd === "0001-01-01T00:00:00" ? "" : response.dateEnd;
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
  const handleDelete = async () => {
    fetchData();
  };
  const handleAddEndDate = async () => {
    fetchData();
  };
  const handleChangeDates = async () => {
    fetchData();
  };
  const showModal = () => setVisibleModal(true);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className={classes.wrapper}>
      <div className={classes.avatarWrapper}>
        <AvatarAndProgress
          imageUrl={user.imagePath}
          time={data.timeToJoinPlast}
          firstName={user.firstName}
          lastName={user.lastName}
          isUserPlastun={true}
        />

        {IsUserHasAnyAdminTypeRoles(
          userToken[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ]
        ) && (
          <Button type="primary" onClick={showModal}>
            Додати ступінь
          </Button>
        )}
      </div>

      <div className={classes.wrapperCol}>
        <div className={classes.wrapper}>
          <div className={classes.wrapper2}>
            <Title level={2}> Загальна інформація </Title>
            {/* <div className={classes.line} /> */}
            <div className={classes.textBlock}>
              {LoadInfo ? (
                <>
                  <div className={classes.textGeneralInfo}>
                    <span className={classes.date}>Дата вступу:{" "}</span> 
                    {dates?.dateEntry === ""
                      ? "Не задано"
                      : moment(dates.dateEntry).format("DD-MM-YYYY")}
                  </div>
                  <div className={classes.textGeneralInfo}>
                  <span className={classes.date}>Дата присяги:{" "}</span> 
                    {dates?.dateOath === ""
                      ? "Без присяги"
                      : moment(dates.dateOath).format("DD-MM-YYYY")}
                  </div>
                  <div className={classes.textGeneralInfo}>
                  <span className={classes.date}>Дата завершення:{" "}</span> 
                    {dates?.dateEnd === ""
                      ? "Ще в Пласті"
                      : moment(dates.dateEnd).format("DD-MM-YYYY")}
                  </div>
                  {IsUserHasAnyAdminTypeRoles(
                    userToken[
                      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ]
                  ) && (
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
          </div>
          <div className={classes.wrapper2}>
            <Title level={2}> Рівні доступу </Title>
            {/* <div className={classes.line} /> */}
              <div className={classes.textBlock}>
                <List
                  dataSource={accessLevels}
                  renderItem={(item) => (
                    <List.Item style={{ fontSize: "16px" }}>{item}</List.Item>
                  )}
                />
              </div>

          </div>
        </div>
        <div className={classes.wrapper}>
          <div className={classes.wrapperScrollDegree}>
          <div className={classes.wrapperPlastDegree}>
            <Title level={2}> Ступені користувача </Title>
            {/* <div className={classes.line} /> */}
            {plastDegrees.map((pd) => (
              <React.Fragment key={pd.id}>
                <div className={classes.textFieldsMain}>
                  {pd.isCurrent && <SafetyCertificateOutlined />}{" "}
                  {getAppropriateToGenderDegree(pd.plastDegree.name)}
                </div>
                <div className={classes.textFieldsOthers}>
                  Дата початку ступеню:{" "}
                  {moment(pd.dateStart).format("DD-MM-YYYY")}
                </div>
                {pd.dateFinish !== null && (
                  <div className={classes.textFieldsOthers}>
                    Дата завершення ступеню:{" "}
                    {moment(pd.dateFinish).format("DD-MM-YYYY")}
                  </div>
                )}
                {IsUserHasAnyAdminTypeRoles(
                  userToken[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                  ]
                ) && (
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
                            .setPlastDegreeAsCurrent(userId, pd.plastDegree.id)
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
              </React.Fragment>
            ))}
            </div>
          </div>
          
        
        </div>
      </div>
      <ModalAddPlastDegree
        handleAddDegree={handleAddDegree}
        userId={userId}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
      />
      <ModalAddEndDatePlastDegree
        userId={userId}
        plastDegreeId={plastDegreeIdToAddEndDate}
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
