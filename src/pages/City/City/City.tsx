import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import {
  Avatar,
  Row,
  Col,
  Button,
  Layout,
  Modal,
  Skeleton,
  Card,
  Tooltip,
  Badge,
  Tag
} from "antd";
import {
  FileTextOutlined,
  EditOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  PlusOutlined,
  ContainerOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  MinusOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import moment from "moment";
import {
  addAdministrator,
  addFollower,
  cityNameOfApprovedMember,
  editAdministrator,
  getCityById,
  getLogo,
  archiveCity,
  unArchiveCity,
  removeCity,
  getUserCityAccess,
  getCheckPlastMember,
  toggleMemberStatus,
  removeFollower
} from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import "./City.less";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import CityProfile from "../../../models/City/CityProfile";
import CityMember from "../../../models/City/CityMember";
import CityAdmin from "../../../models/City/CityAdmin";
import CityDocument from "../../../models/City/CityDocument";
import AddDocumentModal from "../AddDocumentModal/AddDocumentModal";
import CheckActiveMembersForm from "./CheckActiveMembersForm";
import jwt from 'jwt-decode';
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../../Spinner/Spinner";
import CityDetailDrawer from "../CityDetailDrawer/CityDetailDrawer";
import notificationLogic from "../../../components/Notifications/Notification";
import Crumb from "../../../components/Breadcrumb/Breadcrumb";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import { successfulDeleteAction, fileIsAdded, successfulEditAction, successfulUnarchiveAction, successfulArchiveAction } from "../../../components/Notifications/Messages";
import PsevdonimCreator from "../../../components/HistoryNavi/historyPseudo";
import AddCitiesNewSecretaryForm from "../AddAdministratorModal/AddCitiesSecretaryForm";
import { Roles } from "../../../models/Roles/Roles";
import "moment/locale/uk";
import AuthStore from "../../../stores/AuthStore";

const City = () => {
  const history = useHistory();
  const { id } = useParams();
  const { url } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<CityProfile>(new CityProfile());
  const [cityLogo64, setCityLogo64] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [userAccesses, setUserAccesses] = useState<{[key: string]:boolean}>({})
  const [admins, setAdmins] = useState<CityAdmin[]>([]);
  const [members, setMembers] = useState<CityMember[]>([]);
  const [followers, setFollowers] = useState<CityMember[]>([]);
  const [documents, setDocuments] = useState<CityDocument[]>([]);
  const [canJoin, setCanJoin] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [membersCount, setMembersCount] = useState<number>();
  const [adminsCount, setAdminsCount] = useState<number>();
  const [followersCount, setFollowersCount] = useState<number>();
  const [documentsCount, setDocumentsCount] = useState<number>();
  const [cityLogoLoading, setCityLogoLoading] = useState<boolean>(false);
  const [visible, setvisible] = useState<boolean>(false);
  const [document, setDocument] = useState<CityDocument>(new CityDocument());
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [activeUserCity, setActiveUserCity] = useState<string>();
  const [activeMemberVisibility, setActiveMemberVisibility] = useState<boolean>(false);
  const [isActiveCity, setIsActiveCity] = useState<boolean>(true);
  const [isLoadingPlus, setIsLoadingPlus] = useState<boolean>(true);
  const [isLoadingMemberId, setIsLoadingMemberId] = useState<number>(0);
  const [activeUserID, setActiveUserID] = useState<string>();
  const documentsToShow = 6;
  const adminsToShow = 6;
  const membersToShow = 9;
  const followersToShow = 5;
  const followersToShowOnAdd = 6;

  const changeApproveStatus = async (memberId: number) => {
    setIsLoadingMemberId(memberId)
    setIsLoadingPlus(false)
    const member = await toggleMemberStatus(memberId);
    moment.locale("uk-ua");

    await createNotification(member.data.userId,
      "Вітаємо, вас зараховано до членів станиці", true);

    if (member.data.wasInRegisteredUserRole) {
      await createNotification(member.data.userId, "Тобі надано нову роль: 'Прихильник' в станиці", true);
    }

    member.data.user.imagePath = (
      await userApi.getImage(member.data.user.imagePath)
    ).data;
    const response = await getCityById(+id);
    setMembersCount(response.data.memberCount);
    setFollowersCount(response.data.followerCount);
    if (members.length < 9) {
      setMembers([...members, member.data]);
    }
    setFollowers(followers.filter((f) => f.id !== memberId));
    setIsLoadingPlus(true)
  };

  const removeMember = async (followerID: number) => {
    await removeFollower(followerID);
    await createNotification(activeUserID as string, "На жаль, ви були виключені із прихильників станиці", true);
    const response = await getCityById(+id);
    setFollowersCount(response.data.followerCount);
    setFollowers(followers.filter((f) => f.id !== followerID));
    setCanJoin(true);
  }

  const addMember = async () => {
    const follower = await addFollower(+id);

    if (city.head !== null) {
      await createNotification(city.head.userId,
        `Новий прихильник ${follower.data.user.firstName} ${follower.data.user.lastName} приєднався до вашої станиці`, true);
    }
    if (city.headDeputy !== null) {
      await createNotification(city.headDeputy.userId,
        `Новий прихильник ${follower.data.user.firstName} ${follower.data.user.lastName} приєднався до вашої станиці`, true);
    }
    follower.data.user.imagePath = (
      await userApi.getImage(follower.data.user.imagePath)
    ).data;
    const response = await getCityById(+id);
    setFollowersCount(response.data.followerCount);
    if (followers.length < 6) {
      setFollowers([...followers, follower.data]);
    }
    setCanJoin(false);
  };

  const ArchiveCity = async () => {
    await archiveCity(city.id);
    notificationLogic("success", successfulArchiveAction("Станицю"));
    admins.map(async (ad) => {
      await createNotification(ad.userId,
        `На жаль станицю '${city.name}', в якій ви займали роль: '${ad.adminType.adminTypeName}' було заархівовано.`, false);
    });
    history.push("/cities");
  };

  const deleteCity = async () => {
    await removeCity(city.id);
    notificationLogic("success", successfulDeleteAction("Станицю"));

    history.push("/cities");
  };

  const UnArchiveCity = async () => {
    await unArchiveCity(city.id)
    notificationLogic("success", successfulUnarchiveAction("Станицю"));

    history.push("/cities");
  };

  const setPhotos = async (members: CityMember[], logo: string) => {
    for (let i = 0; i < members.length; i++) {
      members[i].user.imagePath = (
        await userApi.getImage(members[i].user.imagePath)
      ).data;
    }
    setPhotosLoading(false);

    if (logo === null) {
      setCityLogo64(CityDefaultLogo);
    } else {
      const response = await getLogo(logo);
      setCityLogo64(response.data);
    }
    setCityLogoLoading(false);
  };

  const onAdd = async (newDocument: CityDocument) => {
    const response = await getCityById(+id);
    setDocumentsCount(response.data.documentsCount);
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
    notificationLogic("success", fileIsAdded());
  };

  function seeArchiveModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете архівувати дану станицю?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, заархівувати",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        membersCount !== 0 || adminsCount !== 0 || followersCount !== 0
          ? setActiveMemberVisibility(true)
          : ArchiveCity();
      },
    });
  }

  function seeUnArchiveModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете розархівувати дану станицю?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, розархівувати",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        UnArchiveCity();
      },
    });
  }

  function seeDeleteModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити дану станицю?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        deleteCity();
      },
    });
  }

  function seeJoinModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете доєднатися до даної станиці? При доєднанні до нової станиці всі попередні ролі будуть скасовані.",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, доєднатися",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        addMember();
        setLoading(true)
      },
    });
  }

  function seeSkipModal(followerID: number) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете покинути дану станицю?",
      icon: <ExclamationCircleOutlined />,
      okText: 'Так, покинути',
      okType: 'primary',
      cancelText: 'Скасувати',
      maskClosable: true,
      onOk() { removeMember(followerID) }
    });
  }

  const getCity = async () => {
    setLoading(true);
    try {
      await getUserAccessesForCities();
      const response = await getCityById(+id);
      setActiveUserID(userApi.getActiveUserId());
      const responce1 = await cityNameOfApprovedMember(userApi.getActiveUserId());
      setCity(response.data);
      setActiveUserCity(responce1.data);
      setPhotosLoading(true);
      setCityLogoLoading(true);
      setPhotos(
        [...response.data.administration, ...response.data.members, ...response.data.followers],
        response.data.logo
      );
      setAdmins(response.data.administration);
      setMembers(response.data.members);
      setFollowers(response.data.followers);
      setDocuments(response.data.documents);
      setIsActiveCity(response.data.isActive);
      setCanJoin(response.data.canJoin);
      setMembersCount(response.data.memberCount);
      setAdminsCount(response.data.administrationCount);
      setFollowersCount(response.data.followerCount);
      setDocumentsCount(response.data.documentsCount);
      setActiveUserRoles(userApi.getActiveUserRoles);
    }
    finally {
      setLoading(false);
    }
  };

  const updateAdmins = async () => {
    const response = await getCityById(+id);
    setAdminsCount(response.data.administrationCount);
    setCity(response.data);
    setAdmins(response.data.administration);
    setPhotosLoading(true);
    setPhotos([...response.data.administration], response.data.logo);
  }

  const addCityAdmin = async (newAdmin: CityAdmin) => {
    let previousAdmin: CityAdmin = new CityAdmin();
    admins.map((admin) => {
      if (admin.adminType.adminTypeName == newAdmin.adminType.adminTypeName) {
        previousAdmin = admin;
      }
    });
    await addAdministrator(newAdmin.cityId, newAdmin);
    await updateAdmins();
    if (previousAdmin.adminType.adminTypeName != "") {
      await createNotification(previousAdmin.userId,
        `На жаль, ви були позбавлені ролі: '${previousAdmin.adminType.adminTypeName}' в станиці`, true);
    }
    await createNotification(newAdmin.userId,
      `Вам була присвоєна адміністративна роль: '${newAdmin.adminType.adminTypeName}' в станиці`, true);
      notificationLogic("success", "Користувач успішно доданий в провід");
  };

  const editCityAdmin = async (admin: CityAdmin) => {
    await editAdministrator(id, admin);
    await updateAdmins();
    notificationLogic("success", successfulEditAction("Адміністратора"));
    await createNotification(admin.userId,
      `Вам була відредагована адміністративна роль: '${admin.adminType.adminTypeName}' в станиці`, true);
  };

  const showConfirm = (newAdmin: CityAdmin, existingAdmin: CityAdmin) => {
    Modal.confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {existingAdmin.user.firstName} {existingAdmin.user.lastName}
          </b>{" "}
          вже має роль "{existingAdmin.adminType.adminTypeName}", час правління закінчується{" "}
          <b>
            {moment.utc(existingAdmin.endDate).local().format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment.utc(existingAdmin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),    
      onCancel() { },
      onOk() {
        if (newAdmin.id === 0) {
          addCityAdmin(newAdmin);
          setAdmins((admins as CityAdmin[]).map(x => x.userId === existingAdmin?.userId && x.adminType.adminTypeName === existingAdmin?.adminType?.adminTypeName ?
             newAdmin : x));
        } else {
          editCityAdmin(newAdmin);
        }
      }
    });
  };

  const showDisableModal = async (admin: CityAdmin) => {
    return Modal.warning({
      title: "Ви не можете додати роль цьому користувачу",
      content: (
        <div style={{ margin: 15 }}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
          є Головою Станиці, час правління закінчується{" "}
          <b>
            {moment.utc(admin.endDate).local().format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment.utc(admin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onOk() {}
    });
  };

  const showDisable = async (admin: CityAdmin) => {
    return Modal.warning({
      title: "Ви не можете додати роль цьому користувачу",
      content: (
        <div style={{ margin: 15 }}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
            вже має таку роль, час правління закінчується{" "}
          <b>
            {moment.utc(admin.endDate).local().format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment.utc(admin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onOk() {}
    });
  };

  const showPlastMemberDisable = async (admin: CityAdmin) => {
    return Modal.warning({
      title: "Ви не можете додати роль цьому користувачу",
      content: (
        <div style={{ margin: 15 }}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
            не є членом Пласту.
        </div>
      ),
      onOk() {}
    });
  };

  const handleOk = async(admin: CityAdmin) => {
    if (admin.id === 0) {
      const head = (admins as CityAdmin[])
        .find(x => x.adminType.adminTypeName === Roles.CityHead)
      if(admin !== undefined){
        const admini = admin.adminType.adminTypeName[0].toUpperCase() + admin.adminType.adminTypeName.slice(1);
        admin.adminType.adminTypeName = admini
      }
      const existingAdmin  = (admins as CityAdmin[])
        .find(x => x.adminType.adminTypeName === admin.adminType.adminTypeName)
      try {     
        if (head?.userId === admin.userId){
          showDisableModal(head)
        }
        else if(existingAdmin?.userId === admin.userId){
          showDisable(admin)
        }
        else if(admin.adminType.adminTypeName === "Голова СПР" ||
          admin.adminType.adminTypeName === "Член СПР"){
          const check = await getCheckPlastMember(admin.userId);
          if(check.data){
            await addCityAdmin(admin);
          }
          else {
            showPlastMemberDisable(admin);
          }
        }
        else if(existingAdmin !== undefined) {
          showConfirm(admin, existingAdmin);
        }
        else {
          await addCityAdmin(admin);
        }
      } finally {
        setvisible(false);
      }
    }
    else{
      if(admin.adminType.adminTypeName === "Голова СПР" ||
        admin.adminType.adminTypeName === "Член СПР"){
        if(await getCheckPlastMember(admin.userId)){
          await editCityAdmin(admin);
        }
        else {
          showPlastMemberDisable(admin);
        }
      }
      else{
        await editCityAdmin(admin);
      }
    }
  }

  const getUserAccessesForCities = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    await getUserCityAccess(+id, user.nameid).then(
      response => {
        setUserAccesses(response.data);
      }
    );
  }

  const handleClose = async () => {
    setvisible(false);
  };

  const handleConfirm = async () => {
    setActiveMemberVisibility(false);
  };

  const createNotification = async (userId: string, message: string, cityExist: boolean) => {
    if (cityExist) {
      await NotificationBoxApi.createNotifications(
        [userId],
        message + ": ",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/cities/${id}`,
        city.name
      );
    } else {
      await NotificationBoxApi.createNotifications(
        [userId],
        message,
        NotificationBoxApi.NotificationTypes.UserNotifications
      );
    }
  }

  useEffect(() => {
    getCity();
  }, [])

  useEffect(() => {
    if (city.name.length != 0) {
      PsevdonimCreator.setPseudonimLocation(`cities/${city.name}`, `cities/${id}`);
    }
  },[city])

  return loading ? (
    <Spinner />
  ) : city.id !== 0 ? (
    <Layout.Content className="cityProfile">
      <Row gutter={[0, 15]}>
        <Col span={8} offset={1}></Col>
      </Row>
      <Row gutter={[0, 48]}>
        <Col xl={15} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <div>
              <Crumb
                current={city.name}
                first="/"
                second={url.replace(`/${id}`, "")}
                second_name="Станиці"
              />
              {isActiveCity ? null : (
                <Tag className="status" color={"red"}>
                  Заархівовано
                </Tag>
              )}
            </div>
            <Title level={3}>Станиця {city.name}</Title>
            <Row className="cityPhotos" gutter={[0, 12]}>
              <Col md={13} sm={24} xs={24}>
                {cityLogoLoading ? (
                  <Skeleton.Avatar active shape={"square"} size={172} />
                ) : (
                  <img src={cityLogo64} alt="City" className="cityLogo" />
                )}
              </Col>
              <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                <iframe
                  src=""
                  title="map"
                  aria-hidden="false"
                  className="mainMap"
                />
              </Col>
            </Row>
            <Row className="cityInfo">
              <Col md={13} sm={24} xs={24}>
                {city.head ? (
                  <div>
                    <Paragraph>
                      <b>Голова Станиці:</b> {city.head.user.firstName}{" "}
                      {city.head.user.lastName}
                    </Paragraph>
                    {city.head.endDate ? (
                      <Paragraph>
                        <b>Час правління:</b>{" "}
                        {moment.utc(city.head.startDate).local().format("DD.MM.YYYY")}{" - "}
                        {moment.utc(city.head.endDate).local().format("DD.MM.YYYY")}
                      </Paragraph>
                    ) : (
                      <Paragraph>
                        <b>Початок правління:</b>{" "}
                        {moment.utc(city.head.startDate).local().format("DD.MM.YYYY")}
                      </Paragraph>
                    )}
                  </div>
                ) : (
                  <Paragraph>
                    <b>Ще немає голови станиці</b>
                  </Paragraph>
                )}

                {city.headDeputy ? (
                  <div>
                    <Paragraph>
                      <b>Заступник Голови Станиці:</b> {city.headDeputy.user.firstName}{" "}
                      {city.headDeputy.user.lastName}
                    </Paragraph>
                    {city.headDeputy.endDate ? (
                      <Paragraph>
                        <b>Час правління:</b>{" "}
                        {moment.utc(city.headDeputy.startDate).local().format("DD.MM.YYYY")}{" - "}
                        {moment.utc(city.headDeputy.endDate).local().format("DD.MM.YYYY")}
                      </Paragraph>
                    ) : (
                      <Paragraph>
                        <b>Початок правління:</b>{" "}
                        {moment.utc(city.headDeputy.startDate).local().format("DD.MM.YYYY")}
                      </Paragraph>
                    )}
                  </div>
                ) : (
                  <Paragraph>
                    <b>Ще немає заступника голови станиці</b>
                  </Paragraph>
                )}
              </Col>
              <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                {city.cityURL || city.email || city.phoneNumber ? (
                  <div>
                    {city.cityURL ? (
                      <Paragraph ellipsis>
                        <b>Посилання:</b>{" "}
                        <u>
                          <a href={city.cityURL} target="_blank">
                            {city.cityURL}
                          </a>
                        </u>
                      </Paragraph>
                    ) : null}
                    {city.phoneNumber ? (
                      <Paragraph>
                        <b>Телефон:</b> {city.phoneNumber}
                      </Paragraph>
                    ) : null}
                    {city.email ? (
                      <Paragraph>
                        <b>Пошта:</b> {city.email}
                      </Paragraph>
                    ) : null}
                  </div>
                ) : (
                  <Paragraph>
                    <b>Немає контактів</b>
                  </Paragraph>
                )}
              </Col>
            </Row>
            <Row className="cityButtons" justify="center" gutter={[12, 0]}>
              <Col>
                <Button
                  type="primary"
                  className="cityInfoButton"
                  onClick={() => setVisibleDrawer(true)}
                >
                  Деталі
                </Button>
              </Col>
              {userAccesses["EditCity"] ? (
                <Col>
                  <Button
                    type="primary"
                    className="cityInfoButton"
                    onClick={() => history.push(`/annualreport/table/city`)}
                  >
                    Річні звіти
                  </Button>
                </Col>
              ) : null}
              {userAccesses["EditCity"] ? (
                <Col xs={24} sm={4}>
                  <Row
                    className="cityIcons"
                    justify={userAccesses["DeleteCity"] ? "center" : "start"}
                  >
                    {userAccesses["EditCity"] ? (
                      <Col>
                        <Tooltip title="Редагувати станицю">
                          <EditOutlined
                            className="cityInfoIcon"
                            onClick={() =>
                              history.push(`/cities/edit/${city.id}`)
                            }
                          />
                        </Tooltip>
                      </Col>
                    ) : null}
                    {userAccesses["DeleteCity"] ? (
                      isActiveCity ? (
                        <Col offset={1}>
                          <Tooltip title="Архівувати станицю">
                            <ContainerOutlined
                              className="cityInfoIconDelete"
                              onClick={() => seeArchiveModal()}
                            />
                          </Tooltip>
                        </Col>) : (
                        <React.Fragment>
                          <Col offset={1}>
                            <Tooltip title="Видалити станицю">
                              <DeleteOutlined
                                className="cityInfoIconDelete"
                                onClick={() => seeDeleteModal()}
                              />
                            </Tooltip>
                          </Col>
                          <Col offset={1}>
                            <Tooltip title="Розархівувати станицю">
                              <ContainerOutlined
                                className="cityInfoIcon"
                                color="green"
                                onClick={() => seeUnArchiveModal()}
                              />
                            </Tooltip>
                          </Col>
                        </React.Fragment>)
                    ) : null}
                  </Row>
                </Col>
              ) : null}
            </Row>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4}>Члени станиці <a onClick={() => history.push(`/cities/members/${city.id}`)}>
              {membersCount !== 0 ?
                <Badge
                  count={membersCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a>
            </Title>
            <Row className={members.length >= 4 ? "cityItems1" : "cityItems"} justify="center" gutter={[0, 16]}>
              {members.length !== 0 ? (
                members.slice(0, membersToShow).map((member) => (
                  <Col
                    className="cityMemberItem"
                    key={member.id}
                    xs={12}
                    sm={8}
                  >
                    <div
                      onClick={() => userAccesses["EditCity"] || activeUserRoles.includes(Roles.Supporter) || activeUserRoles.includes(Roles.PlastMember)
                        ? history.push(`/userpage/main/${member.userId}`)
                        : undefined
                      }
                    >
                      {photosLoading ? (
                        <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                      ) : (
                        <Avatar size={64} src={member.user.imagePath} />
                      )}
                      <p className="userName">{member.user.firstName}</p>
                      <p className="userName">{member.user.lastName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає членів станиці</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/cities/members/${city.id}`)}
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 0 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="cityCard">
            <Title level={4}>Провід станиці <a onClick={() => history.push(`/cities/administration/${city.id}`)}>
              {adminsCount !== 0 ?
                <Badge
                  count={adminsCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {admins.length !== 0 ? (
                admins.slice(0, adminsToShow).map((admin) => (
                  <Col className="cityMemberItem" key={admin.id} xs={12} sm={8}>
                    <div
                      onClick={() => userAccesses["EditCity"] || activeUserRoles.includes(Roles.Supporter) || activeUserRoles.includes(Roles.PlastMember)
                        ? history.push(`/userpage/main/${admin.userId}`)
                        : undefined
                      }
                    >
                      {photosLoading ? (
                        <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                      ) : (
                        <Avatar size={64} src={admin.user.imagePath} />
                      )}
                      <p className="userName">{admin.user.firstName}</p>
                      <p className="userName">{admin.user.lastName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає діловодів станиці</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              {isActiveCity ? (userAccesses["EditCity"] ? (
                <PlusSquareFilled
                  type="primary"
                  className="addReportIcon"
                  onClick={() => setvisible(true)}
                />) : null) : null}
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() =>
                  history.push(`/cities/administration/${city.id}`)
                }
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4}>Документообіг станиці <a onClick={() =>
              userAccesses["IsAdmin"] || (userAccesses["DownloadDocument"] && city.name == activeUserCity)
                ?
                history.push(`/cities/documents/${city.id}`)
                : undefined
            }>
              {documentsCount !== 0 ?
                <Badge
                  count={documentsCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {documents.length !== 0 ? (
                documents.slice(0, documentsToShow).map((document) => (
                  <Col
                    className="cityDocumentItem"
                    xs={12}
                    sm={8}
                    key={document.id}
                  >
                    <div>
                      <FileTextOutlined className="documentIcon" />
                      <p className="documentText">
                        {document.cityDocumentType.name}
                      </p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає документів станиці</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              {userAccesses["IsAdmin"] || (userAccesses["DownloadDocument"] && city.name == activeUserCity)
                ? (
                  <Button
                    type="primary"
                    className="cityInfoButton"
                    onClick={() => history.push(`/cities/documents/${city.id}`)}
                  >
                    Більше
                  </Button>
                ) : null
              }
              {isActiveCity ? (userAccesses["EditCity"] ? (
                <PlusSquareFilled
                  className="addReportIcon"
                  onClick={() => setVisibleModal(true)}
                />
              ) : null) : null}
            </div>
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 1 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="cityCard">
            <Title level={4}>Прихильники станиці <a onClick={() => history.push(`/cities/followers/${city.id}`)}>
              {followersCount !== 0 ?
                <Badge
                  count={followersCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {isActiveCity ? (canJoin ? (
                <Col
                  className="cityMemberItem"
                  xs={12}
                  sm={8}
                  onClick={() => seeJoinModal()}
                >
                  <div>
                    <Avatar
                      className="addFollower"
                      size={64}
                      icon={<UserAddOutlined />}
                    />
                    <p>Доєднатися</p>
                  </div>
                </Col>
              ) : null) : <Paragraph>Ще немає прихильників станиці</Paragraph>}
              {followers.length !== 0 ? (
                followers.slice(0, canJoin ? followersToShow : followersToShowOnAdd).map((followers) => (
                  <Col
                    className="cityMemberItem"
                    xs={12}
                    sm={8}
                    key={followers.id}
                  >
                    <div>
                      <div
                        onClick={() => userAccesses["EditCity"] || activeUserRoles.includes(Roles.Supporter) || activeUserRoles.includes(Roles.PlastMember)
                          ? history.push(`/userpage/main/${followers.userId}`)
                          : undefined
                        }
                      >
                        {photosLoading ? (
                          <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                        ) : (
                          <Avatar size={64} src={followers.user.imagePath} />
                        )}
                        <p className="userName">{followers.user.firstName}</p>
                        <p className="userName">{followers.user.lastName}</p>
                      </div>
                      {(userAccesses["EditCity"] && isLoadingPlus) || (isLoadingMemberId !== followers.id && !isLoadingPlus) ? (
                        <Tooltip placement={"bottom"} title={"Додати до членів"}>
                          <PlusOutlined
                            className="approveIcon"
                            onClick={() => changeApproveStatus(followers.id)}
                          />
                        </Tooltip>
                      ) : (followers.userId === activeUserID) ? (
                        <Tooltip placement={"bottom"} title={"Покинути станицю"}>
                          <MinusOutlined
                            className="approveIcon"
                            onClick={() => seeSkipModal(followers.id)}
                          />
                        </Tooltip>) : !isLoadingPlus && isLoadingMemberId === followers.id ? (
                          <Tooltip placement={"bottom"} title={"Зачекайте"}>
                            <LoadingOutlined className="approveIcon" />
                          </Tooltip>
                        ) : null
                      }
                    </div>
                  </Col>
                ))
              ) : canJoin ? null : (
                <Paragraph>Ще немає прихильників станиці</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/cities/followers/${city.id}`)}
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      <CityDetailDrawer
        city={city}
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
      ></CityDetailDrawer>
      <Modal
        title="Додати діловода"
        visible={visible}
        onCancel={handleClose}
        footer={null}
      >
        <AddCitiesNewSecretaryForm
          onAdd={handleOk}
          cityId={+id}
          head={city.head}
          headDeputy={city.headDeputy}
          visibleModal={visible}>
        </AddCitiesNewSecretaryForm>
      </Modal>

      <Modal
        title="На жаль ви не можете архівувати зазначену Станицю"
        visible={activeMemberVisibility}
        onOk={handleConfirm}
        onCancel={handleConfirm}
        footer={null}
      >
        <CheckActiveMembersForm members={members} followers={followers} admins={admins} onAdd={handleConfirm} />
      </Modal>

      {userAccesses["EditCity"] ? (
        <AddDocumentModal
          cityId={+id}
          document={document}
          setDocument={setDocument}
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          onAdd={onAdd}
        ></AddDocumentModal>
      ) : null}
    </Layout.Content>
  ) : (
    <Title level={2}>Місто не знайдено</Title>
  );
};

export default City;
