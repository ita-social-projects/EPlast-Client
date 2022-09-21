import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Skeleton, Tooltip } from "antd";
import {
  EditOutlined,
  CloseOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import jwt from "jwt-decode";
import Title from "antd/lib/typography/Title";
import moment from "moment";
import {
  getRegionAdministration,
  getRegionById,
  getUserRegionAccess,
  removeAdmin,
} from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import "./Region.less";
import "moment/locale/uk";
import Spinner from "../Spinner/Spinner";
import CityAdmin from "../../models/City/CityAdmin";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import AddAdministratorModal from "./AddAdministratorModal";
import { Roles } from "../../models/Roles/Roles";
import RegionAdmin from "../../models/Region/RegionAdmin";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../components/Tooltip";
import notificationLogic from "../../components/Notifications/Notification";
import AuthLocalStorage from "../../AuthLocalStorage";
import {
  failDeleteAction,
  successfulDeleteAction,
} from "../../components/Notifications/Messages";

moment.locale("uk-ua");

const adminTypeNameMaxLength = 22;
const RegionAdministration = () => {
  const { id } = useParams();
  const history = useHistory();

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
  const [administration, setAdministration] = useState<RegionAdmin[]>([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<RegionAdmin>(new RegionAdmin());
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState(false);
  const [regionName, setRegionName] = useState<string>("");
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [isActiveUserRegionAdmin, setIsActiveUserRegionAdmin] = useState<
    boolean
  >(false);

  const setIsRegionAdmin = (admin: any[], userId: string) => {
    for (let i = 0; i < admin.length; i++) {
      if (admin[i].userId == userId) {
        setIsActiveUserRegionAdmin(true);
      }
    }
  };

  const getUserAccessesForRegion = async () => {
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    await getUserRegionAccess(+id, user.nameid).then((response) => {
      setUserAccesses(response.data);
    });
  };

  const getAdministration = async () => {
    setLoading(true);
    await getUserAccessesForRegion();
    const regionResponse = await getRegionById(id);
    const administrationResponse = await getRegionAdministration(id);
    setPhotosLoading(true);
    setRegion(regionResponse.data);
    setRegionName(regionResponse.data.name);
    setPhotos([...administrationResponse.data].filter((a) => a != null));
    setAdministration(
      [...administrationResponse.data].filter((a) => a != null)
    );
    setActiveUserRoles(userApi.getActiveUserRoles());
    setIsRegionAdmin(
      [...administrationResponse.data].filter((a) => a != null),
      userApi.getActiveUserId()
    );
    setLoading(false);
  };

  function seeDeleteModal(admin: CityAdmin) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити даного користувача із Проводу?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        removeAdministrator(admin);
      },
    });
  }

  const removeAdministrator = async (admin: CityAdmin) => {
    try {
      await removeAdmin(admin.id);
      await createNotification(
        admin.userId,
        `Вас було позбавлено адміністративної ролі: '${admin.adminType.adminTypeName}' в окрузі`
      );
      setAdministration(administration.filter((u) => u.id !== admin.id));
      notificationLogic(
        "success",
        successfulDeleteAction(
          admin.adminType.adminTypeName,
          `${admin.user.firstName} ${admin.user.lastName}`
        )
      );
    } catch {
      notificationLogic(
        "error",
        failDeleteAction(admin.adminType.adminTypeName)
      );
    }
  };

  const showModal = (member: RegionAdmin) => {
    setAdmin(member);
    setVisibleModal(true);
  };

  const onAdd = async (newAdmin: RegionAdmin = new RegionAdmin()) => {
    const previousAdmin = administration.find(a => a.id === admin.id)!; 
    const adminIdx = administration.findIndex(a => a.id === admin.id);
    administration[adminIdx] = newAdmin;
    if (previousAdmin.adminType.adminTypeName !== newAdmin.adminType.adminTypeName) {
      await createNotification(
        previousAdmin.userId,
        `Ви були позбавлені ролі: '${previousAdmin.adminType.adminTypeName}' в окрузі`
      );
    }
    await createNotification(
      newAdmin.userId,
      `Вам була присвоєна нова роль: '${newAdmin.adminType.adminTypeName}' в окрузі`
    );
    setAdministration(administration);
    setReload(!reload);
  };

  const setPhotos = async (members: any[]) => {
    for (let i of members) {
      i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
    }

    setPhotosLoading(false);
  };

  const createNotification = async (userId: string, message: string) => {
    await NotificationBoxApi.createNotifications(
      [userId],
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/regions/${id}`,
      regionName
    );
  };

  const getCardActions = (member: RegionAdmin) => {
    if (!userAccesses["EditRegion"]) {
      return undefined;
    }

    const actions = [];
    if (member.adminType.adminTypeName !== Roles.OkrugaHead) {
      actions.push(<SettingOutlined onClick={() => showModal(member)} />);
      actions.push(<CloseOutlined onClick={() => seeDeleteModal(member)} />);
      return actions;
    }

    if (userAccesses["EditRegionHead"]) {
      actions.push(<SettingOutlined onClick={() => showModal(member)} />);
    }
    if (userAccesses["RemoveRegionHead"]) {
      actions.push(<CloseOutlined onClick={() => seeDeleteModal(member)} />);
    }
    return actions;
  };

  useEffect(() => {
    getAdministration();
  }, [reload]);

  return (
    <Layout.Content>
      <Title level={2}>Провід округи</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {administration.length > 0 ? (
            administration.map((member: RegionAdmin) => (
              <Card
                key={member.id}
                className="detailsCard"
                title={extendedTitleTooltip(
                  adminTypeNameMaxLength,
                  `${member.adminType.adminTypeName}`
                )}
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                actions={getCardActions(member)}
              >
                <div
                  onClick={() =>
                    !activeUserRoles.includes(Roles.RegisteredUser)
                      ? history.push(`/userpage/main/${member.userId}`)
                      : undefined
                  }
                  className="cityMember"
                >
                  <div>
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar size={86} src={member.user.imagePath} />
                    )}
                    <Card.Meta
                      className="detailsMeta"
                      title={extendedTitleTooltip(
                        parameterMaxLength,
                        `${member.user.firstName} ${member.user.lastName}`
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає діловодів округи</Title>
          )}
        </div>
      )}
      <div className="cityMoreItems">
        <Button
          className="backButton"
          icon={<RollbackOutlined />}
          size={"large"}
          onClick={() => history.goBack()}
          type="primary"
        >
          Назад
        </Button>
      </div>

      <AddAdministratorModal
        admin={admin}
        setAdmin={setAdmin}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        regionId={+id}
        regionName={region}
        onAdd={onAdd}
      />
    </Layout.Content>
  );
};

export default RegionAdministration;
