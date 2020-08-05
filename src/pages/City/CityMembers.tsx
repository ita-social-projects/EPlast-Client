<<<<<<< HEAD
import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar, Card, Layout} from 'antd';
import {UserOutlined, SettingOutlined, CloseOutlined} from '@ant-design/icons';
import {getAllMembers, toggleMemberStatus} from "../../api/citiesApi";
import classes from './City.module.css';

interface MemberProps {
    id: number;
    user: {
        firstName: string;
        lastName: string;
    }
}

const CityMembers = () => {
    const {id} = useParams();

    const [members, setMembers] = useState<MemberProps[]>([
      { id: 0, user: { firstName: "", lastName: "" } },
    ]);

    const getMembers = async () => {
        const response = await getAllMembers(id);
        setMembers(response.data);
    };

    const removeMember = async (memberId: number) => {
        await toggleMemberStatus (memberId);
        setMembers(members.filter(u => u.id !== memberId));
    }

    useEffect(() => {
        getMembers();
    }, []);

    return (
        <Layout.Content>
            <h1 className={classes.mainTitle}>Члени станиці</h1>
            <div className={classes.wrapper}>
                {members.map((member: MemberProps) => (
                    <Card
                        key={member.id}
                        className={classes.detailsCard}
                        actions={[
                            <SettingOutlined key="setting"/>,
                            <CloseOutlined key="close"
                            onClick={e => removeMember(member.id)}/>,
                        ]}
                    >
                        <Avatar size={86} icon={<UserOutlined/>} className={classes.detailsIcon}/>
                        <Card.Meta className={classes.detailsMeta}
                                   title={`${member.user.firstName} ${member.user.lastName}`}/>
                    </Card>
                ))}
            </div>
        </Layout.Content>
    );
=======
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Col, DatePicker, Form, Input, Layout, Modal, Row, } from "antd";
import { UserOutlined, SettingOutlined, CloseOutlined, RollbackOutlined } from "@ant-design/icons";
import { addAdministrator, removeAdministrator, getAllAdmins, getAllMembers, toggleMemberStatus, } from "../../api/citiesApi";
import classes from "./City.module.css";
import CityMember from "./../../models/City/CityMember";
import CityAdmin from "./../../models/City/CityAdmin";
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

const CityMembers = () => {
  const {id} = useParams();
  const history = useHistory();

  const [members, setMembers] = useState<CityMember[]>([]);
  const [admins, setAdmins] = useState<CityAdmin[]>([]);
  const [head, setHead] = useState<CityAdmin>(new CityAdmin());
  const [visibleModal, setVisibleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
  const [date, setDate] = useState<any>();

  const getMembers = async () => {
    const responseMembers = await getAllMembers(id);
    setMembers(responseMembers.data);

    const responseAdmins = await getAllAdmins(id);
    setAdmins(responseAdmins.data.administration);
    setHead(responseAdmins.data.head);
  };

  const removeMember = async (member: CityMember) => {
    await toggleMemberStatus(member.id);

    const existingAdmin = [head, ...admins].find((a) => a.userId === member.userId);
    
    if (existingAdmin !== undefined) {
      await removeAdministrator(existingAdmin?.id || 0);
    }

    setMembers(members.filter((u) => u.id !== member.id));
  };

  const showModal = (member: CityMember) => {
    setAdmin(new CityAdmin());
    setAdmin({
      ...admin,
      ["userId"]: member.user.id,
      ["user"]: member.user,
      ["cityId"]: member.cityId,
    });

    setVisibleModal(true);
  };

  const handleOk = async () => {
    setLoading(true);

    try {
        await addAdministrator(admin.cityId, admin);
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

  function isAdminActive(userId: string) {
    const admin = admins.find(a => a.userId === userId);
    return moment(admin?.endDate) > moment();

  }
  
  function handleChangeType(event: any) {
    admin.adminType.adminTypeName = event.target.value;
  }

  function disabledEndDate(current: any) {
    return current && current < date;
  }

  const dateFormat = "DD.MM.YYYY";

  useEffect(() => {
    getMembers();
  }, [admin]);

  return (
    <Layout.Content>
      <h1 className={classes.mainTitle}>Члени станиці</h1>
      <div className={classes.wrapper}>
        {members.length > 0 ? (
          members.map((member: CityMember) => (
            <Card
              key={member.id}
              className={classes.detailsCard}
              actions={[
                <SettingOutlined
                  onClick={
                    admins.some((a) => a.userId === member.userId) &&
                    isAdminActive(member.userId)
                      ? undefined
                      : () => showModal(member)
                  }
                />,
                <CloseOutlined
                  onClick={() => removeMember(member)}
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
          <h1>Ще немає членів станиці</h1>
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
        title="Додати в провід станиці"
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
              />
            </Col>
            <Col span={11} offset={2}>
              <DatePicker
                disabledDate={disabledEndDate}
                placeholder="Кінець адміністрування"
                format={dateFormat}
                className={classes.select}
                onChange={(event) => handleChange(event, "endDate")}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </Layout.Content>
  );
>>>>>>> origin
};
export default CityMembers;
