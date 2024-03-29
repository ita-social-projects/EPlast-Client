import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Skeleton, Tooltip } from "antd";
import {
  EditOutlined,
  CloseOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  getAllAdmins,
  getCityById,
  getUserCityAccess,
  removeAdministrator,
} from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import "./City.less";
import CityAdmin from "../../../models/City/CityAdmin";
import AddAdministratorModal from "../AddAdministratorModal/AddAdministratorModal";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import { Roles } from "../../../models/Roles/Roles";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../../components/Tooltip";
import AuthLocalStorage from "../../../AuthLocalStorage";
import jwt from "jwt-decode";
moment.locale("uk-ua");

const adminTypeNameMaxLength = 23;
const CityAdministration = () => {
  const { id } = useParams();
  const history = useHistory();

  const [administration, setAdministration] = useState<CityAdmin[]>([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [reload, setReload] = useState<boolean>(false);
  const [userCityAccesses, setUserCityAccesses] = useState<{
    [key: string]: boolean;
  }>({});
  const [isActiveUserCityAdmin, setIsActiveUserCityAdmin] = useState<boolean>(
    false
  );
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);

  const getUserAccessesForCities = async () => {
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    await getUserCityAccess(+id, user.nameid).then((response) => {
      setUserCityAccesses(response.data);
    });
  };

  const setIsCityAdmin = (admin: any[], userId: string) => {
    for (let i = 0; i < admin.length; i++) {
      if (admin[i].userId == userId) {
        setIsActiveUserCityAdmin(true);
      }
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const responseCity = await getCityById(id);
    const responseAdmins = await getAllAdmins(id);
    await getUserAccessesForCities();
    setIsCityAdmin(
      [...responseAdmins.data.administration],
      userApi.getActiveUserId()
    );
    setPhotosLoading(true);
    setPhotos([...responseAdmins.data.administration].filter((a) => a != null));
    setAdministration(
      [...responseAdmins.data.administration].filter((a) => a != null)
    );
    setCityName(responseCity.data.name);
    setActiveUserRoles(userApi.getActiveUserRoles());
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
        removeAdmin(admin);
      },
    });
  }
  const removeAdmin = async (admin: CityAdmin) => {
    await removeAdministrator(admin.id);
    setAdministration(administration.filter((u) => u.id !== admin.id));
    await createNotification(
      admin.userId,
      `На жаль, ви були позбавлені ролі: '${admin.adminType.adminTypeName}' в станиці`,
      true
    );
  };

  const createNotification = async (userId: string, message: string, mustLogOut?: boolean) => {
    await NotificationBoxApi.createNotifications(
      [userId],
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${id}`,
      cityName,
      mustLogOut
    );
  };

  const showModal = (member: CityAdmin) => {
    setAdmin(member);

    setVisibleModal(true);
  };

  const setPhotos = async (members: CityAdmin[]) => {
    for (let i of members) {
      i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
    }

    setPhotosLoading(false);
  };

  const onAdd = async (newAdmin: CityAdmin = new CityAdmin()) => {
    const previousAdmin = administration.find(a => a.id === admin.id)!; 
    const adminIdx = administration.findIndex(a => a.id === admin.id);
    administration[adminIdx] = newAdmin;
    if (previousAdmin.adminType.adminTypeName !== newAdmin.adminType.adminTypeName) {
      await createNotification(
        previousAdmin.userId,
        `Ви були позбавлені ролі: '${previousAdmin.adminType.adminTypeName}' в станиці`
      );
    }
    await createNotification(
      newAdmin.userId,
      `Вам була присвоєна нова роль: '${newAdmin.adminType.adminTypeName}' в станиці`,
      true
    );
    setAdministration(administration);
    setReload(!reload);
  };

  const getCardActions = (member: CityAdmin) => {
    if (userCityAccesses["EditCity"] &&
       (userCityAccesses["AddCityHead"] || member.adminType.adminTypeName !== Roles.CityHead)) {
      const actions: JSX.Element[] = [];
      if (member.adminType.adminTypeName !== Roles.CityHead) {
        actions.push(
          <Tooltip title="Редагувати">
            <EditOutlined onClick={() => showModal(member)} />
          </Tooltip>
        );
      }
      actions.push(
        <Tooltip title="Видалити">
          <CloseOutlined onClick={() => seeDeleteModal(member)} />
        </Tooltip>
      );
      return actions;
    }
    return undefined;
  }

  useEffect(() => {
    fetchData();
  }, [reload]);

  const canSeeProfiles =
    activeUserRoles.includes(Roles.Supporter) ||
    activeUserRoles.includes(Roles.PlastMember);

  return (
    <Layout.Content>
      <Title level={2}>Провід станиці</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {administration.length > 0 ? (
            administration.map((member: CityAdmin) => (
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
                    canSeeProfiles && 
                    history.push(`/userpage/main/${member.user.id}`)
                  }
                  className={`cityMember ${!canSeeProfiles && "notAccess"}`}
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
            <Title level={4}>Ще немає діловодів станиці</Title>
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
        cityId={+id}
        cityName={cityName}
        onAdd={onAdd}
      ></AddAdministratorModal>

    </Layout.Content>
  );
};

export default CityAdministration;
