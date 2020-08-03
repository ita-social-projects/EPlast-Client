import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Row, Col, Button, Spin, Layout } from "antd";
import { UserOutlined, FileTextOutlined, EditOutlined, PlusSquareFilled, UserAddOutlined, PlusOutlined, CloseOutlined } from "@ant-design/icons";
import moment from "moment";
import { addFollower, getCityById, getLogo, removeCity, toggleMemberStatus } from "../../api/citiesApi";
import classes from "./City.module.css";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import CityProfile from "../../models/City/CityProfile";
import CityMember from '../../models/City/CityMember';
import CityAdmin from '../../models/City/CityAdmin';
import CityDocument from '../../models/City/CityDocument';

const City = () => {
  const history = useHistory();
  const {id} = useParams();

  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<CityProfile>(new CityProfile());
  const [admins, setAdmins] = useState<CityAdmin[]>([]);
  const [members, setMembers] = useState<CityMember[]>([]);
  const [followers, setFollowers] = useState<CityMember[]>([]);
  const [documents, setDocuments] = useState<CityDocument[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [canJoin, setCanJoin] = useState(false);
  const [canApprove, setCanApprove] = useState(false);
  const [canAddReports, setCanAddReports] = useState(false);

  const changeApproveStatus = async (memberId: number) => {
    const member = await toggleMemberStatus(memberId);
    
    if (members.length < 6) {
      setMembers([...members, member.data]);
    }

    setFollowers(followers.filter(f => f.id !== memberId));
  };

  const addMember = async (cityId: number) => {
    const follower = await addFollower(cityId);

    if (followers.length < 6) {
      setFollowers([...followers, follower.data]);
    }

    setCanJoin(!canJoin);
  };

  const deleteCity = async () => {
    history.push('/cities');

    await removeCity(+id);
  }

  const getCity = async () => {
    setLoading(true);

    try {
      const response = await getCityById(+id);

      if (response.data.logo === null) {
        response.data.logo = CityDefaultLogo;
      } else {
        const logo = await getLogo(response.data.logo);
        response.data.logo = logo.data;
      }

      setCity(response.data);
      setAdmins(response.data.administration);
      setMembers(response.data.members);
      setFollowers(response.data.followers);
      setDocuments(response.data.documents);
      setCanEdit(response.data.canEdit);
      setCanJoin(response.data.canJoin);
      setCanApprove(response.data.canApprove);
      setCanAddReports(response.data.canAddReports);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  return loading ? (
    <Layout.Content className={classes.spiner}>
      <Spin size="large" />
    </Layout.Content>
  ) : city.id !== 0 && !loading ? (
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
            {canEdit ? (
              <EditOutlined
                className={classes.editIcon}
                onClick={() => history.push(`/cities/edit/${city.id}`)}
              />
            ) : null}
            {canEdit ? (
              <CloseOutlined
                className={classes.removeIcon}
                onClick={() => deleteCity()}
              />
            ) : null}
            <h1 className={classes.title}>{`Станиця ${city.name}`}</h1>
            <Row
              gutter={16}
              justify="space-around"
              style={{ marginTop: "20px", marginBottom: "10px" }}
            >
              <Col flex="1" offset={1}>
                <div className={classes.mainInfo}>
                  <img
                    src={city.logo || undefined}
                    alt="City"
                    style={{ width: "100%", height: "auto", maxWidth: "100%" }}
                  />
                  <p>
                    <b>Станичний</b>:{" "}
                    {city.head
                      ? `${city.head.user.firstName} ${city.head.user.lastName}`
                      : "-"}
                  </p>
                  <p>
                    <b>
                      {city.head
                        ? city.head.startDate
                          ? `${moment(city.head.startDate).format(
                              "DD.MM.YYYY"
                            )}`
                          : "-"
                        : null}
                      {city.head
                        ? city.head.endDate
                          ? ` - ${moment(city.head.endDate).format(
                              "DD.MM.YYYY"
                            )}`
                          : null
                        : null}
                    </b>
                  </p>
                </div>
              </Col>
              <Col flex="1" offset={1}>
                <iframe
                  src=""
                  title="map"
                  aria-hidden="false"
                  className={classes.mainMap}
                />
                <div className={classes.contactsInfo}>
                  <b className={classes.contactsName}>Контакти:</b>
                  <div className={classes.contactsContent}>
                    <p>{city.email}</p>
                    <p>{city.cityURL}</p>
                  </div>
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
            <h1 className={classes.title}>Члени станиці</h1>
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
              {members.length !== 0 ? (
                members.map((member) => (
                  <Col className={classes.listItem} key={member.id} span={7}>
                    <div>
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        className={classes.profileImg}
                      />
                      <p className={classes.userName}>
                        {member.user.firstName}
                      </p>
                      <p className={classes.userName}>{member.user.lastName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <h2>Ще немає членів станиці</h2>
              )}
            </Row>
            <div className={classes.bottomButton}>
              <Button
                type="primary"
                className={classes.listButton}
                onClick={() => history.push(`/cities/members/${city.id}`)}
              >
                Більше
              </Button>
            </div>
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
            <h1 className={classes.title}>Провід станиці</h1>
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
              {admins.length !== 0 ? (
                admins.map((member) => (
                  <Col className={classes.listItem} key={member.id} span={7}>
                    <div>
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        className={classes.profileImg}
                      />
                      <p className={classes.userName}>
                        {member.user.firstName}
                      </p>
                      <p className={classes.userName}>{member.user.lastName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <h2>Ще немає діловодів станиці</h2>
              )}
            </Row>
            <div className={classes.bottomButton}>
              <Button
                type="primary"
                className={classes.listButton}
                onClick={() =>
                  history.push(`/cities/administration/${city.id}`)
                }
              >
                Більше
              </Button>
            </div>
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
            <h1 className={classes.title}>Документообіг станиці</h1>
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
              {documents.length !== 0 ? (
                documents.map((document) => (
                  <Col className={classes.listItem} key={document.id} span={7}>
                    <div>
                      <FileTextOutlined
                        style={{ fontSize: "60px" }}
                        className={classes.profileImg}
                      />
                      <p className={classes.documentText}>
                        {document.cityDocumentType.name}
                      </p>
                    </div>
                  </Col>
                ))
              ) : (
                <h2>Ще немає документів станиці</h2>
              )}
            </Row>
            <div className={classes.bottomButton}>
              <Button
                type="primary"
                className={classes.listButton}
                onClick={() => history.push(`/cities/documents/${city.id}`)}
              >
                Деталі
              </Button>
              {canAddReports ? (
                <div className={classes.flexContainer}>
                  <PlusSquareFilled className={classes.addReportIcon} />
                </div>
              ) : null}
            </div>
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
            <h1 className={classes.title}>Прихильники станиці</h1>
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
              {canJoin ? (
                <Col
                  className={classes.listItem}
                  span={7}
                  onClick={() => addMember(city.id)}
                >
                  <div>
                    <Avatar
                      style={{ color: "#3c5438" }}
                      size={64}
                      icon={<UserAddOutlined />}
                      className={classes.addFollower}
                    />
                    <p>Доєднатися</p>
                  </div>
                </Col>
              ) : null}
              {followers.length !== 0 ? (
                followers.map((member) => (
                  <Col className={classes.listItem} key={member.id} span={7}>
                    <div>
                      <Avatar
                        size={64}
                        icon={<UserOutlined />}
                        className={classes.profileImg}
                      />
                      {canApprove ? (
                        <PlusOutlined
                          className={classes.approveIcon}
                          onClick={() => changeApproveStatus(member.id)}
                        />
                      ) : null}
                      <p className={classes.userName}>
                        {member.user.firstName}
                      </p>
                      <p className={classes.userName}>{member.user.lastName}</p>
                    </div>
                  </Col>
                ))
              ) : canJoin ? null : (
                <h2>Ще немає прихильників станиці</h2>
              )}
            </Row>

            <div className={classes.bottomButton}>
              <Button
                type="primary"
                className={classes.listButton}
                onClick={() => history.push(`/cities/followers/${city.id}`)}
              >
                Більше
              </Button>
            </div>
          </section>
        </Col>
      </Row>
    </div>
  ) : (
    <h1 className={classes.title}>Місто не знайдено</h1>
  );
};

export default City;
