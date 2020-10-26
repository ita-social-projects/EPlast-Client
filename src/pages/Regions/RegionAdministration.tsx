import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Skeleton, Spin} from 'antd';
import {SettingOutlined, CloseOutlined, RollbackOutlined} from '@ant-design/icons';
import { getRegionAdministration, removeAdmin} from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import "./Region.less";
import moment from "moment";
import "moment/locale/uk";
import Title from 'antd/lib/typography/Title';
import Spinner from '../Spinner/Spinner';
import AddAdministratorModal from '../City/AddAdministratorModal/AddAdministratorModal';
import CityAdmin from '../../models/City/CityAdmin';
moment.locale("uk-ua");

const RegionAdministration = () => {
    const {id} = useParams();
    const history = useHistory();

    const [administration, setAdministration] = useState<any[]>([{
     id:'',
    user:{
      firstName:'',
      lastName:'',
      imagePath:'',
    },
    adminType:{
      adminTypeName:''
      },
      startDate:'',
      endDate:''}]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin);
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
  
    
    const getAdministration = async () => {
      setLoading(true);
      const response = await getRegionAdministration(id);
        setPhotosLoading(true);
        setPhotos([...response.data].filter(a => a != null));
        setAdministration([...response.data].filter(a => a != null));
      setLoading(false);
    };

    const removeAdministrator = async (adminId: number) => {
      await removeAdmin(adminId);
      setAdministration(administration.filter((u) => u.id !== adminId));
    };

    const showModal = (member: any) => {
      setAdmin(member);
      setVisibleModal(true);
    };

    const onAdd = async (newAdmin: any) => {
      const index = administration.findIndex((a) => a.id === admin.id);
      administration[index] = newAdmin;
      
      setAdministration(administration);
    };

    const setPhotos = async (members: any[]) => {
      for (let i of members) {
        i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
      }

      setPhotosLoading(false);
    };


    useEffect(() => {
        getAdministration();
    }, []);

    return (
        <Layout.Content>
          <Title level={2}>Провід округу</Title>
          {loading ? (
            <Spinner />
          ) : (
            <div className="cityMoreItems">
              {administration.length > 0 ? (
                administration.map((member: any) => (
                  <Card
                    key={member.id}
                    className="detailsCard"
                    title={`${member.adminType.adminTypeName}`}
                    headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                    actions={
 [
                            <SettingOutlined onClick={() => showModal(member)} />,
                            <CloseOutlined
                              onClick={() => removeAdministrator(member.id)}
                            />,
                          ]
                    }
                  >
                    <div
                      onClick={() =>
                        history.push(`/userpage/main/${member.userId}`)
                      }
                      className="cityMember"
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
                <Title level={4}>Ще немає діловодів округу</Title>
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
         
          <AddAdministratorModal
            admin={admin}
            setAdmin={setAdmin}
            visibleModal={visibleModal}
            setVisibleModal={setVisibleModal}
            cityId={+id}
            onAdd={onAdd}
          ></AddAdministratorModal>
        
         
        </Layout.Content>
      );
};

export default RegionAdministration;
