import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Skeleton, Spin} from 'antd';
import {CloseOutlined, PlusOutlined, RollbackOutlined} from '@ant-design/icons';
import {
  getRegionFollowers, 
  getRegionAdministration, 
  getRegionById, removeFollower, 
} from "../../api/regionsApi";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import userApi from "../../api/UserApi";
import "./Region.less";
import RegionFollower from '../../models/Region/RegionFollower';
import Title from 'antd/lib/typography/Title';
import Spinner from '../Spinner/Spinner';
import NotificationBoxApi from '../../api/NotificationBoxApi';
import { Roles } from '../../models/Roles/Roles';

const RegionFollowers = () => {
    const {id} = useParams();
    const history = useHistory();

    const [loading, setLoading] = useState<boolean>(false);
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [regionName, setRegionName] = useState<string>("");
    const [followers, setFollowers] = useState<RegionFollower[]>([]);
    const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
    const [isActiveUserRegionAdmin, setIsActiveUserRegionAdmin] = useState<boolean>(false);

    const getFollowers = async () => {
      setLoading(true);
      const response = await getRegionById(id)
      const response1 = await getRegionFollowers(id);
      const response2 = await getRegionAdministration(id);

      setRegionName(response.data.name);
      setFollowers(response1.data);
      setActiveUserRoles(userApi.getActiveUserRoles);
      setIsRegionAdmin(response2.data, userApi.getActiveUserId());
      setPhotosLoading(true);
      setPhotos(response1.data);
      setLoading(false);
    };

    const setIsRegionAdmin = (admins: any[], userId: string) => {
        for(let i = 0; i < admins.length; i++){
          if(admins[i].userId == userId){
            setIsActiveUserRegionAdmin(true);
            return;
          }
        }
      }    

    const setPhotos = (followers: RegionFollower[]) => {
      for(let i = 0; i < followers.length; i++) {
        if (followers[i].logo === null) {
          followers[i].logo = CityDefaultLogo;
        }
      }

      setPhotosLoading(false);
    }
    
    //const createNotification = async(userId : string, message : string) => {
    //  await NotificationBoxApi.createNotifications(
    //    [userId],
    //    message + ": ",
    //    NotificationBoxApi.NotificationTypes.UserNotifications,
    //    `/regions/${id}`,
    //    regionName
    //    );
    //}

    const deleteFollower = async (follower: RegionFollower) => {
      await removeFollower(follower.id);
      //await createNotification(follower.userId, `Нажаль, вашу заяву на створення станиці ${follower.cityName} відхилено. Для з'ясування причин відмови зверніться до голови округу`);
      setFollowers(followers.filter(u => u.id !== follower.id));
    }

    useEffect(() => {
        getFollowers();
    }, []);

    return (
      <Layout.Content>
        <Title level={2}>Прихильники округи</Title>
        {loading ? (
          <Spinner />
        ) : (
          <div className="cityMoreItems">
            {followers.length > 0 ? (
              followers.map((follower: RegionFollower) => (
                <Card
                  key={follower.id}
                  className="detailsCard"
                  actions={
                    activeUserRoles.includes(Roles.Admin) 
                    || ((activeUserRoles.includes(Roles.OkrugaHead) || activeUserRoles.includes(Roles.OkrugaHeadDeputy)) 
                        && isActiveUserRegionAdmin)   
                    ? [
                        <CloseOutlined
                          onClick={() => deleteFollower(follower)}
                        />,
                    ] : undefined
                  }
                >
                  <div
                    onClick={() => 
                        activeUserRoles.includes(Roles.Admin) 
                        || ((activeUserRoles.includes(Roles.OkrugaHead) || activeUserRoles.includes(Roles.OkrugaHeadDeputy)) 
                            && isActiveUserRegionAdmin)   
                        ? history.push(`/regions/follower/edit/${follower.id}`)
                        : undefined
                    }
                    className="cityMember"
                  >
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar
                        size={86}
                        src={follower.logo}
                        className="detailsIcon"
                      />
                    )}
                    <Card.Meta
                      className="detailsMeta"
                      title={`${follower.cityName}`}
                    />
                  </div>
                </Card>
              ))
            ) : (
              <Title level={4}>Ще немає прихильників округи</Title>
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

export default RegionFollowers;