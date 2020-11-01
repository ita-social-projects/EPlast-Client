import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Skeleton, Spin} from 'antd';
import {SettingOutlined, CloseOutlined, RollbackOutlined} from '@ant-design/icons';
import { getAllAdmins, removeAdministrator} from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import "./Club.less";
import ClubAdmin from '../../../models/Club/ClubAdmin';
import AddAdministratorModal from '../AddAdministratorModal/AddAdministratorModal';
import moment from "moment";
import "moment/locale/uk";
import Title from 'antd/lib/typography/Title';
import Spinner from '../../Spinner/Spinner';
import NotificationBoxApi from '../../../api/NotificationBoxApi';
moment.locale("uk-ua");

const ClubAdministration = () => {
    const {id} = useParams();
    const history = useHistory();

    const [administration, setAdministration] = useState<ClubAdmin[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [clubName, setClubName] = useState<string>("");
  
    const getAdministration = async () => {
      setLoading(true);
      const response = await getAllAdmins(id);
        setPhotosLoading(true);
        setPhotos([...response.data.administration, response.data.head].filter(a => a != null));
        setAdministration([...response.data.administration, response.data.head].filter(a => a != null));
        setCanEdit(response.data.canEdit);
        setClubName(response.data.name);
      setLoading(false);
    };

    const removeAdmin = async (admin: ClubAdmin) => {
      await removeAdministrator(admin.id);
      setAdministration(administration.filter((u) => u.id !== admin.id));
      await createNotification(admin.userId, `На жаль, ви були позбавлені ролі '${admin.adminType.adminTypeName}' в курені`);
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
    };

    useEffect(() => {
        getAdministration();
    }, []);

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
                  title={`${member.adminType.adminTypeName}`}
                  headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                  actions={
                    canEdit
                      ? [
                          <SettingOutlined onClick={() => showModal(member)} />,
                          <CloseOutlined
                            onClick={() => removeAdmin(member)}
                          />,
                        ]
                      : undefined
                  }
                >
                  <div
                    onClick={() =>
                      history.push(`/userpage/main/${member.userId}`)
                    }
                    className="ClubMember"
                  >
                    <div>
                      {photosLoading ? (
                        <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                      ) : (
                        <Avatar size={86} src={member.user.imagePath} />
                      )}
                      <Card.Meta
                        className="detailsMeta"
                        title={`${member.user.firstName} ${member.user.lastName}`}
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
        {canEdit ? (
          <AddAdministratorModal
            admin={admin}
            setAdmin={setAdmin}
            visibleModal={visibleModal}
            setVisibleModal={setVisibleModal}
            clubId={+id}
            onAdd={onAdd}
          ></AddAdministratorModal>
        ) : null}
      </Layout.Content>
    );
};

export default ClubAdministration;
