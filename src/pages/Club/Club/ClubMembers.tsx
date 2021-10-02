import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Skeleton, } from "antd";
import { SettingOutlined, CloseOutlined, RollbackOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { removeAdministrator, getAllAdmins, getAllMembers, toggleMemberStatus } from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import "./Club.less";
import ClubMember from "../../../models/Club/ClubMember";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import AddAdministratorModal from "../AddAdministratorModal/AddAdministratorModal";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import { Roles } from "../../../models/Roles/Roles";
import extendedTitleTooltip from "../../../components/Tooltip";
moment.locale("uk-ua");

const namesMaxLegth = 22;
const ClubMembers = () => {
  const {id} = useParams();
  const history = useHistory();

  const [members, setMembers] = useState<ClubMember[]>([]);
  const [admins, setAdmins] = useState<ClubAdmin[]>([]);
  const [head, setHead] = useState<ClubAdmin>(new ClubAdmin());
  const [clubName, setClubName] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
  const [canEdit, setCanEdit] = useState<Boolean>(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  
  const getMembers = async () => {
    setLoading(true);
    const responseMembers = await getAllMembers(id);

    setPhotosLoading(true);
    setPhotos(responseMembers.data.members);
    setMembers(responseMembers.data.members);
    setCanEdit(responseMembers.data.canEdit);
    setClubName(responseMembers.data.name);

    const responseAdmins = await getAllAdmins(id);
    setAdmins(responseAdmins.data.administration);
    setHead(responseAdmins.data.head);
    const userRoles = userApi.getActiveUserRoles();
      setActiveUserRoles(userRoles);
    setLoading(false);
  };

  function seeDeleteModal(admin: ClubMember) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити даного користувача із членів Куреня?",
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

  const removeMember = async (member: ClubMember) => {
    await toggleMemberStatus(member.id);

    const existingAdmin = [head, ...admins].filter(
      (a) =>
        a?.userId === member.userId &&
        (moment(a?.endDate).isAfter(moment()) || a?.endDate === null)
    );

    for (let i of existingAdmin) {
      await removeAdministrator(i.id);
    }
    await createNotification([member.userId], "На жаль, ви були виключені з членів куреня");
    setMembers(members.filter((u) => u.id !== member.id));
  };

  const createNotification = async(userId : Array<string>, message : string) => {
    await NotificationBoxApi.createNotifications(
      userId,
      message + ": ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/clubs/${id}`,
      clubName
      );
  }

  const onAdd = async (admin? : ClubAdmin) => {
    const responseAdmins = await getAllAdmins(id);
    setAdmins(responseAdmins.data.administration);
    setHead(responseAdmins.data.head);
    if(admin){
      await createNotification([admin.userId], `Вам була присвоєна нова роль: '${admin.adminType.adminTypeName}' в курені`);
    }
  }

  const showModal = (member: ClubMember) => {    
    const existingAdmin = [head, ...admins].find((a) => a?.userId === member.userId);
    
    if (existingAdmin !== undefined) {
      setAdmin(existingAdmin);
    }
    else {
      setAdmin({
        ...(new ClubAdmin()),
        userId: member.user.id,
        clubId: member.ClubId,
      });
    }

    setVisibleModal(true);
  };

  const setPhotos = async (members: ClubMember[]) => {
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
        Члени куреня
      </Title>
      {loading ? (
          <Spinner />
        ) : (
      <div className="clubMoreItems">
        {members.length > 0 ? (
          members.map((member: ClubMember) => (
            <Card
              key={member.id}
              className="detailsCard"
              actions={

                canEdit && (member?.user?.id !== head?.user?.id || !activeUserRoles.includes(Roles.KurinHeadDeputy))
                  ? [
                      <SettingOutlined onClick={() => showModal(member)} />,
                      <CloseOutlined onClick={() => seeDeleteModal(member)} />,
                    ]
                  : undefined
              }
            >
              <div
                onClick={() => history.push(`/userpage/main/${member.userId}`)}
                className="clubMember"
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
                    extendedTitleTooltip(namesMaxLegth, `${member.user.firstName} ${member.user.lastName}`)
                  }
                />
              </div>
            </Card>
          ))
        ) : (
          <Title level={4}>
            Ще немає членів куреня
          </Title>
        )}
      </div>)}
      <div className="clubMoreItems">
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
          clubId={+id}
          clubName={clubName}
          onAdd={onAdd}
        ></AddAdministratorModal>
      ) : null}
    </Layout.Content>
  );
};

export default ClubMembers;
