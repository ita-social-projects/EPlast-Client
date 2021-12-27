import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Skeleton} from 'antd';
import {CloseOutlined, ExclamationCircleOutlined, PlusOutlined, RollbackOutlined} from '@ant-design/icons';
import {getAllFollowers, removeFollower, toggleMemberStatus, getUserClubAccess} from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import "./Club.less";
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
import ClubMember from '../../../models/Club/ClubMember';
import Title from 'antd/lib/typography/Title';
import Spinner from '../../Spinner/Spinner';
import NotificationBoxApi from '../../../api/NotificationBoxApi';
import { Modal } from 'antd';
import extendedTitleTooltip, {parameterMaxLength} from '../../../components/Tooltip';

const ClubFollowers = () => {
  const {id} = useParams();
  const history = useHistory();

  const [followers, setFollowers] = useState<ClubMember[]>([]);
  const [clubName, setClubName] = useState<string>("");
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeUserID, setActiveUserID] = useState<string>();
  const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});

  const getFollowers = async () => {
    setLoading(true);
    await getUserAccessesForClubs();
    const response = await getAllFollowers(id);

    setPhotosLoading(true);
    setPhotos(response.data.followers);
    setFollowers(response.data.followers);
    setClubName(response.data.name);
    setActiveUserID(userApi.getActiveUserId());
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

  function seeSkipModal(follower: ClubMember) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете покинути даний курінь?",
      icon: <ExclamationCircleOutlined />,
      okText: 'Так, покинути',
      okType: 'primary',
      cancelText: 'Скасувати',
      maskClosable: true,
      onOk() { removeMember(follower) }
    });
  }

  function seeDeleteModal(follower: ClubMember) {
    return Modal.confirm({
      title: `Ви впевнені, що хочете видалити ${follower.user.firstName} ${follower.user.lastName} із прихильників?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Так, видалити',
      okType: 'primary',
      cancelText: 'Скасувати',
      maskClosable: true,
      onOk() { removeMember(follower) }
    });
  }

    const createNotification = async(userId : string, message : string) => {
      await NotificationBoxApi.createNotifications(
        [userId],
        message + ": ",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/clubs/${id}`,
        clubName
        );
    }

    const addMember = async (follower: ClubMember) => {
        setFollowers(followers.filter(u => u.id !== follower.id));
        await toggleMemberStatus (follower.id);
        await createNotification(follower.userId, "Вітаємо, вас зараховано до членів куреня");
    }

    const removeMember = async (follower: ClubMember) => {
        setFollowers(followers.filter(u => u.id !== follower.id));
        await removeFollower(follower.id);
        await createNotification(follower.userId, "На жаль, ви були виключені з прихильників куреня");
    }

    const setPhotos = async (members: ClubMember[]) => {
      for (let i of members) {
        i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
      }
      
      setPhotosLoading(false);
    }

    useEffect(() => {
      getFollowers();
    }, []);

    return (
      <Layout.Content>
        <Title level={2}>Прихильники куреня</Title>
        {loading ? (
          <Spinner />
        ) : (
          <div className="clubMoreItems">
            {followers.length > 0 ? (    
              followers.map((follower: ClubMember) => (
                <Card
                  key={follower.id}
                  className="detailsCard"
                  actions={
                    userAccesses["EditClub"] ?
                      [
                        <PlusOutlined
                          onClick={() => addMember(follower)}
                        />,
                        <CloseOutlined
                          onClick={() => seeDeleteModal(follower)}
                        />,
                      ]
                      : (follower.userId === activeUserID) ?
                        [
                          <CloseOutlined
                            onClick={() => seeSkipModal(follower)}
                          />
                        ] : undefined
                  }
                >
                  <div
                    onClick={() =>
                      history.push(`/userpage/main/${follower.userId}`)
                    }
                    className="clubMember"
                  >
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar
                        size={86}
                        src={follower.user.imagePath}
                        className="detailsIcon"
                      />
                    )}
                    <Card.Meta
                      className="detailsMeta"
                      title={
                        extendedTitleTooltip(parameterMaxLength, `${follower.user.firstName} ${follower.user.lastName}`)
                      }
                    />
                  </div>
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає прихильників куреня</Title>
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
      </Layout.Content>
    );
};

export default ClubFollowers;
