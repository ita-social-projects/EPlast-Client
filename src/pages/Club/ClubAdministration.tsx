import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Card, Layout, Spin } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import clubsApi from "../../api/clubsApi";
import classes from "./Club.module.css";

interface MemberProps {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  adminType: {
    adminTypeName: string;
  };
}

const ClubAdministration = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [administration, setAdministration] = useState([]);

  const getAdministration = async () => {
    const response = await clubsApi.getAllAdmins(id);
    setAdministration(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getAdministration();
  }, []);

  return (
    <Layout.Content>
      <h1 className={classes.mainTitle}>Діловоди станиці</h1>
      <div className={classes.wrapper}>
        {loading ? (
          <Layout.Content className={classes.spiner}>
            <Spin size="large" />
          </Layout.Content>
        ) : (
          administration.map((member: MemberProps) => (
            <Card
              key={member.id}
              className={classes.detailsCard}
              title={`${member.adminType.adminTypeName}`}
              headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
              actions={[
                <SettingOutlined key="setting" />,
                <CloseOutlined key="close" />,
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
        )}
      </div>
    </Layout.Content>
  );
};
export default ClubAdministration;
