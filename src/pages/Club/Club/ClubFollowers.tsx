import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Avatar, Card, Layout, Skeleton, Spin, Button } from "antd";
import {
  CloseOutlined,
  PlusOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import classes from "./Club.module.css";
import clubsApi from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import ClubMember from '../../../models/Club/ClubMember';

const ClubFollowers = () => {
  const { id } = useParams();
  const history = useHistory();

  const [followers, setFollowers] = useState<ClubMember[]>([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [isCurrentUserAdmin, setIsAdmin] = useState(false);
  const [isCurrentUserClubAdmin, setIsClubAdmin] = useState(false);
  const [canCurrentUserJoin, setCanJoin] = useState(false);
  const [loading, setLoading] = useState(false);

  const getFollowers = async () => {
    setLoading(true);
    const response = await clubsApi.getAllFollowers(id);

    setPhotosLoading(true);
    setPhotos(response.data.followers);
    setFollowers(response.data.followers);
    setIsAdmin(response.data.isCurrentUserAdmin);
    setIsClubAdmin(response.data.isCurrentUserClubAdmin);
    setCanJoin(response.data.canJoin);
    setLoading(false);
  };

  useEffect(() => {
    getFollowers();
  }, []);

  const setPhotos = async (members: ClubMember[]) => {
    for (let i = 0; i < members.length; i++) {
      members[i].user.imagePath = (await userApi.getImage(members[i].user.imagePath)).data;
    }
    setPhotosLoading(false);
  }

  const addMember = async (clubId: number, followerId: number) => {
    await clubsApi.toggleMemberStatus(clubId, followerId);
    setFollowers(followers.filter(u => u.id !== followerId));
  }

  const removeMember = async (followerId: number) => {
    await clubsApi.removeMember(followerId);
    setFollowers(followers.filter(u => u.id !== followerId));
  }

  return loading ? (
      <Layout.Content className={classes.spiner}>
        <Spin size="large" />
      </Layout.Content>
    ) : (
      <Layout.Content>
        <h1 className={classes.mainTitle}>Прихильники куреня</h1>
        <div className={classes.wrapper}>
          { followers.length > 0 ? (
            followers.map((follower: ClubMember) => (
              <Card
                key={follower.id}
                className={classes.detailsCard}
                actions={
                  (isCurrentUserClubAdmin || isCurrentUserAdmin)
                    ? [
                        <PlusOutlined onClick={() => addMember(id, follower.id)} />,
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
                  className={classes.clubMember}
                >
                  {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar
                        size={86}
                        src={follower.user.imagePath}
                        className={classes.detailsIcon}
                      /> 
                    )}
                  <Card.Meta
                    className={classes.detailsMeta}
                    title={`${follower.user.firstName} ${follower.user.lastName}`}
                  />
                </div>
              </Card>
            ))
            ) : (
              <h1>Ще немає прихильників куреня</h1>
            )}
        </div>
        <div className={classes.wrapper}>
        <Button
            className={classes.backButton}
            icon={<RollbackOutlined />}
            size={"large"}
            onClick={() => history.goBack()}
            type="primary"
        >
            Назад
        </Button>
        </div>
      </Layout.Content>
    )
};
export default ClubFollowers;
