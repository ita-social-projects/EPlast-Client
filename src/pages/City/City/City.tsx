import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Row, Col, Button, Spin, Layout, Modal, Skeleton, Divider, Card, Tooltip} from "antd";
import { FileTextOutlined, EditOutlined, PlusSquareFilled, UserAddOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { addFollower, getCityById, getLogo, removeCity, toggleMemberStatus } from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import "./City.less";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import CityProfile from "../../../models/City/CityProfile";
import CityMember from '../../../models/City/CityMember';
import CityAdmin from '../../../models/City/CityAdmin';
import CityDocument from '../../../models/City/CityDocument';
import AddDocumentModal from "../AddDocumentModal/AddDocumentModal";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../../Spinner/Spinner";
import CityDetailDrawer from "../CityDetailDrawer/CityDetailDrawer";
import notificationLogic from "../../../components/Notifications/Notification";
import NotificationBoxApi from "../../../api/NotificationBoxApi";

const City = () => {
  const history = useHistory();
  const {id} = useParams();

  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState<CityProfile>(new CityProfile());
  const [cityLogo64, setCityLogo64] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
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

    await NotificationBoxApi.createNotifications(
      [member.data.userId],
      "Вітаємо, вас зараховано до членів станиці: ",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${id}`,
      city.name
      );

    member.data.user.imagePath = (
      await userApi.getImage(member.data.user.imagePath)
    ).data;

    if (members.length < 6) {
      setMembers([...members, member.data]);
    }

    setFollowers(followers.filter((f) => f.id !== memberId));
  };

  const addMember = async () => {
    const follower = await addFollower(+id);
        
    await NotificationBoxApi.createNotifications(
      admins.map(ad => ad.userId),
      `Приєднався новий прихильник: ${follower.data.user.firstName} ${follower.data.user.lastName} до вашої станиці: `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/followers/${id}`,
      city.name
      );
    follower.data.user.imagePath = (
      await userApi.getImage(follower.data.user.imagePath)
    ).data;

    if (followers.length < 6) {
      setFollowers([...followers, follower.data]);
    }

    setCanJoin(false);
  };

  const deleteCity = async () => {
    await removeCity(city.id);
    notificationLogic("success", "Станицю успішно видалено");

    admins.map(async (ad) => {
      await NotificationBoxApi.createNotifications(
        [ad.userId],
        `На жаль станицю: '${city.name}', в якій ви займали роль: '${ad.adminType.adminTypeName}' було видалено`,
        NotificationBoxApi.NotificationTypes.UserNotifications
        );
    });
    history.push('/cities');
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

  function seeDeleteModal () {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити дану станицю?",
      icon: <ExclamationCircleOutlined/>,
      okText: 'Так, видалити',
      okType: 'danger',
      cancelText: 'Скасувати',
      maskClosable: true,
      onOk() {deleteCity()}
    });
  }

  function seeJoinModal () {
    return Modal.confirm({
      title: "Ви впевнені, що хочете долучитися до даної станиці?",
      icon: <ExclamationCircleOutlined/>,
      okText: 'Так, долучитися',
      okType: 'primary',
      cancelText: 'Скасувати',
      maskClosable: true,
      onOk() {addMember()}
    });
  }

  const getCity = async () => {
    setLoading(true);

    try {
      const response = await getCityById(+id);

      setPhotosLoading(true);
      setCityLogoLoading(true);
      const admins = [...response.data.administration, response.data.head]
      .filter(a => a !== null);

      setPhotos([
        ...admins,
        ...response.data.members,
        ...response.data.followers,
        
      ], response.data.logo);
      
      setCity(response.data);
      setAdmins(admins);
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
    <Spinner />
  ) : city.id !== 0 ? (
    <Layout.Content className="cityProfile">
      <Row gutter={[0, 48]}>
        <Col xl={15} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={3}>Станиця {city.name}</Title>
            <Row className="cityPhotos" gutter={[0, 12]}>
              <Col md={13} sm={24} xs={24}>
                {cityLogoLoading ? (
                  <Skeleton.Avatar active shape={"square"} size={172} />
                ) : (
                  <img src={cityLogo64} alt="City" className="cityLogo" />
                )}
              </Col>
              <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                <iframe
                  src=""
                  title="map"
                  aria-hidden="false"
                  className="mainMap"
                />
              </Col>
            </Row>
            <Row className="cityInfo">
              <Col md={13} sm={24} xs={24}>
                {city.head ? (
                  <div>
                    <Paragraph>
                      <b>Станичний:</b> {city.head.user.firstName}{" "}
                      {city.head.user.lastName}
                    </Paragraph>
                    <Paragraph>
                      <b>Час правління:</b> {moment(city.head.startDate).format("DD.MM.YYYY")}
                        {city.head.endDate
                          ? ` - ${moment(city.head.endDate).format(
                              "DD.MM.YYYY"
                            )}`
                          : " "}
                    </Paragraph>
                  </div>
                ) : (
                  <Paragraph>
                    <b>Немає голови станиці</b>
                  </Paragraph>
                )}
              </Col>
              <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                {city.cityURL || city.email || city.phoneNumber ? (
                  <div>
                    {city.cityURL ? (
                      <Paragraph
                        ellipsis>
                        <b>Посилання:</b>{" "}
                        <u><a href={city.cityURL} target="_blank">
                          {city.cityURL}
                        </a></u>
                      </Paragraph>
                    ) : null}
                    {city.phoneNumber ? (
                      <Paragraph>
                        <b>Телефон:</b> {city.phoneNumber}
                      </Paragraph>
                    ) : null}
                    {city.email ? (
                      <Paragraph>
                        <b>Пошта:</b> {city.email}
                      </Paragraph>
                    ) : null}
                  </div>
                ) : (
                  <Paragraph>
                    <b>Немає контактів</b>
                  </Paragraph>
                )}
              </Col>
            </Row>
            <Row className="cityButtons" justify="center" gutter={[12, 0]}>
              <Col>
                <Button
                  type="primary"
                  className="cityInfoButton"
                  onClick={() => setVisibleDrawer(true)}
                >
                  Деталі
                </Button>
              </Col>
              {canEdit ? (
                <Col>
                  <Button
                    type="primary"
                    className="cityInfoButton"
                    onClick={() => history.push(`/annualreport/table`)}
                  >
                    Річні звіти
                  </Button>
                </Col>
              ) : null}
              {canEdit ? (
                <Col xs={24} sm={4}>
                  <Row
                    className="cityIcons"
                    justify={canCreate ? "center" : "start"}
                  >
                    {canEdit ? (
                      <Col>
                      <Tooltip
                        title="Редагувати станицю">
                          <EditOutlined
                            className="cityInfoIcon"
                            onClick={() =>
                              history.push(`/cities/edit/${city.id}`)
                            }
                          />
                        </Tooltip>
                      </Col>
                    ) : null}
                    {canCreate ? (
                      <Col offset={1}>
                        <Tooltip
                          title="Видалити станицю">
                            <DeleteOutlined
                              className="cityInfoIconDelete"
                              onClick={() => seeDeleteModal()}
                            />
                        </Tooltip>
                      </Col>
                    ) : null}
                  </Row>
                </Col>
              ) : null}
            </Row>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4}>Члени станиці</Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {members.length !== 0 ? (
                members.map((member) => (
                  <Col
                    className="cityMemberItem"
                    key={member.id}
                    xs={12}
                    sm={8}
                  >
                    <div
                      onClick={() =>
                        history.push(`/userpage/main/${member.userId}`)
                      }
                    >
                      {photosLoading ? (
                        <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                      ) : (
                        <Avatar size={64} src={member.user.imagePath} />
                      )}
                      <p className="userName">{member.user.firstName}</p>
                      <p className="userName">{member.user.lastName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає членів станиці</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/cities/members/${city.id}`)}
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 0 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="cityCard">
            <Title level={4}>Провід станиці</Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {admins.length !== 0 ? (
                admins.map((admin) => (
                  <Col className="cityMemberItem" key={admin.id} xs={12} sm={8}>
                    <div
                      onClick={() =>
                        history.push(`/userpage/main/${admin.userId}`)
                      }
                    >
                      {photosLoading ? (
                        <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                      ) : (
                        <Avatar size={64} src={admin.user.imagePath} />
                      )}
                      <p className="userName">{admin.user.firstName}</p>
                      <p className="userName">{admin.user.lastName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає діловодів станиці</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() =>
                  history.push(`/cities/administration/${city.id}`)
                }
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4}>Документообіг станиці</Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {documents.length !== 0 ? (
                documents.map((document) => (
                  <Col
                    className="cityMemberItem"
                    xs={12}
                    sm={8}
                    key={document.id}
                  >
                    <div>
                      <FileTextOutlined className="documentIcon" />
                      <p className="documentText">
                        {document.cityDocumentType.name}
                      </p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає документів станиці</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/cities/documents/${city.id}`)}
              >
                Більше
              </Button>
              {canEdit ? (
                <PlusSquareFilled
                  className="addReportIcon"
                  onClick={() => setVisibleModal(true)}
                />
              ) : null}
            </div>
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 1 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="cityCard">
            <Title level={4}>Прихильники станиці</Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {canJoin ? (
                <Col
                  className="cityMemberItem"
                  xs={12}
                  sm={8}
                  onClick={() => seeJoinModal()}
                >
                  <div>
                    <Avatar
                      className="addFollower"
                      size={64}
                      icon={<UserAddOutlined />}
                    />
                    <p>Доєднатися</p>
                  </div>
                </Col>
              ) : null}
              {followers.length !== 0 ? (
                followers.slice(0, canJoin ? 5 : 6).map((followers) => (
                  <Col
                    className="cityMemberItem"
                    xs={12}
                    sm={8}
                    key={followers.id}
                  >
                    <div>
                      <div
                        onClick={() =>
                          history.push(`/userpage/main/${followers.userId}`)
                        }
                      >
                        {photosLoading ? (
                          <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                        ) : (
                          <Avatar size={64} src={followers.user.imagePath} />
                        )}
                        <p className="userName">{followers.user.firstName}</p>
                        <p className="userName">{followers.user.lastName}</p>
                      </div>
                      {canEdit ? (
                        <PlusOutlined
                          className="approveIcon"
                          onClick={() => changeApproveStatus(followers.id)}
                        />
                      ) : null}
                    </div>
                  </Col>
                ))
              ) : canJoin ? null : (
                <Paragraph>Ще немає прихильників станиці</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/cities/followers/${city.id}`)}
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <CityDetailDrawer
        city={city}
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
      ></CityDetailDrawer>
      
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
    <Title level={2}>Місто не знайдено</Title>
  );
};

export default City;
