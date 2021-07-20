import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Modal, Skeleton, Spin} from 'antd';
import {CloseOutlined, ExclamationCircleOutlined, PlusOutlined, RollbackOutlined} from '@ant-design/icons';
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
      const regionResponse = await getRegionById(id)
      const regionFollowersResp = await getRegionFollowers(id);
      const regionAdministrationResp = await getRegionAdministration(id);

      setRegionName(regionResponse.data.name);
      setFollowers(regionFollowersResp.data);
      setActiveUserRoles(userApi.getActiveUserRoles);
      setIsRegionAdmin(regionAdministrationResp.data, userApi.getActiveUserId());
      setPhotosLoading(true);
      setPhotos(regionFollowersResp.data);
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
    
    const deleteFollower = async (follower: RegionFollower) => {
      await removeFollower(follower.id);
      setFollowers(followers.filter(u => u.id !== follower.id));
    }

    function seeDeleteFollowerModal(regionFollower: RegionFollower) {
      return Modal.confirm({
        title: "Ви впевнені, що хочете відхилити заяву?",
        icon: <ExclamationCircleOutlined />,
        okText: "Так, відхилити",
        okType: "danger",
        cancelText: "Скасувати",
        maskClosable: true,
        onOk() {
          {
            deleteFollower(regionFollower);
          }
        },
      });
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
                          onClick={() => seeDeleteFollowerModal(follower)}
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