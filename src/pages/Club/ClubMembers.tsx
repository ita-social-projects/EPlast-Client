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

interface ClubData {
  club: Club;
  clubAdmin: User;
  clubAdministration: ClubAdministration;
  members: Members[];
  documents: object[];
  followers: Members[];
}
interface ClubAdministration {}
interface Club {
  id: number;
  clubName: string;
  clubURL: string;
  description: string;
  logo: string;
}
interface Members {
  id: number;
  user: User;
}
interface User {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  imagePath: string;
}

const ClubMembers = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [club, setClub] = useState<ClubData>();

  const getMembers = async () => {
    const response = await clubsApi.getAllMembers(id);
    setClub(response.data);
    console.log(response.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getMembers();
  }, []);

  return (
    <Layout.Content>
      <h1 className={classes.mainTitle}>Члени куреня</h1>
      <div className={classes.wrapper}>
        {loading ? (
          <Layout.Content className={classes.spiner}>
            <Spin size="large" />
          </Layout.Content>
        ) : null}
        {!loading
          ? club?.members.map((member: Members) => (
              <Card
                key={member.user.id}
                className={classes.detailsCard}
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
          : null}
      </div>
    </Layout.Content>
  );
};
export default ClubMembers;
