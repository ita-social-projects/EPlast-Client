import {
  ContainerOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  PlusSquareFilled,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Layout,
  Modal,
  Row,
  Skeleton,
  Tag,
  Tooltip,
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import jwt from "jwt-decode";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import {
  cityNameOfApprovedMember,
  getCheckPlastMember,
  getLogo,
} from "../../api/citiesApi";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import {
  AddAdmin,
  archiveRegion,
  EditAdmin,
  getHead,
  getHeadDeputy,
  getRegionAdministration,
  getRegionById,
  getRegionFollowers,
  getUserRegionAccess,
  removeRegion,
  unArchiveRegion,
} from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import AuthLocalStorage from "../../AuthLocalStorage";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import PsevdonimCreator from "../../components/HistoryNavi/historyPseudo";
import {
  failArchiveAction,
  successfulArchiveAction,
  successfulDeleteAction,
  successfulEditAction,
  successfulUnarchiveAction,
} from "../../components/Notifications/Messages";
import notificationLogic from "../../components/Notifications/Notification";
import RegionAdmin from "../../models/Region/RegionAdmin";
import RegionDocument from "../../models/Region/RegionDocument";
import RegionFollower from "../../models/Region/RegionFollower";
import { Roles } from "../../models/Roles/Roles";
import Spinner from "../Spinner/Spinner";
import AddDocumentModal from "./AddDocModal";
import AddNewSecretaryForm from "./AddRegionSecretaryForm";
import CheckActiveCitiesForm from "./CheckActiveCitiesForm";
import "./Region.less";
import RegionDetailDrawer from "./RegionsDetailDrawer";

const Region = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const { id } = useParams();
  const maxMembersDisplayCount = 9;
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState(true);
  const [document, setDocument] = useState<RegionDocument>(new RegionDocument());
  const [documents, setDocuments] = useState<RegionDocument[]>([]);
  const classes = require("./Modal.module.css");
  const [region, setRegion] = useState<any>({
    id: "",
    regionName: "",
    description: "",
    logo: "",
    administration: [{}],
    cities: [{}],
    phoneNumber: "",
    email: "",
    link: "",
    documents: [{}],
    postIndex: "",
    city: "",
  });
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [admins, setAdmins] = useState<RegionAdmin[]>([]);
  const [sixAdmins, setSixAdmins] = useState<RegionAdmin[]>([]);
  const [members, setMembers] = useState<any[]>([
    {
      id: "",
      name: "",
      logo: "",
    },
  ]);
  const [nineMembers, setSixMembers] = useState<any[]>([]);
  const [activeMemberVisibility, setActiveMemberVisibility] = useState<boolean>(false);
  const [followers, setFollowers] = useState<RegionFollower[]>([]);
  const [followersCount, setFollowersCount] = useState<number>();
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [regionLogoLoading, setRegionLogoLoading] = useState<boolean>(false);
  const [membersCount, setMembersCount] = useState<number>();
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>({});
  const [activeCities, setActiveCities] = useState<any[]>([]);
  const [adminsCount, setAdminsCount] = useState<number>();
  const [documentsCount, setDocumentsCount] = useState<number>();
  const [visible, setVisible] = useState<boolean>(false);
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [isActiveUserRegionAdmin, setIsActiveUserRegionAdmin] = useState<boolean>(false);
  const [isActiveUserFromRegion, setIsActiveUserFromRegion] = useState<boolean>(false);
  const [isActiveRegion, setIsActiveRegion] = useState<boolean>(true);
  const [head, setHead] = useState<any>({
    user: {
      firstName: "",
      lastName: "",
    },
    startDate: "",
    endDate: "",
  });
  const [headDeputy, setHeadDeputy] = useState<any>({
    user: {
      firstName: "",
      lastName: "",
    },
    startDate: "",
    endDate: "",
  });

  const setPhotos = async (
    members: any[],
    admins: RegionAdmin[],
    followers: RegionFollower[]
  ) => {
    for (let i = 0; i < admins.length; i++) {
      admins[i].user.imagePath = (
        await userApi.getImage(admins[i].user.imagePath)
      ).data;
    }
    for (let i = 0; i < members.length; i++) {
      if (members[i].logo !== null) {
        members[i].logo = (await getLogo(members[i].logo)).data;
      } else {
        members[i].logo = CityDefaultLogo;
      }
    }
    for (let i = 0; i < followers.length; i++) {
      if (followers[i].logo === null) {
        followers[i].logo = CityDefaultLogo;
      }
    }
    setPhotosLoading(false);
    setRegionLogoLoading(false);
  };

  const ArchiveRegion = async () => {
    try {
      await archiveRegion(region.id);
      admins.map(async (ad) => {
        await createNotification(
          ad.userId,
          `На жаль округу '${region.regionName}', в якій ви займали роль: '${ad.adminType.adminTypeName}' було видалено.`,
          false,
          true
        );
      });
      notificationLogic("success", successfulArchiveAction("Округу"));
      history.push("/regions/page/1");
    } catch {
      notificationLogic("error", failArchiveAction(region.name));
    }
  };

  const deleteRegion = async () => {
    await removeRegion(region.id);
    notificationLogic("success", successfulDeleteAction("Округу"));

    history.push("/regions/page/1");
  };
  const UnArchiveRegion = async () => {
    await unArchiveRegion(region.id);
    notificationLogic("success", successfulUnarchiveAction("Округу"));

    history.push("/regions/page/1");
  };

  function seeArchiveModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете архівувати дану округу?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, заархівувати",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        membersCount !== 0 || adminsCount !== 0 || followersCount !== 0
          ? setActiveMemberVisibility(true)
          : ArchiveRegion();
      },
    });
  }

  function seeUnArchiveModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете розархівувати дану округу?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, розархівувати",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        UnArchiveRegion();
      },
    });
  }

  function seeDeleteModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити дану округу?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        deleteRegion();
      },
    });
  }

  const setActiveMembers = (cities: any[]) => {
    for (let i = 0; i < cities.length; i++) {
      if (cities[i].cityMembers.length != 0) {
        setActiveCities((activeCities) => [...activeCities, cities[i]]);
      }
    }
  };

  const getRegion = async () => {
    setLoading(true);
    try {
      await getUserAccessesForRegion();
      const regionResponse = await getRegionById(id);
      const regionAdministrationResp = await getRegionAdministration(id);
      const cityNameResp = await cityNameOfApprovedMember(
        userApi.getActiveUserId()
      );
      const regionFollowersResp = await getRegionFollowers(id);
      const responseHead = await getHead(id);
      const responseHeadDeputy = await getHeadDeputy(id);

      setActiveUserRoles(userApi.getActiveUserRoles());
      setHead(responseHead.data);
      setHeadDeputy(responseHeadDeputy.data);
      setMembers(regionResponse.data.cities);
      setActiveMembers(regionResponse.data.cities);
      setMembersCount(regionResponse.data.cities.length);
      getNineMembers(regionResponse.data.cities, maxMembersDisplayCount);
      setDocuments(regionResponse.data.documents);
      setDocumentsCount(regionResponse.data.documentsCount);
      setPhotosLoading(true);
      setAdmins(regionAdministrationResp.data);
      getSixAdmins(regionAdministrationResp.data, 6);
      setAdminsCount(regionAdministrationResp.data.length);
      setIsActiveRegion(regionResponse.data.isActive);
      setRegionLogoLoading(true);
      setPhotos(
        [...regionResponse.data.cities],
        [...regionAdministrationResp.data],
        regionFollowersResp.data
      );
      setRegion(regionResponse.data);
      setIsFromRegion(regionResponse.data.cities, cityNameResp.data);
      setIsRegionAdmin(
        regionAdministrationResp.data,
        userApi.getActiveUserId()
      );
      setSixFollowers(regionFollowersResp.data);
      setFollowers(regionFollowersResp.data);
      setFollowersCount(regionFollowersResp.data.length);

      if (regionResponse.data.logo === null) {
        setPhotoStatus(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserAccessesForRegion = async () => {
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    await getUserRegionAccess(+id, user.nameid).then((response) => {
      setUserAccesses(response.data);
    });
  };

  const updateAdmins = async () => {
    const regionResponse = await getRegionById(id);
    const regionAdministrationResp = await getRegionAdministration(id);
    const regionFollowersResp = await getRegionFollowers(id);
    const responseHead = await getHead(id);
    const responseHeadDeputy = await getHeadDeputy(id);
    setHead(responseHead.data);
    setHeadDeputy(responseHeadDeputy.data);
    setRegion(regionResponse.data);
    setPhotosLoading(true);
    getSixAdmins(regionAdministrationResp.data, 6);
    setAdminsCount(regionAdministrationResp.data.length);
    setPhotos(
      [...regionResponse.data.cities],
      [...regionAdministrationResp.data],
      regionFollowersResp.data
    );
    if (regionResponse.data.logo === null) {
      setPhotoStatus(false);
    }
  };

  const addRegionAdmin = async (newAdmin: RegionAdmin) => {
    let previousAdmin: RegionAdmin = new RegionAdmin();
    admins.map((admin) => {
      if (admin.adminType.adminTypeName == newAdmin.adminType.adminTypeName) {
        previousAdmin = admin;
      }
    });
    const { data: newAdministrator } = await AddAdmin(newAdmin);
    await updateAdmins();
    if (previousAdmin.adminType.adminTypeName != "") {
      await createNotification(
        previousAdmin.userId,
        `На жаль, ви були позбавлені ролі: '${previousAdmin.adminType.adminTypeName}' в окрузі`,
        true,
        true
      );
    }
    await createNotification(
      newAdmin.userId,
      `Вам була присвоєна адміністративна роль: '${newAdmin.adminType.adminTypeName}' в окрузі`,
      true,
      true
    );

    if (
      Date.now() < new Date(newAdministrator.endDate).getTime() ||
      newAdministrator.endDate === null
    ) {
      notificationLogic("success", "Користувач успішно доданий в провід");
    } else {
      notificationLogic("info", "Колишні діловодства округи були змінені");
    }
  };

  const editRegionAdmin = async (admin: RegionAdmin) => {
    await EditAdmin(admin);
    await updateAdmins();
    notificationLogic("success", successfulEditAction("Адміністратора"));
    await createNotification(
      admin.userId,
      `Вам була відредагована адміністративна роль: '${admin.adminType.adminTypeName}' в окрузі`,
      true,
      true
    );
  };

  const showConfirm = (newAdmin: RegionAdmin, existingAdmin: RegionAdmin) => {
    Modal.confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div className={classes.Style}>
          <b>
            {existingAdmin.user.firstName} {existingAdmin.user.lastName}
          </b>{" "}
          вже має роль "{existingAdmin.adminType.adminTypeName}", час правління
          закінчується{" "}
          <b>
            {existingAdmin.endDate === null ||
            existingAdmin.endDate === undefined
              ? "ще не скоро"
              : moment(existingAdmin.endDate).format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() {},
      onOk() {
        if (newAdmin.id === 0) {
          addRegionAdmin(newAdmin);
          setAdmins(
            (admins as RegionAdmin[]).map((x) =>
              x.userId === existingAdmin?.userId ? newAdmin : x
            )
          );
        } else {
          editRegionAdmin(newAdmin);
        }
      },
    });
  };

    const showConfirmAddNewHead = (
      newAdmin: RegionAdmin,
      existingAdmin?: RegionAdmin
    ) => {
      Modal.confirm({
        title: "Призначити даного користувача на цю посаду?",
        onCancel() { },
        async onOk() {
          await addRegionAdmin(newAdmin);
          admins.push(newAdmin);
          setAdmins(admins);
        },
      });
    };

    const showAddNewHeadExpired = (
      newAdmin: RegionAdmin,
      existingAdmin?: RegionAdmin
    ) => {
      Modal.confirm({
        title: "Призначити даного користувача на цю посаду?",
        content: (
          <div className={classes.Style}>
            <b>
              Дані будуть внесені у колишні діловодства округи, оскільки час
              правління вже закінчився.
            </b> 
          </div>
        ),
        onCancel() { },
        async onOk() {
          await addRegionAdmin(newAdmin);
          admins.push(newAdmin);
          setAdmins(admins);
        },
      });
    };

  const showDisableModal = async (admin: RegionAdmin) => {
    return Modal.warning({
      title: "Ви не можете додати роль цьому користувачу",
      content: (
        <div className={classes.Style}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
          є Головою Округи, час правління закінчується{" "}
          <b>
            {moment.utc(admin.endDate).local().format("DD.MM.YYYY") ===
            "Invalid date"
              ? "ще не скоро"
              : moment.utc(admin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onOk() {},
    });
  };

  const showDisable = async (admin: RegionAdmin) => {
    return Modal.warning({
      title: "Ви не можете додати роль цьому користувачу",
      content: (
        <div className={classes.Style}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
          вже має таку роль, час правління закінчується{" "}
          <b>
            {moment.utc(admin.endDate).local().format("DD.MM.YYYY") ===
            "Invalid date"
              ? "ще не скоро"
              : moment.utc(admin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onOk() {},
    });
  };

  const showPlastMemberDisable = async (admin: RegionAdmin) => {
    return Modal.warning({
      title: "Ви не можете додати роль цьому користувачу",
      content: (
        <div className={classes.Style}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
          не є членом Пласту.
        </div>
      ),
      onOk() {},
    });
  };

  const handleConfirm = async () => {
    setActiveMemberVisibility(false);
  };


  const handleOk = async (admin: RegionAdmin) => {
    if (admin.id === 0) {
      const head = (admins as RegionAdmin[]).find(
        (x) => x.adminType.adminTypeName === Roles.OkrugaHead
      );
      if (admin !== undefined) {
        admin.adminType.adminTypeName =
          admin.adminType.adminTypeName[0].toUpperCase() +
          admin.adminType.adminTypeName.slice(1);
      }
      const existingAdmin = (admins as RegionAdmin[]).find(
        (x) => x.adminType.adminTypeName === admin.adminType.adminTypeName
      );
      try {
        const existEndDate = moment.utc(existingAdmin?.endDate).local();
        const existStartDate = moment.utc(existingAdmin?.startDate).local();
        const newAdminStartDate = moment.utc(admin.startDate).local();
        const newAdminEndDate = moment.utc(admin.endDate).local();
        const currentDate = moment.utc(new Date()).local();

        if (head?.userId === admin.userId) {
          showDisableModal(head);
        } else if (existingAdmin?.userId === admin.userId) {
          showDisable(admin);
        } else if (
          existingAdmin !== undefined &&
          admin.endDate !== undefined &&
          ((existStartDate > newAdminStartDate &&
            existEndDate < newAdminEndDate) ||
            (existEndDate > newAdminEndDate &&
              existStartDate < newAdminStartDate) ||
            (existEndDate > newAdminEndDate &&
              newAdminEndDate > existStartDate))
        ) {
          showDisable(existingAdmin);
        } else if (
          admin.adminType.adminTypeName === "Голова ОПР" ||
          admin.adminType.adminTypeName === "Член ОПР" ||
          admin.adminType.adminTypeName === Roles.OkrugaHead ||
          admin.adminType.adminTypeName === Roles.OkrugaHeadDeputy
        ) {
          const check = await getCheckPlastMember(admin.userId);
          if (check.data) {
            if (newAdminEndDate < currentDate){
              showAddNewHeadExpired(admin, existingAdmin)
            } 
            else { showConfirmAddNewHead(admin, existingAdmin) };
          } else {
            showPlastMemberDisable(admin);
          }
        } else if (existingAdmin !== undefined) {
          showConfirm(admin, existingAdmin);
        } else {
          await addRegionAdmin(admin);
          admins.push(admin);
          setAdmins(admins);
        }
      } catch (e) {
        if (typeof e == 'string')
          throw new Error(e);
        else if (e instanceof Error)
          throw new Error(e.message);
      }
    } else {
      if (
        admin.adminType.adminTypeName === "Голова ОПР" ||
        admin.adminType.adminTypeName === "Член ОПР" ||
        admin.adminType.adminTypeName === Roles.OkrugaHead ||
        admin.adminType.adminTypeName === Roles.OkrugaHeadDeputy
      ) {
        if (await getCheckPlastMember(admin.userId)) {
          await editRegionAdmin(admin);
        } else {
          showPlastMemberDisable(admin);
        }
      } else {
        await editRegionAdmin(admin);
      }
    }
  };

  const handleClose = async () => {
    setVisible(false);
  };

  const setIsFromRegion = (members: any[], city: string) => {
    for (let i = 0; i < members.length; i++) {
      if (members[i].name == city) {
        setIsActiveUserFromRegion(true);
        return;
      }
    }
  };

  const setIsRegionAdmin = (admins: RegionAdmin[], userId: string) => {
    for (let i = 0; i < admins.length; i++) {
      if (admins[i].userId == userId) {
        setIsActiveUserRegionAdmin(true);
        return;
      }
    }
  };

  const setSixFollowers = (newfollowers: RegionFollower[]) => {
    if (newfollowers.length !== 0) {
      if (newfollowers.length > 6) {
        for (let i = 0; i < 6; i++) {
          followers[i] = newfollowers[i];
        }
      } else {
        for (let i = 0; i < newfollowers.length; i++) {
          followers[i] = newfollowers[i];
        }
      }
    }
  };

  const getNineMembers = (member: any[], amount: number) => {
    if (member.length > maxMembersDisplayCount) {
      for (let i = 0; i < amount; i++) {
        nineMembers[i] = member[i];
      }
    } else {
      if (member.length !== 0) {
        for (let i = 0; i < member.length; i++) {
          nineMembers[i] = member[i];
        }
      }
    }
  };

  const getSixAdmins = (admins: RegionAdmin[], amount: number) => {
    if (admins.length > 6) {
      for (let i = 0; i < amount; i++) {
        sixAdmins[i] = admins[i];
      }
    } else {
      if (admins.length !== 0) {
        for (let i = 0; i < admins.length; i++) {
          sixAdmins[i] = admins[i];
        }
      }
    }
  };

  const onAdd = async (newDocument: RegionDocument) => {
    const response = await getRegionById(id);
    setDocumentsCount(response.data.documentsCount);
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
  };

  const createNotification = async (
    userId: string,
    message: string,
    regionExist: boolean,
    mustLogOut?: boolean
  ) => {
    if (regionExist) {
      await NotificationBoxApi.createNotifications(
        [userId],
        message + ": ",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/regions/${id}`,
        region.regionName,
        mustLogOut
      );
    } else {
      await NotificationBoxApi.createNotifications(
        [userId],
        message,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        undefined,
        undefined,
        mustLogOut
      );
    }
  };

  useEffect(() => {
    getRegion();
  }, []);

  useEffect(() => {
    if (region.regionName.length !== 0) {
      PsevdonimCreator.setPseudonimLocation(
        `regions/${region.regionName}`,
        `regions/${id}`
      );
    }
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <Layout.Content className="cityProfile">
      <Row gutter={[0, 48]}>
        <Col xl={15} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <div>
              <Breadcrumb currentLocationName={region.regionName} />
              {isActiveRegion ? null : (
                <Tag className="status" color={"red"}>
                  Заархівовано
                </Tag>
              )}
            </div>
            <Title level={3}>Округа {region.regionName}</Title>
            <Row className="cityPhotos" gutter={[0, 12]}>
              <Col md={13} sm={24} xs={24}>
                {photoStatus ? (
                  <img src={region.logo} alt="Region" className="cityLogo" />
                ) : (
                  <img
                    src={CityDefaultLogo}
                    alt="Region"
                    className="cityLogo"
                  />
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
                {head.user ? (
                  <div>
                    <Paragraph>
                      <b>Голова Округи:</b> {head.user.firstName}{" "}
                      {head.user.lastName}
                    </Paragraph>
                    {head.endDate ? (
                      <Paragraph>
                        <b>Час правління:</b>{" "}
                        {moment
                          .utc(head.startDate)
                          .local()
                          .format("DD.MM.YYYY")}
                        {" - "}
                        {moment.utc(head.endDate).local().format("DD.MM.YYYY")}
                      </Paragraph>
                    ) : (
                      <Paragraph>
                        <b>Початок правління:</b>{" "}
                        {moment
                          .utc(head.startDate)
                          .local()
                          .format("DD.MM.YYYY")}
                      </Paragraph>
                    )}
                  </div>
                ) : (
                  <Paragraph>
                    <b>Ще немає голови округи</b>
                  </Paragraph>
                )}
                {headDeputy.user ? (
                  <div>
                    <Paragraph>
                      <b>Заступник Голови Округи:</b>{" "}
                      {headDeputy.user.firstName} {headDeputy.user.lastName}
                    </Paragraph>
                    {headDeputy.endDate ? (
                      <Paragraph>
                        <b>Час правління:</b>{" "}
                        {moment
                          .utc(headDeputy.startDate)
                          .local()
                          .format("DD.MM.YYYY")}
                        {" - "}
                        {moment
                          .utc(headDeputy.endDate)
                          .local()
                          .format("DD.MM.YYYY")}
                      </Paragraph>
                    ) : (
                      <Paragraph>
                        <b>Початок правління:</b>{" "}
                        {moment
                          .utc(headDeputy.startDate)
                          .local()
                          .format("DD.MM.YYYY")}
                      </Paragraph>
                    )}
                  </div>
                ) : (
                  <Paragraph>
                    <b>Ще немає заступника голови округи</b>
                  </Paragraph>
                )}
              </Col>

              <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                {region.link || region.email || region.phoneNumber ? (
                  <div>
                    {region.link ? (
                      <Paragraph ellipsis>
                        <b>Посилання:</b>{" "}
                        <u>
                          <a
                            href={region.link}
                            target="_blank"
                            className="link"
                          >
                            {region.link}
                          </a>
                        </u>
                      </Paragraph>
                    ) : null}
                    {region.phoneNumber ? (
                      <Paragraph>
                        <b>Телефон:</b> {region.phoneNumber}
                      </Paragraph>
                    ) : null}
                    {region.email ? (
                      <Paragraph>
                        <b>Пошта:</b> {region.email}
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

              {userAccesses["DeleteRegion"] || userAccesses["EditRegion"] ? (
                <>
                  <Col
                    style={{
                      display:
                        userAccesses["DeleteRegion"] ||
                        userAccesses["EditRegion"]
                          ? "block"
                          : "none",
                    }}
                  >
                    <Button
                      type="primary"
                      className="cityInfoButton"
                      onClick={() => history.push(`/annualreport/table/region`)}
                    >
                      Річні звіти
                    </Button>
                  </Col>
                  <Col
                    xs={24}
                    sm={4}
                    style={{
                      display: userAccesses["EditRegion"] ? "block" : "none",
                    }}
                  >
                    <Row
                      className="cityIcons"
                      justify={
                        userAccesses["DeleteRegion"] ? "center" : "start"
                      }
                    >
                      <Col>
                        <Tooltip title="Редагувати округу">
                          <EditOutlined
                            className="cityInfoIcon"
                            onClick={() =>
                              history.push(`/regions/edit/${region.id}`)
                            }
                          />
                        </Tooltip>
                      </Col>
                      {activeUserRoles.includes(Roles.Admin) ||
                      activeUserRoles.includes(Roles.GoverningBodyAdmin) ? (
                        isActiveRegion ? (
                          <Col offset={1}>
                            <Tooltip title="Заархівувати округу">
                              <ContainerOutlined
                                className="cityInfoIconDelete"
                                onClick={() => seeArchiveModal()}
                              />
                            </Tooltip>
                          </Col>
                        ) : (
                          <React.Fragment>
                            <Col offset={1}>
                              <Tooltip title="Видалити округу">
                                <DeleteOutlined
                                  className="cityInfoIconDelete"
                                  onClick={() => seeDeleteModal()}
                                />
                              </Tooltip>
                            </Col>
                            <Col offset={1}>
                              <Tooltip title="Розархівувати округу">
                                <ContainerOutlined
                                  className="cityInfoIcon"
                                  color="green"
                                  onClick={() => seeUnArchiveModal()}
                                />
                              </Tooltip>
                            </Col>
                          </React.Fragment>
                        )
                      ) : null}
                    </Row>
                  </Col>
                </>
              ) : null}
            </Row>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4}>
              Члени округи{" "}
              <a onClick={() => history.push(`/regions/members/${id}`)}>
                {membersCount !== 0 ? (
                  <Badge
                    count={membersCount}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {members.length !== 0 ? (
                nineMembers.map((member) => (
                  <Col
                    className="cityMemberItem"
                    key={member.id}
                    xs={12}
                    sm={8}
                  >
                    <div onClick={() => history.push(`/cities/${member.id}`)}>
                      {photosLoading ? (
                        <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                      ) : (
                        <Avatar size={64} src={member.logo} />
                      )}
                      <p className="userName">{member.name}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає членів округи</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/regions/members/${id}`)}
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
            <Title level={4}>
              Провід округи{" "}
              <a
                onClick={() =>
                  history.push(`/region/administration/${region.id}`)
                }
              >
                {adminsCount !== 0 ? (
                  <Badge
                    count={adminsCount}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {adminsCount !== 0 ? (
                sixAdmins.map((admin) => (
                  <Col className="cityMemberItem" key={admin.id} xs={12} sm={8}>
                    <div
                      onClick={() =>
                        !activeUserRoles.includes(Roles.RegisteredUser)
                          ? history.push(`/userpage/main/${admin.user.id}`)
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
                <Paragraph>Ще немає діловодів округи</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              {isActiveRegion ? (
                userAccesses["EditRegion"] ? (
                  <PlusSquareFilled
                    type="primary"
                    className="addReportIcon"
                    onClick={() => setVisible(true)}
                  />
                ) : null
              ) : null}
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() =>
                  history.push(`/region/administration/${region.id}`)
                }
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4}>
              Документообіг округи{" "}
              <a
                onClick={() =>
                  userAccesses["IsAdmin"] ||
                  (userAccesses["DownloadDocument"] && isActiveUserFromRegion)
                    ? history.push(`/regions/documents/${region.id}`)
                    : undefined
                }
              >
                {documentsCount !== 0 ? (
                  <Badge
                    count={documentsCount}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {documents.length !== 0 ? (
                documents.map((document) => (
                  <Col
                    className="cityDocumentItem"
                    xs={12}
                    sm={8}
                    key={document.id}
                  >
                    <div>
                      <Tooltip title={<div style={{textAlign: 'center'}}>{document.fileName}</div>}>
                        <FileTextOutlined className="documentIcon" />
                      </Tooltip>
                      <p className="documentText">{document.fileName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає документів округи</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              {userAccesses["IsAdmin"] ||
              (userAccesses["DownloadDocument"] && isActiveUserFromRegion) ? (
                <Button
                  type="primary"
                  className="cityInfoButton"
                  onClick={() =>
                    history.push(`/regions/documents/${region.id}`)
                  }
                >
                  Більше
                </Button>
              ) : null}
              {isActiveRegion ? (
                userAccesses["EditRegion"] ? (
                  <PlusSquareFilled
                    className="addReportIcon"
                    onClick={() => setVisibleModal(true)}
                  />
                ) : null
              ) : null}
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
            <Title level={4}>
              Прихильники округи{" "}
              <a
                onClick={() => history.push(`/regions/followers/${region.id}`)}
              >
                {followersCount !== 0 ? (
                  <Badge
                    count={followersCount}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {followers.length !== 0 ? (
                followers.slice(0, 6).map((follower) => (
                  <Col
                    className={
                      userAccesses["EditRegion"] ? "cityMemberItem" : undefined
                    }
                    xs={12}
                    sm={8}
                    key={follower.id}
                  >
                    <div>
                      <div
                        onClick={() =>
                          userAccesses["EditRegion"]
                            ? history.push(
                                `/regions/follower/edit/${follower.id}`
                              )
                            : undefined
                        }
                      >
                        {photosLoading ? (
                          <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                        ) : (
                          <Avatar size={64} src={follower.logo} />
                        )}
                        <p className="userName">{follower.cityName}</p>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає прихильників округи</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/regions/followers/${region.id}`)}
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <AddDocumentModal
        regionId={+id}
        document={document}
        setDocument={setDocument}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        onAdd={onAdd}
      ></AddDocumentModal>

      <Modal
        title="Додати діловода"
        visible={visible}
        onCancel={handleClose}
        footer={null}
      >
        <AddNewSecretaryForm
          onAdd={handleOk}
          head={head}
          headDeputy={headDeputy}
          regionId={region.id}
          visibleModal={visible}
        ></AddNewSecretaryForm>
      </Modal>

      <Modal
        title="На жаль ви не можете архівувати зазначену округу"
        visible={activeMemberVisibility}
        onOk={handleConfirm}
        onCancel={handleConfirm}
        footer={null}
      >
        <CheckActiveCitiesForm
          cities={activeCities}
          admins={admins}
          followers={followers}
          onAdd={handleConfirm}
        />
      </Modal>

      <RegionDetailDrawer
        region={region}
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
      ></RegionDetailDrawer>
    </Layout.Content>
  );
};

export default Region;
