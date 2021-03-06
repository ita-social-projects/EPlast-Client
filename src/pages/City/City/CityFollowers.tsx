import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Skeleton, Spin} from 'antd';
import {CloseOutlined, PlusOutlined, RollbackOutlined} from '@ant-design/icons';
import {getAllFollowers, removeFollower, toggleMemberStatus} from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import "./City.less";
import CityMember from '../../../models/City/CityMember';
import Title from 'antd/lib/typography/Title';
import Spinner from '../../Spinner/Spinner';
import NotificationBoxApi from '../../../api/NotificationBoxApi';

const CityFollowers = () => {
    const {id} = useParams();
    const history = useHistory();

    const [followers, setFollowers] = useState<CityMember[]>([]);
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [cityName, setCityName] = useState<string>("");

    const getFollowers = async () => {
      setLoading(true);
      const response = await getAllFollowers(id);

      setPhotosLoading(true);
      setPhotos(response.data.followers);
      setFollowers(response.data.followers);
      setCanEdit(response.data.canEdit);
      setCityName(response.data.name);
      setLoading(false);
    };

    const createNotification = async(userId : string, message : string) => {
      await NotificationBoxApi.createNotifications(
        [userId],
        message + ": ",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/cities/${id}`,
        cityName
        );
    }

    const addMember = async (follower: CityMember) => {
        await toggleMemberStatus (follower.id);
        await createNotification(follower.userId, "Вітаємо, вас зараховано до членів станиці");
        setFollowers(followers.filter(u => u.id !== follower.id));
    }

    const removeMember = async (follower: CityMember) => {
        await removeFollower(follower.id);
        await createNotification(follower.userId, "На жаль, ви були виключені з прихильників станиці");
        setFollowers(followers.filter(u => u.id !== follower.id));
    }

    const setPhotos = async (members: CityMember[]) => {
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
        <Title level={2}>Прихильники станиці</Title>
        {loading ? (
          <Spinner />
        ) : (
          <div className="cityMoreItems">
            {followers.length > 0 ? (
              followers.map((follower: CityMember) => (
                <Card
                  key={follower.id}
                  className="detailsCard"
                  actions={
                    canEdit
                      ? [
                          <PlusOutlined
                            onClick={() => addMember(follower)}
                          />,
                          <CloseOutlined
                            onClick={() => removeMember(follower)}
                          />,
                        ]
                      : undefined
                  }
                >
                  <div
                    onClick={() =>
                      history.push(`/userpage/main/${follower.userId}`)
                    }
                    className="cityMember"
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
                      title={`${follower.user.firstName} ${follower.user.lastName}`}
                    />
                  </div>
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає прихильників станиці</Title>
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
      </Layout.Content>
    );
};

export default CityFollowers;
