import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout} from 'antd';
import {CloseOutlined, PlusOutlined, RollbackOutlined} from '@ant-design/icons';
import {getAllFollowers, removeFollower, toggleMemberStatus} from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import classes from './City.module.css';
import CityMember from '../../../models/City/CityMember';

const CityFollowers = () => {
    const {id} = useParams();
    const history = useHistory();

    const [followers, setFollowers] = useState<CityMember[]>([]);

    const getFollowers = async () => {
        const response = await getAllFollowers(id);

        await setPhotos(response.data);
        setFollowers(response.data);
    };

    const addMember = async (followerId: number) => {
        await toggleMemberStatus (followerId);
        setFollowers(followers.filter(u => u.id !== followerId));
    }

    const removeMember = async (followerId: number) => {
        await removeFollower(followerId);
        setFollowers(followers.filter(u => u.id !== followerId));
    }

    const setPhotos = async (members: CityMember[]) => {
      for (let i = 0; i < members.length; i++) {
        members[i].user.imagePath = (await userApi.getImage(members[i].user.imagePath)).data;
      }
    }

    useEffect(() => {
        getFollowers();
    }, []);

    return (
      <Layout.Content>
        <h1 className={classes.mainTitle}>Прихильники станиці</h1>
        <div className={classes.wrapper}>
          {followers.length > 0 ? (
            followers.map((follower: CityMember) => (
              <Card
                key={follower.id}
                className={classes.detailsCard}
                actions={[
                  <PlusOutlined onClick={() => addMember(follower.id)} />,
                  <CloseOutlined onClick={() => removeMember(follower.id)} />,
                ]}
              >
                <div
                  onClick={() => history.push(`/userpage/main/${follower.userId}`)}
                  className={classes.cityMember}
                >
                  <Avatar
                    size={86}
                    src={follower.user.imagePath}
                    className={classes.detailsIcon}
                  />
                  <Card.Meta
                    className={classes.detailsMeta}
                    title={`${follower.user.firstName} ${follower.user.lastName}`}
                  />
                </div>
              </Card>
            ))
          ) : (
            <h1>Ще немає прихильників станиці</h1>
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
    );
};
export default CityFollowers;
