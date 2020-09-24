import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Layout, Skeleton, Spin} from 'antd';
import {SettingOutlined, CloseOutlined, RollbackOutlined} from '@ant-design/icons';
import { getAllAdmins, removeAdministrator} from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import "./City.less";
import CityAdmin from '../../../models/City/CityAdmin';
import AddAdministratorModal from '../AddAdministratorModal/AddAdministratorModal';
import moment from "moment";
import "moment/locale/uk";
import Title from 'antd/lib/typography/Title';
import Spinner from '../../Spinner/Spinner';
moment.locale("uk-ua");

const CityAdministration = () => {
    const {id} = useParams();
    const history = useHistory();

    const [administration, setAdministration] = useState<CityAdmin[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
  
    const getAdministration = async () => {
      setLoading(true);
      const response = await getAllAdmins(id);
      if(response.data.administration.length !== 0){
        setPhotosLoading(true);
        setPhotos([...response.data.administration, response.data.head]);
        setAdministration([...response.data.administration, response.data.head]);
        setCanEdit(response.data.canEdit);
      }
      setLoading(false);
    };

    const removeAdmin = async (adminId: number) => {
      await removeAdministrator(adminId);
      setAdministration(administration.filter((u) => u.id !== adminId));
    };

    const showModal = (member: CityAdmin) => {
      setAdmin(member);

      setVisibleModal(true);
    };

    const setPhotos = async (members: CityAdmin[]) => {
      for (let i of members) {
        i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
      }

      setPhotosLoading(false);
    };

    const onAdd = async (newAdmin: CityAdmin = new CityAdmin()) => {
      const index = administration.findIndex((a) => a.id === admin.id);
      administration[index] = newAdmin;
      
      setAdministration(administration);
    };

    useEffect(() => {
        getAdministration();
    }, []);

    return (
      <Layout.Content>
        <Title level={2}>Провід станиці</Title>
        {loading ? (
          <Spinner />
        ) : (
          <div className="cityMoreItems">
            {administration.length > 0 ? (
              administration.map((member: CityAdmin) => (
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
                            onClick={() => removeAdmin(member.id)}
                          />,
                        ]
                      : undefined
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
              <Title level={4}>Ще немає діловодів станиці</Title>
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
        {canEdit ? (
          <AddAdministratorModal
            admin={admin}
            setAdmin={setAdmin}
            visibleModal={visibleModal}
            setVisibleModal={setVisibleModal}
            cityId={+id}
            onAdd={onAdd}
          ></AddAdministratorModal>
        ) : null}
      </Layout.Content>
    );
};

export default CityAdministration;
