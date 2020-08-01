import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar, Card, Form, Input, Layout, Modal} from 'antd';
import {UserOutlined, SettingOutlined, CloseOutlined} from '@ant-design/icons';
import {addAdministrator, getAllMembers, toggleMemberStatus} from "../../api/citiesApi";
import classes from './City.module.css';
import CityMember from './../../models/City/CityMember';
import CityAdmin from './../../models/City/CityAdmin';

const CityMembers = () => {
    const {id} = useParams();

    const [members, setMembers] = useState<CityMember[]>([]);
    const [visibleModal, setVisibleModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());

    const getMembers = async () => {
        const response = await getAllMembers(id);
        setMembers(response.data);
    };

    const removeMember = async (memberId: number) => {
        await toggleMemberStatus (memberId);
        setMembers(members.filter(u => u.id !== memberId));
    }

    const showModal = (member: CityMember) => {
        setAdmin(new CityAdmin());

        admin.user = member.user;
        admin.cityId = member.cityId;
        
        setVisibleModal(true);
    }

    const handleOk = async () => {
      setLoading(true);

      try {
        await addAdministrator(admin.cityId, admin);
      } finally {
        setVisibleModal(false);
        setLoading(true);
      }
    };

    const handleCancel = () => {
      setVisibleModal(false);
    };

    useEffect(() => {
      getMembers();
    }, []);

    return (
      <Layout.Content>
        <h1 className={classes.mainTitle}>Члени станиці</h1>
        <div className={classes.wrapper}>
          {members.map((member: CityMember) => (
            <Card
              key={member.id}
              className={classes.detailsCard}
              actions={[
                <SettingOutlined
                  key="setting"
                  onClick={() => showModal(member)}
                />,
                <CloseOutlined
                  key="close"
                  onClick={(e) => removeMember(member.id)}
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
          ))}
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
              name={["city", "adminType"]}
              label="Тип адміністратора"
              rules={[{ required: true }]}
              className={classes.formField}
              initialValue={admin.adminType.adminTypeName}
            >
              <Input
                value={admin.adminType.adminTypeName}
                onChange={(event) =>
                  (admin.adminType.adminTypeName = event.target.value)
                }
              />
            </Form.Item>
          </Form>
        </Modal>
      </Layout.Content>
    );
};
export default CityMembers;
