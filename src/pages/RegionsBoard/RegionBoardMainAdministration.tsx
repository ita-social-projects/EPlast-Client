import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Skeleton } from "antd";
import {
  CloseOutlined,
  ExclamationCircleOutlined,
  RollbackOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import "../Regions/Region.less";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import {
  getGoverningBodiesAdmins,
  removeMainAdministrator,
} from "../../api/governingBodiesApi";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../components/Tooltip";
import GoverningBodyAdmin from "../../models/GoverningBody/GoverningBodyAdmin";
import userApi from "../../api/UserApi";
import EditAdministratorModal from "./EditAdministratorModal";
import { Roles } from "../../models/Roles/Roles";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import notificationLogic from "../../components/Notifications/Notification";

moment.locale("uk-ua");

const adminTypeNameMaxLength = 23;
const RegionBoardMainAdministration = () => {
  const history = useHistory();

  const [governingBodiesAdmins, setGoverningBodiesAdmins] = useState<
    GoverningBodyAdmin[]
  >([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedAdmin, setSelectedAdmin] = useState<GoverningBodyAdmin>(
    new GoverningBodyAdmin()
  );
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);

  const setPhotos = async (admins: GoverningBodyAdmin[]) => {
    for (let i of admins) {
      i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
    }
    setPhotosLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const responseAdmins = (await getGoverningBodiesAdmins()).data;
      setGoverningBodiesAdmins(responseAdmins);
      setPhotosLoading(true);
      setPhotos(responseAdmins);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (userId: Array<string>, message: string) => {
    await NotificationBoxApi.createNotifications(
      userId,
      `${message}: `,
      NotificationBoxApi.NotificationTypes.UserNotifications
    );
  };

  const removeMember = async (admin: GoverningBodyAdmin) => {
    await removeMainAdministrator(admin.userId);
    notificationLogic("success", "Адміністратора успішно видалено");

    await createNotification(
      [admin.userId],
      `У Вас більше немає адміністративної ролі: '${
        admin.governingBodyAdminRole
          ? admin.governingBodyAdminRole
          : admin.adminType.adminTypeName
      }' `
    );
    fetchData();
  };

  function seeDeleteModal(admin: GoverningBodyAdmin) {
    return Modal.confirm({
      title:
        "Ви впевнені, що хочете видалити даного користувача із адміністрації Крайового Проводу?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        removeMember(admin);
      },
    });
  }
  const showModal = (admin: GoverningBodyAdmin) => {
    setSelectedAdmin(admin);
    setVisibleModal(true);
  };

  useEffect(() => {
    fetchData();
    const userRoles = userApi.getActiveUserRoles();
    setActiveUserRoles(userRoles);
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>Адміністрація Крайового Проводу</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {governingBodiesAdmins.length > 0 ? (
            governingBodiesAdmins.map((admin) => (
              <Card
                key={admin.id}
                className="detailsCard"
                title={extendedTitleTooltip(
                  adminTypeNameMaxLength,
                  admin.governingBodyAdminRole
                    ? `${admin.governingBodyAdminRole}`
                    : `${admin.adminType.adminTypeName}`
                )}
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                actions={
                  activeUserRoles.includes(Roles.Admin) ||
                  activeUserRoles.includes(Roles.GoverningBodyAdmin)
                    ? [
                        <SettingOutlined onClick={() => showModal(admin)} />,
                        <CloseOutlined onClick={() => seeDeleteModal(admin)} />,
                      ]
                    : undefined
                }
              >
                <div className="cityMember">
                  <div
                    onClick={() =>
                      history.push(`/userpage/main/${admin.userId}`)
                    }
                  >
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86} />
                    ) : (
                      <Avatar size={86} src={admin.user.imagePath} />
                    )}
                    <Card.Meta
                      className="detailsMeta"
                      title={extendedTitleTooltip(
                        parameterMaxLength,
                        `${admin.user.firstName} ${admin.user.lastName}`
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає адміністрації Крайового Проводу</Title>
          )}
        </div>
      )}
      <div className="cityMoreItems">
        <Button
          className="backButton"
          icon={<RollbackOutlined />}
          size="large"
          onClick={() => history.goBack()}
          type="primary"
        >
          Назад
        </Button>
      </div>
      <EditAdministratorModal
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        admin={selectedAdmin}
      />
    </Layout.Content>
  );
};

export default RegionBoardMainAdministration;
