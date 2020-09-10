import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Row, Col, Button, Typography, Spin, Layout, Skeleton } from "antd";
import {
  EditOutlined,
  UserAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/AuthStore';
import userApi from "../../../api/UserApi";
import clubsApi from "../../../api/clubsApi";
import classes from "./Club.module.css";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from "../../../models/Club/ClubMember";
import ClubProfile from "../../../models/Club/ClubProfile";

const { Title, Paragraph } = Typography;

const Club = () => {
  const { id } = useParams();
  const history = useHistory();
  const [expand, setExpand] = useState(false);
  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(false);

  const [clubM, setClub] = useState<ClubProfile>(new ClubProfile());
  const [admins, setAdmins] = useState<ClubAdmin[]>([]);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [followers, setFollowers] = useState<ClubMember[]>([]);
  const [isCurrentUserAdmin, setIsAdmin] = useState(false);
  const [isCurrentUserClubAdmin, setIsClubAdmin] = useState(false);
  const [canCurrentUserJoin, setCanJoin] = useState(false);
  const [photosLoading, setPhotosLoading] = useState(false);

  useEffect(() => {
    getClub();
  }, []);

  const getClub = async () => {
    setLoading(true);

    const response = await clubsApi.getById(id);

    setPhotosLoading(true);
    setMembersPhotos([
      ...response.data.members,
      ...response.data.followers,
    ], [ ...response.data.clubAdministration ]);

    setClub(response.data);
    
    setAdmins(response.data.clubAdministration);
    setMembers(response.data.members);
    setFollowers(response.data.followers);
    setIsAdmin(response.data.isCurrentUserAdmin);
    setIsClubAdmin(response.data.isCurrentUserClubAdmin);
    setCanJoin(response.data.canJoin);

    setLoading(false);
  };

  const setMembersPhotos = async (members: ClubMember[], admins: ClubAdmin[]) => {
    for (let i = 0; i < members.length; i++) {
      members[i].user.imagePath = (
        await userApi.getImage(members[i].user.imagePath)
      ).data;
    }

    for (let i = 0; i < admins.length; i++) {
      admins[i].clubMembers.user.imagePath = (
        await userApi.getImage(admins[i].clubMembers.user.imagePath)
      ).data;
    }

    setPhotosLoading(false);
  }

  const changeApproveStatus = async (clubId: number, memberId: number) => {
    const member = await clubsApi.toggleMemberStatus(clubId, memberId);
    member.data.user.imagePath = (
      await userApi.getImage(member.data.user.imagePath)
    ).data;

    if (members.length < 6) {
      setMembers([...members, member.data]);
    }

    setFollowers(followers.filter((f) => f.id !== memberId));
  };

  const addMember = async (clubId: number) => {
    const token = AuthStore.getToken() as string;
    const user: any = jwt(token);

    const follower = await clubsApi.addFollower(clubId, user.nameid);
    follower.data.user.imagePath = (
      await userApi.getImage(follower.data.user.imagePath)
    ).data;

    if (followers.length < 6) {
      setFollowers([...followers, follower.data]);
    }

    setCanJoin(!canCurrentUserJoin);
  };

  const typoExpand = () => {
    setExpand(true);
    setCounter(!expand ? counter : counter + 1);
  };

  const typoClose = () => {
    setExpand(false);
    setCounter(!expand ? counter : counter + 1);
  };

  return loading ? (
    <Layout.Content className={classes.spiner}>
      <Spin size="large" />
    </Layout.Content>
  ) : (
    <div>
      <Row
        justify="space-around"
        gutter={[0, 40]}
        style={{ overflow: "hidden" }}
      >
        <Col
          flex="0 1 63%"
          style={{
            minHeight: "180px",
            marginLeft: "1.5%",
            marginRight: "1.5%",
          }}
        >
          <section className={classes.list}>
            <EditOutlined
              className={classes.listIcon}
              onClick={() => history.push(`/clubs/edit/${clubM?.club.id}`)}
            />
            <h1>{`Курінь ${
              clubM?.club.clubName ? clubM?.club.clubName : "Немає"
            }`}</h1>
            <Row
              gutter={16}
              justify="space-around"
              style={{ marginTop: "20px" }}
            >
              <Col flex="1" offset={1}>
                <div className={classes.mainInfo}>
                  <img
                    src={clubM?.club.logo}
                    alt="club"
                    style={{ width: "50%", height: "auto", maxWidth: "100%" }}
                  />
                  <p>
                    <b>Курінний</b>:{" "}
                    {clubM?.clubAdmin
                      ? clubM?.clubAdmin.clubMembers.user.lastName +
                        " " +
                        clubM?.clubAdmin.clubMembers.user.firstName
                      : "Немає"}
                  </p>
                </div>
              </Col>
              <Col flex="1" >
                <div className={classes.aboutInfo} key={counter}>
                  <Typography>
                    <Title level={4}>Опис</Title>
                    <Paragraph
                      ellipsis={{
                        rows: 11,
                        expandable: true,
                        onExpand: typoExpand,
                        symbol: "Більше",
                      }}
                    >
                      { clubM?.club.description ?
                        clubM?.club.description :
                        "Відсутній" }
                    </Paragraph>
                    <Title level={4}>Web-адреса</Title>
                    <Paragraph
                      ellipsis={{
                        rows: 2,
                        expandable: true,
                        onExpand: typoExpand,
                        symbol: "Більше",
                      }}
                    >
                      { clubM?.club.clubURL ?
                      <a href={clubM?.club.clubURL} target="_blank" rel="noopener noreferrer">
                        {clubM?.club.clubURL}
                      </a> :
                      "Відсутня" }
                    </Paragraph>
                  </Typography>
                  {expand && (
                    <Button type="primary" onClick={typoClose}>
                      Приховати
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </section>
        </Col>
        <Col
          flex="0 1 30%"
          style={{
            minHeight: "180px",
            marginLeft: "1.5%",
            marginRight: "1.5%",
          }}
        >
          <section className={classes.list}>
            <h1>Члени куреня</h1>
            <Row
              justify="space-around"
              gutter={[0, 16]}
              style={{
                paddingRight: "5px",
                paddingLeft: "5px",
                overflow: "hidden",
                maxHeight: "70%",
                marginTop: "20px",
              }}
            >
              { members.length !== 0 ? (
                members.map((member: ClubMember) => (
                  <Col key={member.id} className={classes.listItem} span={7}>
                    <div
                      onClick={() =>
                        history.push(`/userpage/main/${member.userId}`)
                      }
                    >
                      <Avatar
                        size={64}
                        //icon={<UserOutlined />}
                        src={member.user.imagePath}
                        className={classes.profileImg}
                      />
                      <p>
                        {member.user.lastName} {member.user.firstName}
                      </p>
                    </div>
                  </Col>
                ))
              ) : (
                <h2>Ще немає членів куреня</h2> 
              )}
            </Row>
            <Button 
              type="primary" 
              className={classes.listButton}
              onClick={() => history.push(`/clubs/members/${clubM.club.id}`)}
            >
              Більше
            </Button>
          </section>
        </Col>
      </Row>

      <Row
        justify="space-around"
        gutter={[0, 40]}
        style={{ overflow: "hidden", marginTop: "20px" }}
      >
        <Col
          flex="0 1 30%"
          style={{
            minHeight: "180px",
            marginLeft: "1.5%",
            marginRight: "1.5%",
          }}
        >
          <section className={classes.list}>
            <h1>Провід куреня</h1>
            <Row
              justify="space-around"
              gutter={[0, 16]}
              style={{
                paddingRight: "5px",
                paddingLeft: "5px",
                paddingTop: "20px",
                paddingBottom: "20px",
                overflow: "hidden",
                maxHeight: "70%",
              }}
            >
              { admins.length !== 0 ? (
                admins.map((admin) => (
                  <Col
                    key={admin.id}
                    className={classes.listItem}
                    span={7}
                  >
                    <div
                      onClick={() =>
                        history.push(`/userpage/main/${admin.clubMembers.userId}`)
                      }
                    >
                      <Avatar
                        size={64}
                        //icon={<UserOutlined />}
                        src={ admin.clubMembers.user.imagePath }
                        className={classes.profileImg}
                      />
                      <p>
                            {admin.clubMembers.user.lastName} {admin.clubMembers.user.firstName}
                      </p>
                    </div>
                  </Col>
                ))
              ) : (
                <h2>Ще немає діловодів куреня</h2>
              )}
            </Row>
            <Button 
              type="primary" 
              className={classes.listButton}
              onClick={() =>
                history.push(`/clubs/administration/${clubM.club.id}`)
              }
            >
              Більше
            </Button>
          </section>
        </Col>

        <Col
          flex="0 1 30%"
          style={{
            minHeight: "180px",
            marginLeft: "1.5%",
            marginRight: "1.5%",
          }}
        >
          <section className={classes.list}>
            <h1>Документообіг куреня</h1>
            <Row
              justify="space-around"
              gutter={[0, 16]}
              style={{
                paddingRight: "5px",
                paddingLeft: "5px",
                paddingTop: "20px",
                paddingBottom: "20px",
                overflow: "hidden",
                maxHeight: "70%",
              }}
            >
              {}
            </Row>
            <Button type="primary" className={classes.listButton}>
              Деталі
            </Button>
          </section>
        </Col>

        <Col
          flex="0 1 30%"
          style={{
            minHeight: "180px",
            marginLeft: "1.5%",
            marginRight: "1.5%",
          }}
        >
          <section className={classes.list}>
            <h1>Прихильники куреня</h1>
            <Row
              justify="space-around"
              gutter={[0, 16]}
              style={{
                paddingRight: "5px",
                paddingLeft: "5px",
                paddingTop: "20px",
                paddingBottom: "20px",
                overflow: "hidden",
                maxHeight: "70%",
              }}
            >
              { canCurrentUserJoin ? (
                <Col
                  className={classes.listItem}
                  span={7}
                  onClick={() => addMember(clubM.club.id)}
                >
                  <div>
                    <Avatar
                      style={{ color: "#3c5438" }}
                      size={64}
                      icon={<UserAddOutlined />}
                      className={classes.addFollower}
                    />
                    <p>Приєднатися</p>
                  </div>
                </Col>
              ) : null }
              { followers.length !== 0 ? (
                followers.map((member: ClubMember) => (
                  <Col 
                    key={member.id} 
                    className={classes.listItem} 
                    span={7}
                  >
                    <div>
                      <div
                        onClick={() =>
                          history.push(`/userpage/main/${member.userId}`)
                      }
                      >
                        {photosLoading ? (
                          <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                        ) : (
                        <Avatar
                          size={64}
                          src={member.user.imagePath}
                          className={classes.profileImg}
                        />
                        )}
                        <p>
                          {member.user.lastName} {member.user.firstName}
                        </p>
                      </div>
                      { (isCurrentUserClubAdmin || isCurrentUserAdmin) ? (
                        <PlusOutlined
                          className={classes.approveIcon}
                          onClick={() => changeApproveStatus(clubM.club.id, member.id)}
                        />
                      ) : null}
                    </div>
                  </Col>
                ))
              ) : canCurrentUserJoin ? null : (
                <h2>Ще немає прихильників куреня</h2>
              )}
            </Row>
            <Button 
              type="primary" 
              className={classes.listButton}
              onClick={() => history.push(`/clubs/followers/${clubM.club.id}`)}
            >
              Більше
            </Button>
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default Club;
