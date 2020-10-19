import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Skeleton, Spin} from 'antd';
import {CloseOutlined, PlusOutlined, RollbackOutlined} from '@ant-design/icons';
import {getAllFollowers, removeFollower, toggleMemberStatus} from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import "./Club.less";
import ClubMember from '../../../models/Club/ClubMember';
import Title from 'antd/lib/typography/Title';
import Spinner from '../../Spinner/Spinner';

const ClubFollowers = () => {
    const {id} = useParams();
    const history = useHistory();

    const [followers, setFollowers] = useState<ClubMember[]>([]);
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const getFollowers = async () => {
      setLoading(true);
      const response = await getAllFollowers(id);

      setPhotosLoading(true);
      setPhotos(response.data.followers);
      setFollowers(response.data.followers);
      setCanEdit(response.data.canEdit);
      setLoading(false);
    };

    const addMember = async (followerId: number) => {
        await toggleMemberStatus (followerId);
        setFollowers(followers.filter(u => u.id !== followerId));
    }

    const removeMember = async (followerId: number) => {
        await removeFollower(followerId);
        setFollowers(followers.filter(u => u.id !== followerId));
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
          <div className="ClubMoreItems">
            {followers.length > 0 ? (
              followers.map((follower: ClubMember) => (
                <Card
                  key={follower.id}
                  className="detailsCard"
                  actions={
                    canEdit
                      ? [
                          <PlusOutlined
                            onClick={() => addMember(follower.id)}
                          />,
                          <CloseOutlined
                            onClick={() => removeMember(follower.id)}
                          />,
                        ]
                      : undefined
                  }
                >
                  <div
                    onClick={() =>
                      history.push(`/userpage/main/${follower.userId}`)
                    }
                    className="ClubMember"
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
              <Title level={4}>Ще немає прихильників куреня</Title>
            )}
          </div>
        )}
        <div className="ClubMoreItems">
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
