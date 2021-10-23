import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Modal, Skeleton} from 'antd';
import {SettingOutlined, CloseOutlined, RollbackOutlined, ExclamationCircleOutlined} from '@ant-design/icons';
import { getAllAdmins, removeAdministrator, getUserClubAccess} from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import "./Club.less";
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
import ClubAdmin from '../../../models/Club/ClubAdmin';
import AddAdministratorModal from '../AddAdministratorModal/AddAdministratorModal';
import moment from "moment";
import "moment/locale/uk";
import Title from 'antd/lib/typography/Title';
import Spinner from '../../Spinner/Spinner';
import NotificationBoxApi from '../../../api/NotificationBoxApi';
import { Roles } from '../../../models/Roles/Roles';
import extendedTitleTooltip, { parameterMaxLength } from '../../../components/Tooltip';
moment.locale("uk-ua");

const adminTypeNameMaxLength = 22;
const ClubAdministration = () => {
    const {id} = useParams();
    const history = useHistory();

    const [administration, setAdministration] = useState<ClubAdmin[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const [clubName, setClubName] = useState<string>("");
    const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});
  
    const getAdministration = async () => {
      setLoading(true);
      await getUserAccessesForClubs();
      const response = await getAllAdmins(id);
        setPhotosLoading(true);
        setPhotos([...response.data.administration].filter(a => a != null));
        setAdministration([...response.data.administration].filter(a => a != null));
        console.log(administration)
        setClubName(response.data.name);
      setLoading(false);
    };

    const getUserAccessesForClubs = async () => {
      let user: any = jwt(AuthStore.getToken() as string);
      await getUserClubAccess(id,user.nameid).then(
        response => {
          setUserAccesses(response.data);
        }
      );
    }

    function seeDeleteModal(admin: ClubAdmin) {
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

    const removeAdmin = async (admin: ClubAdmin) => {
      await removeAdministrator(admin.id);
      setAdministration(administration.filter((u) => u.id !== admin.id));
      await createNotification(admin.userId, `На жаль, ви були позбавлені ролі: '${admin.adminType.adminTypeName}' в курені`);
    };

    const createNotification = async(userId : string, message : string) => {
      await NotificationBoxApi.createNotifications(
        [userId],
        message + ": ",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/clubs/${id}`,
        clubName
        );
    }

    const showModal = (member: ClubAdmin) => {
      setAdmin(member);

      setVisibleModal(true);
    };

    const setPhotos = async (members: ClubAdmin[]) => {
      for (let i of members) {
        i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
      }

      setPhotosLoading(false);
    };

    const onAdd = async (newAdmin: ClubAdmin = new ClubAdmin()) => {
      const index = administration.findIndex((a) => a.id === admin.id);
      administration[index] = newAdmin;
      await createNotification(newAdmin.userId, `Вам була присвоєна нова роль: '${newAdmin.adminType.adminTypeName}' в курені`);
      setAdministration(administration);
      setReload(!reload);
    };

    useEffect(() => {
        getAdministration();
    }, [reload]);

    return (
      <Layout.Content>
        <Title level={2}>Провід куреня</Title>
        {loading ? (
          <Spinner />
        ) : (
          <div className="clubMoreItems">
            {administration.length > 0 ? (
              administration.map((member: ClubAdmin) => (
                <Card
                  key={member.id}
                  className="detailsCard"
                  title={
                    extendedTitleTooltip(adminTypeNameMaxLength,`${member.adminType.adminTypeName}`)
                  }
                  headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                  actions={
                    userAccesses["EditClub"] && (userAccesses["AddClubHead"] || member.adminType.adminTypeName !== Roles.KurinHead)
                      ? [
                          <SettingOutlined onClick={() => showModal(member)} />,
                          <CloseOutlined onClick={() => seeDeleteModal(member)} />,
                        ]
                      : undefined
                  }
                >
                  <div
                    onClick={() =>
                      history.push(`/userpage/main/${member.userId}`)
                    }
                    className="clubMember"
                  >
                    <div>
                      {photosLoading ? (
                        <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                      ) : (
                        <Avatar size={86} src={member.user.imagePath} />
                      )}
                      <Card.Meta
                        className="detailsMeta"
                        title={
                          extendedTitleTooltip(parameterMaxLength,`${member.user.firstName} ${member.user.lastName}`)
                        }
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає діловодів куреня</Title>
            )}
          </div>
        )}
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
        {userAccesses["EditClub"]? (
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

export default ClubAdministration;
