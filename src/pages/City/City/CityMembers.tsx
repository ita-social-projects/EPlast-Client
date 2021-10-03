import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Row, Skeleton, Spin, } from "antd";
import { SettingOutlined, CloseOutlined, RollbackOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { removeAdministrator, getAllAdmins, getAllMembers, toggleMemberStatus } from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import "./City.less";
import CityMember from "../../../models/City/CityMember";
import CityAdmin from "../../../models/City/CityAdmin";
import AddAdministratorModal from "../AddAdministratorModal/AddAdministratorModal";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import { Roles } from "../../../models/Roles/Roles";
import extendedTitleTooltip, {parameterMaxLength} from "../../../components/Tooltip";
moment.locale("uk-ua");

const CityMembers = () => {
  const {id} = useParams();
  const history = useHistory();

  const [members, setMembers] = useState<CityMember[]>([]);
  const [admins, setAdmins] = useState<CityAdmin[]>([]);
  const [head, setHead] = useState<CityAdmin>(new CityAdmin());
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
  const [canEdit, setCanEdit] = useState<Boolean>(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [cityName, setCityName] = useState<string>("");
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  
  const getMembers = async () => {
    setLoading(true);
    const responseMembers = await getAllMembers(id);

    setPhotosLoading(true);
    setPhotos(responseMembers.data.members);
    setMembers(responseMembers.data.members);
    setCanEdit(responseMembers.data.canEdit);
    setCityName(responseMembers.data.name);
    setActiveUserRoles(userApi.getActiveUserRoles);

    const responseAdmins = await getAllAdmins(id);
    setAdmins(responseAdmins.data.administration);
    setHead(responseAdmins.data.head);
    const userRoles = userApi.getActiveUserRoles();
      setActiveUserRoles(userRoles);
    setLoading(false);
  };

  function seeDeleteModal(admin: CityMember) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити даного користувача із членів Станиці?",
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

  const removeMember = async (member: CityMember) => {
    await toggleMemberStatus(member.id);

    const existingAdmin = [head, ...admins].filter(
      (a) =>
        a?.userId === member.userId &&
        (moment(a?.endDate).isAfter(moment()) || a?.endDate === null)
    );

    for (let i of existingAdmin) {
      await removeAdministrator(i.id);
    }
    await createNotification([member.userId], "На жаль, ви були виключені з членів станиці");
    setMembers(members.filter((u) => u.id !== member.id));
  };

  const createNotification = async(userId : Array<string>, message : string) => {
    await NotificationBoxApi.createNotifications(
      userId,
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${id}`,
      cityName
      );
  }

  const onAdd = async (admin? : CityAdmin) => {
    const responseAdmins = await getAllAdmins(id);
    setAdmins(responseAdmins.data.administration);
    setHead(responseAdmins.data.head); 
    if(admin){
      await createNotification([admin.userId], `Вам була присвоєна нова роль: '${admin.adminType.adminTypeName}' в станиці`);
    }
  }

  const showModal = (member: CityMember) => {    
    const existingAdmin = [head, ...admins].find((a) => a?.userId === member.userId);
    
    if (existingAdmin !== undefined) {
      setAdmin(existingAdmin);
    }
    else {
      setAdmin({
        ...(new CityAdmin()),
        userId: member.user.id,
        cityId: member.cityId,
      });
    }

    setVisibleModal(true);
  };

  const setPhotos = async (members: CityMember[]) => {
    for (let i of members) {
      i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
    }

    setPhotosLoading(false);
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>
        Члени станиці
      </Title>
      {loading ? (
          <Spinner />
        ) : (
      <div className="cityMoreItems">
        {members.length > 0 ? (
          members.map((member: CityMember) => (
            <Card
              key={member.id}
              className="detailsCard"
              actions={
                canEdit && (member?.user.id !== head?.user.id || !activeUserRoles.includes(Roles.CityHeadDeputy))
                  ? [
                      <SettingOutlined onClick={() => showModal(member)} />,
                      <CloseOutlined onClick={() => seeDeleteModal(member)} />,
                    ]
                  : undefined
              }
            >
              <div
                onClick={() => canEdit || (activeUserRoles.includes(Roles.Supporter) || activeUserRoles.includes(Roles.PlastMember)) 
                  ? history.push(`/userpage/main/${member.userId}`) 
                  : undefined
                }
                className="cityMember"
              >
                {photosLoading ? (
                  <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                ) : (
                  <Avatar
                    size={86}
                    src={member.user.imagePath}
                    className="detailsIcon"
                  />
                )}
                <Card.Meta
                  className="detailsMeta"
                  title={
                    extendedTitleTooltip(parameterMaxLength, `${member.user.firstName} ${member.user.lastName}`)
                  }
                />
              </div>
            </Card>
          ))
        ) : (
          <Title level={4}>
            Ще немає членів станиці
          </Title>
        )}
      </div>)}
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
      {canEdit ? (
        <AddAdministratorModal
          admin={admin}
          setAdmin={setAdmin}
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          cityId={+id}
          cityName={cityName}
          onAdd={onAdd}
        ></AddAdministratorModal>
      ) : null}
    </Layout.Content>
  );
};

export default CityMembers;
