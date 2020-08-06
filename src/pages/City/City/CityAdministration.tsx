import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {Avatar, Button, Card, Col, DatePicker, Form, Input, Layout, Modal, Row} from 'antd';
import {UserOutlined, SettingOutlined, CloseOutlined, RollbackOutlined} from '@ant-design/icons';
import {editAdministrator, getAllAdmins, removeAdministrator} from "../../../api/citiesApi";
import classes from './City.module.css';
import CityAdmin from '../../../models/City/CityAdmin';
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

const CityAdministration = () => {
    const {id} = useParams();
    const history = useHistory();

    const [administration, setAdministration] = useState<CityAdmin[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
    const [date, setDate] = useState<any>();

    const getAdministration = async () => {
        const response = await getAllAdmins(id);
        setAdministration(response.data.administration);
    };

    const removeAdmin = async (adminId: number) => {
        await removeAdministrator(adminId);
        setAdministration(administration.filter(u => u.id !== adminId));
    };

    const showModal = (member: CityAdmin) => {
      setAdmin(member);
  
      setVisibleModal(true);
    };

    function handleChangeType(event: any) {
      admin.adminType.adminTypeName = event.target.value;
    }
  
    function disabledEndDate(current: any) {
      return current && current < date;
    }
  
    const dateFormat = "DD.MM.YYYY";  
  
    const handleOk = async () => {
      setLoading(true);
  
      try {
          await editAdministrator(admin.cityId, admin);
      } finally {
        setVisibleModal(false);
        setLoading(false);
      }
    };
  
    const handleCancel = () => {
      setVisibleModal(false);
    };
  
    function handleChange(date: any, key: string) {
      if (key.indexOf("startDate") !== -1) {
        setDate(date);
      }

      setAdmin({ ...admin, [key]: date?._d });
    }

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
                actions={[
                  <SettingOutlined
                    onClick={() => showModal(member)}  
                  />,
                  <CloseOutlined
                    onClick={() => removeAdmin(member.id)}
                  />,
                ]}
              >
                <Avatar
                  size={86}
                  icon={<UserOutlined />}
                  className={classes.detailsIcon}
                />
                <Card.Meta
                  className={classes.detailsMeta}
                  title={`${member.user.firstName} ${member.user.lastName}`}
                />
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
        <Modal
          title="Редагувати адміністратора"
          visible={visibleModal}
          confirmLoading={loading}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Form>
            <Form.Item
              name={["members", "adminType"]}
              label="Тип адміністрування"
              rules={[{ required: true }]}
              className={classes.formField}
              initialValue={admin.adminType.adminTypeName}
            >
              <Input
                value={admin.adminType.adminTypeName}
                onChange={handleChangeType}
              />
            </Form.Item>
            <Row>
              <Col span={11}>
                <DatePicker
                  placeholder="Початок адміністрування"
                  format={dateFormat}
                  className={classes.select}
                  onChange={(event) => handleChange(event, "startDate")}
                  value={admin.startDate ? moment(admin.startDate) : undefined}
                />
              </Col>
              <Col span={11} offset={2}>
                <DatePicker
                  disabledDate={disabledEndDate}
                  placeholder="Кінець адміністрування"
                  format={dateFormat}
                  className={classes.select}
                  onChange={(event) => handleChange(event, "endDate")}
                  value={admin.endDate ? moment(admin.endDate) : undefined}
                />
              </Col>
            </Row>
          </Form>
        </Modal>
      </Layout.Content>
    );
};
export default CityAdministration;
