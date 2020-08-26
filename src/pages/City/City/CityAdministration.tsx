import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Col, DatePicker, Form, Input, Layout, Modal, Row, Skeleton} from 'antd';
import {SettingOutlined, CloseOutlined, RollbackOutlined} from '@ant-design/icons';
import { getAllAdmins, removeAdministrator} from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import classes from './City.module.css';
import CityAdmin from '../../../models/City/CityAdmin';
import AddAdministratorModal from '../AddAdministratorModal/AddAdministratorModal';
//import AdminType from '../../../models/Admin/AdminType';
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

const CityAdministration = () => {
    const {id} = useParams();
    const history = useHistory();

    const [administration, setAdministration] = useState<CityAdmin[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
    const [canEdit, setCanEdit] = useState<Boolean>(false);
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);

    const getAdministration = async () => {
        const response = await getAllAdmins(id);

        setPhotosLoading(true);
        setPhotos(response.data.administration);
        setAdministration(response.data.administration);
        setCanEdit(response.data.canEdit);
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
      for (let i = 0; i < members.length; i++) {
        members[i].user.imagePath = (
          await userApi.getImage(members[i].user.imagePath)
        ).data;
      }

      setPhotosLoading(false);
    };

    useEffect(() => {
        getAdministration();
    }, []);

    return (
      <Layout.Content>
        <h1 className={classes.mainTitle}>Діловоди станиці</h1>
        <div className={classes.wrapper}>
          {administration.length > 0 ? (
            administration.map((member: CityAdmin) => (
              <Card
                key={member.id}
                className={classes.detailsCard}
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
                  className={classes.cityMember}
                >
                  <div>
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar
                        size={86}
                        src={member.user.imagePath}
                        className={classes.detailsIcon}
                      />
                    )}
                    <Card.Meta
                      className={classes.detailsMeta}
                      title={`${member.user.firstName} ${member.user.lastName}`}
                    />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <h1>Ще немає діловодів в станиці</h1>
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
        {canEdit ? (
          <AddAdministratorModal
            admin={admin}
            setAdmin={setAdmin}
            visibleModal={visibleModal}
            setVisibleModal={setVisibleModal}
          ></AddAdministratorModal>
        ) : null}
      </Layout.Content>
    );
};

export default CityAdministration;
