import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  List,
  Button,
  Tooltip,
  Tag,
  Empty,
  Skeleton,
  Form,
  Card
} from "antd";
import "../personalData/PersonalData.less";
import jwt from "jwt-decode";
import moment from "moment";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { StickyContainer } from "react-sticky";
import activeMembershipApi, {
  UserDates,
  UserPlastDegree,
  UserFormerDates
} from "../../../api/activeMembershipApi";
import AuthLocalStorage from "../../../AuthLocalStorage";
import ModalAddPlastDegree from "./PlastDegree/ModalAddPlastDegree";
import ModalChangeUserDates from "./UserDates/ModalChangeUserDates";
import DeleteDegreeConfirm from "./PlastDegree/DeleteDegreeConfirm";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import AvatarAndProgressStatic from "../personalData/AvatarAndProgressStatic";
import notificationLogic from "../../../components/Notifications/Notification";
import { Roles } from "../../../models/Roles/Roles";
import { successfulDeleteDegree } from "../../../components/Notifications/Messages";
import { PersonalDataContext } from "../personalData/PersonalData";
import classes from "./ActiveMembership.module.css";
import { UserFormerMembershipTable } from "./UserDates/UserFormerMembershipTable";

const { Title } = Typography;

const itemMaxLength = 43;
const ActiveMembership = () => {
  const {userId} = useParams();
  const [accessLevels, setAccessLevels] = useState([]);
  const [dates, setDates] = useState<UserDates>();

  const {
    userProfile,
    activeUserRoles,
    fullUserProfile,
    activeUserProfile,
    loading,
    updateData,
  } = useContext(PersonalDataContext);
  const [loadInfo, setLoadInfo] = useState<boolean>(false);
  const [userPlastDegree, setUserPlastDegree] = useState<UserPlastDegree>({} as UserPlastDegree);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [datesVisibleModal, setDatesVisibleModal] = useState<boolean>(false);
  const [userToken, setUserToken] = useState<any>([{ nameid: "" }]);
  const defaultDate: string = "0001-01-01T00:00:00";

  const userAdminTypeRoles = [
    Roles.Admin,
    Roles.GoverningBodyAdmin,
    Roles.OkrugaHead,
    Roles.OkrugaHeadDeputy,
    Roles.CityHead,
    Roles.CityHeadDeputy,
    Roles.KurinHead,
    Roles.KurinHeadDeputy,
    Roles.RegionBoardHead,
  ];
  const userGenders = ["Чоловік", "Жінка", "Не маю бажання вказувати"];

  const setDefaultDates = () => {
    const defaultDates: UserDates = {
      dateEntry: "",
      dateOath: "",
      dateEnd: "",
      userId: userId,
    };
    setDates(defaultDates);
  };

  const handleAddDegree = async () => {
    await activeMembershipApi.getUserPlastDegree(userId).then((response) => {
      setUserPlastDegree(response);
    });
  };
  const getAppropriateToGenderDegree = (plastDegreeName: string): string => {
    if (
      userGenders[0] === fullUserProfile?.user.gender?.name &&
      plastDegreeName?.includes("/")
    ) {
      return plastDegreeName.split("/")[0];
    } else if (
      userGenders[1] === fullUserProfile?.user.gender?.name &&
      plastDegreeName?.includes("/")
    ) {
      return plastDegreeName.split("/")[1];
    } else return plastDegreeName;
  };

  const initialFetchData = async () => {
    const token = AuthLocalStorage.getToken() as string;
    setUserToken(jwt(token));

    setAccessLevels(await activeMembershipApi.getAccessLevelById(userId));

    await activeMembershipApi
      .getUserDates(userId)
      .then((response) => {
        response.dateEntry =
          response.dateEntry === defaultDate ? "" : response.dateEntry;
        response.dateOath =
          response.dateOath === defaultDate ? "" : response.dateOath;
        response.dateEnd =
          response.dateEnd === defaultDate ? "" : response.dateEnd;
        setDates(response);
        setLoadInfo(true);
      })
      .catch(() => {
        setDefaultDates();
        setLoadInfo(true);
        notificationLogic(
          "error",
          "Не вдалося завантажити дати дійсного членства"
        );
      });
    
    setUserPlastDegree(await activeMembershipApi.getUserPlastDegree(userId));
  };

  const fetchData = async () => {
    if (updateData) updateData();
    const token = AuthLocalStorage.getToken() as string;
    setUserToken(jwt(token));

    setAccessLevels(await activeMembershipApi.getAccessLevelById(userId));

    await activeMembershipApi.getUserDates(userId).then((response) => {
      response.dateEntry =
        response.dateEntry === defaultDate ? "" : response.dateEntry;
      response.dateOath =
        response.dateOath === defaultDate ? "" : response.dateOath;
      response.dateEnd =
        response.dateEnd === defaultDate ? "" : response.dateEnd;
      setDates(response);
      setLoadInfo(true);
    });

    await activeMembershipApi.getUserPlastDegree(userId).then((response) => {
      setUserPlastDegree(response);
    });
  };

  const isUserHasAccessToManageDegree = (userRoles: string[]): boolean => {
    return (
      (userRoles?.includes(Roles.CityHead) &&
        activeUserProfile?.cityId == fullUserProfile?.user.cityId) ||
      (userRoles?.includes(Roles.CityHeadDeputy) &&
        activeUserProfile?.cityId == fullUserProfile?.user.cityId) ||
      (userRoles?.includes(Roles.OkrugaHead) &&
        activeUserProfile?.regionId == fullUserProfile?.user.regionId) ||
      (userRoles?.includes(Roles.OkrugaHeadDeputy) &&
        activeUserProfile?.regionId == fullUserProfile?.user.regionId) ||
      userRoles?.includes(Roles.RegionBoardHead) ||
      userRoles?.includes(Roles.GoverningBodyAdmin) ||
      userRoles?.includes(Roles.Admin)
    );
  };

  const isPossibleToChangeDateOfSwear = (access: string[]): boolean => {
    var flag = true;
    access.map((x) => {
      if (
        x.includes(Roles.RegisteredUser) ||
        x.includes(Roles.FormerPlastMember)
      ) {
        flag = false;
        return;
      }
    });
    return flag;
  };

  const isUserHasAnyAdminTypeRoles = (userRoles: string[]): boolean => {
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
    if (userPlastDegree !== null) {
      await NotificationBoxApi.createNotifications(
        [userId],
        `На жаль вас було позбавлено ступеня: ${getAppropriateToGenderDegree(
          userPlastDegree!.plastDegree.name
        )} в `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/userpage/activeMembership/${userId}`,
        `Дійсному членстві`,
        true
      );
    }
    await fetchData();
    notificationLogic("success", successfulDeleteDegree());
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

  useEffect(() => {
    initialFetchData();
  }, []);

  return (loading && loadInfo) === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : (
    <Form name="basic" className="formContainer">
      <div className="wrapperContainer">
        <div className="avatarWrapperUserFields">
          <StickyContainer className="kadraWrapper">
            <AvatarAndProgressStatic
              time={userProfile?.timeToJoinPlast}
              firstName={fullUserProfile?.user.firstName}
              lastName={fullUserProfile?.user.lastName}
              isUserPlastun={fullUserProfile?.isUserPlastun}
              isUserAdmin={fullUserProfile?.isUserAdmin}
              pseudo={fullUserProfile?.user.pseudo}
              governingBody={fullUserProfile?.user.governingBody}
              region={fullUserProfile?.user.region}
              city={fullUserProfile?.user.city}
              club={fullUserProfile?.user.club}
              governingBodyId={fullUserProfile?.user.governingBodyId}
              regionId={fullUserProfile?.user.regionId}
              cityId={fullUserProfile?.user.cityId}
              clubId={fullUserProfile?.user.clubId}
              cityMemberIsApproved={fullUserProfile?.user.cityMemberIsApproved}
              clubMemberIsApproved={fullUserProfile?.user.clubMemberIsApproved}
              showPrecautions={userProfile?.shortUser === null}
            />
          </StickyContainer>
        </div>
      </div>

      <div className="allFields">
        <div className={classes.wrapper}>
          <div className={classes.wrapperGeneralInfo}>
            <Title level={2}> Загальна інформація </Title>
            <div className={classes.textBlock}>
              {loadInfo && loading ? (
                <>
                  <ul className={classes.textList}>
                    <li className={classes.textListItem} key={1}>
                      <div>
                        <span className={classes.date}>Дата вступу: </span>
                        {dates?.dateEntry === ""
                          ? "Не задано"
                          : moment
                              .utc(dates?.dateEntry)
                              .local()
                              .format("DD.MM.YYYY")}
                      </div>
                    </li>
                    <li className={classes.textListItem} key={2}>
                      <div>
                        <span className={classes.date}>Дата присяги: </span>
                        {dates?.dateOath === ""
                          ? "Без присяги"
                          : moment
                              .utc(dates?.dateOath)
                              .local()
                              .format("DD.MM.YYYY")}
                      </div>
                    </li>
                    <li className={classes.textListItem} key={3}>
                      <div>
                        <span className={classes.date}>Дата завершення: </span>
                        {dates?.dateEnd === ""
                          ? dates.dateEntry === ""
                            ? " - "
                            : "ще у Пласті"
                          : moment
                              .utc(dates?.dateEnd)
                              .local()
                              .format("DD.MM.YYYY")}
                      </div>
                    </li>
                  </ul>

                  {isUserHasAccessToManageDegree(activeUserRoles) &&
                    isPossibleToChangeDateOfSwear(accessLevels) && (
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
            
            <Card
            style={{ width: "100%",
                     backgroundColor: "#F0F5F0"}}>
              <UserFormerMembershipTable UserId={userId} />
            </Card>
            
            <div className={""}>
              <Title level={4}> Рівні доступу </Title>
              <div className={classes.textBlock}>
                <List
                  style={{ overflow: "hidden" }}
                  dataSource={accessLevels}
                  renderItem={(item: any, index) => (
                    <List.Item
                      className={classes.textListItem}
                      style={{ padding: "6px 0" }}
                    >
                      <Tag color={setTagColor(item)} key={index}>
                        {item?.length > itemMaxLength ? (
                          <Tooltip placement="topLeft" title={item}>
                            <span>
                              {item.slice(0, itemMaxLength - 1) + "..."}
                            </span>
                          </Tooltip>
                        ) : (
                          <Tooltip placement="topLeft" title={item}>
                            {item}
                          </Tooltip>
                        )}
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
            {userPlastDegree && userPlastDegree.id ? (
              <React.Fragment key={userPlastDegree?.id}>
                <div style={{ marginBottom: "7px" }}>
                  <div className={classes.textFieldsMain}>
                    {<SafetyCertificateOutlined />}{" "}
                    {getAppropriateToGenderDegree(
                      userPlastDegree!.plastDegree?.name
                    )}
                  </div>
                  <div className={classes.textFieldsOthers}>
                    Дата початку ступеня:{" "}
                    {moment
                      .utc(userPlastDegree?.dateStart)
                      .local()
                      .format("DD.MM.YYYY")}
                  </div>
                  {isUserHasAccessToManageDegree(
                    activeUserRoles?.map((role: any) => {
                      if (
                        !(
                          role === Roles.KurinHead ||
                          role === Roles.KurinHeadDeputy ||
                          role === Roles.CityHead ||
                          role === Roles.CityHeadDeputy
                        )
                      )
                        return role;
                    })
                  ) && (
                    <div className={classes.buttons}>
                      <Button
                        type="primary"
                        className={classes.buttonChange}
                        onClick={() => {
                          DeleteDegreeConfirm(
                            userId,
                            userPlastDegree!.plastDegree.id,
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
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Без ступеня"
              />
            )}
            {isUserHasAccessToManageDegree(
              activeUserRoles?.map((role: any) => {
                if (
                  !(role === Roles.KurinHead || role === Roles.KurinHeadDeputy)
                )
                  return role;
              })
            ) && (
              <div className={classes.buttons}>
                <Button
                  type="primary"
                  className={classes.buttonChange}
                  onClick={() => setVisibleModal(true)}
                >
                  {userPlastDegree ? 'Змінити ступінь' : 'Додати ступінь'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ModalAddPlastDegree
        userId={userId}
        isCityAdmin={
          !isUserHasAnyAdminTypeRoles(
            activeUserRoles?.map((role: any) => {
              if (!(role === Roles.CityHead || role === Roles.CityHeadDeputy))
                return role;
            })
          )
        }
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        handleAddDegree={handleAddDegree}
        isChangingUserDegree={Boolean(userPlastDegree)}
      />
      <ModalChangeUserDates
        userId={userId}
        dates={dates}
        datesVisibleModal={datesVisibleModal}
        setDatesVisibleModal={setDatesVisibleModal}
        handleChangeDates={handleChangeDates}
      />
    </Form>
  );
};
export default ActiveMembership;
