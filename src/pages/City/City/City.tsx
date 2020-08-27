import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Row, Col, Button, Spin, Layout, Modal, Skeleton, Divider, Card } from "antd";
import { FileTextOutlined, EditOutlined, PlusSquareFilled, UserAddOutlined, PlusOutlined, CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { addFollower, getCityById, getLogo, removeCity, toggleMemberStatus } from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import classes from "./City.module.css";
import "./City.less";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import CityProfile from "../../../models/City/CityProfile";
import CityMember from '../../../models/City/CityMember';
import CityAdmin from '../../../models/City/CityAdmin';
import CityDocument from '../../../models/City/CityDocument';
import AddDocumentModal from "../AddDocumentModal/AddDocumentModal";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

const City = () => {
  const history = useHistory();
  const {id} = useParams();

  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<CityProfile>(new CityProfile());
  const [cityLogo64, setCityLogo64] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [admins, setAdmins] = useState<CityAdmin[]>([]);
  const [members, setMembers] = useState<CityMember[]>([]);
  const [followers, setFollowers] = useState<CityMember[]>([]);
  const [documents, setDocuments] = useState<CityDocument[]>([]);
  const [canCreate, setCanCreate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canJoin, setCanJoin] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [cityLogoLoading, setCityLogoLoading] = useState<boolean>(false);
  const [document, setDocument] = useState<CityDocument>(new CityDocument());

  const changeApproveStatus = async (memberId: number) => {
    const member = await toggleMemberStatus(memberId);
    member.data.user.imagePath = (
      await userApi.getImage(member.data.user.imagePath)
    ).data;

    if (members.length < 6) {
      setMembers([...members, member.data]);
    }

    setFollowers(followers.filter((f) => f.id !== memberId));
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

  const setPhotos = async (members: CityMember[], logo: string) => {
    for (let i = 0; i < members.length; i++) {
      members[i].user.imagePath = (
        await userApi.getImage(members[i].user.imagePath)
      ).data;
    }
    setPhotosLoading(false);

    if (logo === null) {
      setCityLogo64(CityDefaultLogo);
    } else {
      const response = await getLogo(logo);    
      setCityLogo64(response.data);
    }
    setCityLogoLoading(false);
  };

  const onAdd = (newDocument: CityDocument) => {
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
  }

  function seeModal () {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити дану станицю?",
      icon: <ExclamationCircleOutlined/>,
      okText: 'Так, видалити',
      okType: 'danger',
      cancelText: 'Скасувати',
      onOk() { deleteCity()}
    });
  }

  const getCity = async () => {
    setLoading(true);

    try {
      const response = await getCityById(+id);

      setPhotosLoading(true);
      setCityLogoLoading(true);
      setPhotos([
        ...response.data.administration,
        ...response.data.members,
        ...response.data.followers,
      ], response.data.logo);
      
      setCity(response.data);
      setAdmins(response.data.administration);
      setMembers(response.data.members);
      setFollowers(response.data.followers);
      setDocuments(response.data.documents);
      setCanCreate(response.data.canCreate);
      setCanEdit(response.data.canEdit);
      setCanJoin(response.data.canJoin);
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
    <Layout.Content className="cityProfile">
      <Row gutter={[0, 48]}>
        <Col xl={15} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4} className="cityTitle">
              Станиця
            </Title>
            <Row>
              <Col md={12} sm={24} xs={24}>
                Фото
                <Paragraph>Станичний:</Paragraph>
                <Paragraph>Роки правління</Paragraph>
              </Col>
              <Col md={12} sm={24} xs={24}>
                Карта
                <Paragraph>Контакти:</Paragraph>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4} className="cityTitle">
              Члени станиці
            </Title>
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 0 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="cityCard">
            <Title level={4} className="cityTitle">
              Провід станиці
            </Title>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4} className="cityTitle">
              Документообіг станиці
            </Title>
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 1 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="cityCard">
            <Title level={4} className="cityTitle">
              Прихильники станиці
            </Title>
          </Card>
        </Col>
      </Row>
      <Divider> CITY VIEW </Divider>
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
            {canCreate ? (
              <CloseOutlined
                className={classes.removeIcon}
                onClick={() => seeModal()}
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
                  {cityLogoLoading ? (
                    <Skeleton.Avatar active shape={"square"} size={172} />
                  ) : (
                    <img
                      src={cityLogo64}
                      alt="City"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "100%",
                      }}
                    />
                  )}
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
                  {canEdit ? (
                    <div className={classes.bottomButton}>
                      <Button
                        type="primary"
                        className={classes.listButton}
                        onClick={() => history.push(`/cities/${city.id}`)}
                      >
                        Річні звіти
                      </Button>
                    </div>
                  ) : null}
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
                          className={classes.detailsIcon}
                        />
                      )}
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
                          className={classes.detailsIcon}
                        />
                      )}
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
              {canEdit ? (
                <div className={classes.flexContainer}>
                  <PlusSquareFilled
                    className={classes.addReportIcon}
                    onClick={() => setVisibleModal(true)}
                  />
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
                            className={classes.detailsIcon}
                          />
                        )}
                        <p className={classes.userName}>
                          {member.user.firstName}
                        </p>
                        <p className={classes.userName}>
                          {member.user.lastName}
                        </p>
                      </div>
                      {canEdit ? (
                        <PlusOutlined
                          className={classes.approveIcon}
                          onClick={() => changeApproveStatus(member.id)}
                        />
                      ) : null}
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

      {canEdit ? (
        <AddDocumentModal
          cityId={+id}
          document={document}
          setDocument={setDocument}
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          onAdd={onAdd}
        ></AddDocumentModal>
      ) : null}
    </Layout.Content>
  ) : (
    <h1 className={classes.title}>Місто не знайдено</h1>
  );
};

export default City;
