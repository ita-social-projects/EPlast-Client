import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Row, Col, Button, Typography, Spin, Layout } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  EditOutlined,
} from "@ant-design/icons";
import clubsApi from "../../../api/clubsApi";
import classes from "./Club.module.css";

const { Title, Paragraph } = Typography;

interface ClubData {
  club: Club;
  clubAdmin: User;
  clubAdministration: ClubAdministration;
  members: Members[];
  documents: object;
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

const Club = () => {
  const { id } = useParams();
  const history = useHistory();
  const [expand, setExpand] = useState(false);
  const [counter, setCounter] = useState(0);
  const [club, setData] = useState<ClubData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await clubsApi.getById(id);
      setData(res.data);
      setLoading(false);
    };
    fetchData();
  }, []);

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
              onClick={() => history.push(`/clubs/edit/${club?.club.id}`)}
            />
            <h1>{`Курінь ${
              club?.club.clubName ? club?.club.clubName : "Немає"
            }`}</h1>
            <Row
              gutter={16}
              justify="space-around"
              style={{ marginTop: "20px" }}
            >
              <Col flex="1" offset={1}>
                <div className={classes.mainInfo}>
                  <img
                    src={club?.club.logo}
                    alt="club"
                    style={{ width: "50%", height: "auto", maxWidth: "100%" }}
                  />
                  <p>
                    <b>Бунчужний</b>:{" "}
                    {club?.clubAdmin
                      ? club?.clubAdmin.lastName +
                        " " +
                        club?.clubAdmin.firstName
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
                      { club?.club.description ?
                        club?.club.description :
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
                      { club?.club.clubURL ?
                      <a href={club?.club.clubURL} target="_blank" rel="noopener noreferrer">
                        {club?.club.clubURL}
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
              {club?.members.map((member: Members) => (
                <Col key={member.id} className={classes.listItem} span={7}>
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    className={classes.profileImg}
                  />
                  <p>
                    {member.user.lastName} {member.user.firstName}
                  </p>
                </Col>
              ))}
            </Row>
            <Button type="primary" className={classes.listButton}>
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
              {
                <Col
                  key={club?.clubAdmin ? club?.clubAdmin.id : ""}
                  className={classes.listItem}
                  span={7}
                >
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    className={classes.profileImg}
                  />
                  <p>
                    {club?.clubAdmin
                      ? club?.clubAdmin.lastName +
                        " " +
                        club?.clubAdmin.firstName
                      : "Немає"}
                  </p>
                </Col>
              }
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
              {/* {club?.documents.map((document: any) => (
                    <Col key={document.id} className={classes.listItem} span={7}>
                      <FileTextOutlined style={{fontSize: '60px'}} className={classes.profileImg}/>
                      <p>{document.name}</p>
                    </Col>
                ))} */}
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
              {club?.followers.map((member: Members) => (
                <Col key={member.id} className={classes.listItem} span={7}>
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    className={classes.profileImg}
                  />
                  <p>
                    {member.user.lastName} {member.user.lastName}
                  </p>
                </Col>
              ))}
            </Row>
            <Button type="primary" className={classes.listButton}>
              Більше
            </Button>
          </section>
        </Col>
      </Row>
    </div>
  );
};

export default Club;
