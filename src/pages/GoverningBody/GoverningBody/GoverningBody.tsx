import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Layout,
  Modal,
  Skeleton,
  Card,
  Tooltip,
  Badge,
  Avatar,
} from "antd";
import {
  EditOutlined,
  PlusSquareFilled,
  DeleteOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import {
  getGoverningBodyById,
  getGoverningBodyLogo,
  getUserAccess,
  removeGoverningBody
} from "../../../api/governingBodiesApi";
import "./GoverningBody.less";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import GoverningBodyProfile from "../../../models/GoverningBody/GoverningBodyProfile";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import GoverningBodyDetailDrawer from "../GoverningBodyDetailDrawer";
import notificationLogic from "../../../components/Notifications/Notification";
import Crumb from "../../../components/Breadcrumb/Breadcrumb";
import { successfulDeleteAction } from "../../../components/Notifications/Messages";
import PsevdonimCreator from "../../../components/HistoryNavi/historyPseudo";
import AddCitiesNewSecretaryForm from "../AddAdministratorModal/AddGoverningBodiesSecretaryForm";
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
import GoverningBodyAdmin from "../../../models/GoverningBody/GoverningBodyAdmin";
import Paragraph from "antd/lib/typography/Paragraph";
import userApi from "../../../api/UserApi";
import moment from "moment";

const GoverningBody = () => {
  const history = useHistory();
  const { id } = useParams();
  const { url } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [governingBody, setGoverningBody] = useState<GoverningBodyProfile>(new GoverningBodyProfile());
  const [governingBodyLogo64, setGoverningBodyLogo64] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [governingBodyLogoLoading, setGoverningBodyLogoLoading] = useState<boolean>(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [visible, setvisible] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});
  const [admins, setAdmins] = useState<GoverningBodyAdmin[]>([]);
  const [adminsCount, setAdminsCount] = useState<number>();

  const deleteGoverningBody = async () => {
    await removeGoverningBody(governingBody.id);
    notificationLogic("success", successfulDeleteAction("Керівний орган"));

    history.push("/governingBodies");
  };

  const setPhotos = async (members: GoverningBodyAdmin[], logo: string) => {
    for (let i = 0; i < members.length; i++) {
        members[i].user.imagePath = (
          await userApi.getImage(members[i].user.imagePath)
        ).data;
      }
      setPhotosLoading(false);
    
    if (logo === null) {
      setGoverningBodyLogo64(CityDefaultLogo);
    } else {
      const response = await getGoverningBodyLogo(logo);
      setGoverningBodyLogo64(response.data);
    }
    setGoverningBodyLogoLoading(false);
  };

  function seeDeleteModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити даний керівний орган?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        deleteGoverningBody();
      },
    });
  }

  const getUserAccesses = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    await getUserAccess(user.nameid).then(
      response => {
        setUserAccesses(response.data);
      }
    );
  }

  const getGoverningBody = async () => {
    setLoading(true);
    try {
      const response = await getGoverningBodyById(+id);
      await getUserAccesses();
      setGoverningBodyLogoLoading(true);
      const admins = [
        ...response.data.administration,
        response.data.head,
      ].filter((a) => a !== null);
      setPhotos(
        [...admins],
        response.data.logo
      );
      setGoverningBody(response.data);
      setAdmins(admins);
      setAdminsCount(admins.length);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setvisible(false);
  };

  useEffect(() => {
    getGoverningBody();
  }, []);

  useEffect(() => {
    if (governingBody.governingBodyName.length != 0) {
      PsevdonimCreator.setPseudonimLocation(`governingBodies/${governingBody.governingBodyName}`, `governingBodies/${id}`);
    }
  }, [governingBody])

  return loading ? (
    <Spinner />
  ) : governingBody.id !== 0 ? (
    <Layout.Content className="governingBodyProfile">
      <Row gutter={[0, 15]}>
        <Col span={8} offset={1}></Col>
      </Row>
      <Row gutter={[0, 48]}>
        <Col xl={15} sm={24} xs={24}>
          <Card hoverable className="governingBodyCard">
            <div>
              <Crumb
                current={governingBody.governingBodyName}
                first="/"
                second={url.replace(`/${id}`, "")}
                second_name="Керівні органи"
              />
            </div>
            <Title level={3}>Керівний Орган {governingBody.governingBodyName}</Title>
            <Row className="governingBodyPhotos" gutter={[0, 12]}>
              <Col md={13} sm={24} xs={24}>
                {governingBodyLogoLoading ? (
                  <Skeleton.Avatar active shape={"square"} size={172} />
                ) : (
                    <img src={governingBodyLogo64} alt="GoverningBody" className="governingBodyLogo" />
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
            <Row className="governingBodyInfo">
              <Col md={13} sm={24} xs={24}>
                {governingBody.head ? (
                  <div>
                    <Paragraph>
                      <b>Голова Керівного Органу:</b> {governingBody.head.user.firstName}{" "}
                      {governingBody.head.user.lastName}
                    </Paragraph>
                    {governingBody.head.endDate ? (
                      <Paragraph>
                        <b>Час правління:</b>{" "}
                        {moment(governingBody.head.startDate).format("DD.MM.YYYY")}{" - "}
                        {moment(governingBody.head.endDate).format("DD.MM.YYYY")}
                      </Paragraph>
                    ) : (
                        <Paragraph>
                          <b>Початок правління:</b>{" "}
                          {moment(governingBody.head.startDate).format("DD.MM.YYYY")}
                        </Paragraph>
                      )}
                  </div>
                ) : (
                    <Paragraph>
                      <b>Немає голови Керівного Органу</b>
                    </Paragraph>
                  )}
              </Col>
              <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                {governingBody.email || governingBody.phoneNumber ? (
                  <div>                
                    {governingBody.phoneNumber ? (
                      <Paragraph>
                        <b>Телефон:</b> {governingBody.phoneNumber}
                      </Paragraph>
                    ) : null}
                    {governingBody.email ? (
                      <Paragraph>
                        <b>Пошта:</b> {governingBody.email}
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
            <Row className="governingBodyButtons" justify="center" gutter={[12, 0]}>
              <Col>
                <Button
                  type="primary"
                  className="governingBodyInfoButton"
                  onClick={() => setVisibleDrawer(true)}
                >
                  Деталі
                </Button>
              </Col>
              {userAccesses["AddDecision"] ? (
                <Col>
                  <Button
                    type="primary"
                    className="governingBodyInfoButton"
                    onClick={() => history.push(`/annualreport/table`)}
                  >
                    Додати рішення
                  </Button>
                </Col>
              ) : null}
              {userAccesses["EditGB"] ? (
                <Col xs={24} sm={4}>
                  <Row
                    className="governingBodyIcons"
                    justify={userAccesses["DeleteGB"] ? "center" : "start"}
                  >
                    {userAccesses["EditGB"] ? (
                      <Col>
                        <Tooltip title="Редагувати Керівний Орган">
                          <EditOutlined
                            className="governingBodyInfoIcon"
                            onClick={() =>
                              history.push(`/governingBodies/edit/${governingBody.id}`)
                            }
                          />
                        </Tooltip>
                      </Col>
                    ) : null}
                    {userAccesses["DeleteGB"] ? (
                      <Col offset={1}>
                        <Tooltip title="Видалити Керівний Орган">
                          <DeleteOutlined
                            className="governingBodyInfoIconDelete"
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
          <Card hoverable className="governingBodyCard">
            <Title level={4}>Напрями</Title>
            <Row className="governingBodyItems" justify="center" gutter={[0, 16]}>
              {/*    */}
            </Row>
            <div className="governingBodyMoreButton">
              <PlusSquareFilled
                type="primary"
                className="addReportIcon"
                onClick={() => setvisible(true)}
              ></PlusSquareFilled>
              <Button
                type="primary"
                className="governingBodyInfoButton"
                onClick={() =>
                  history.push(`/governingBodies/administration/${governingBody.id}`)
                }
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
          <Card hoverable className="governingBodyCard">
            <Title level={4}>Провід Керівного Органу <a onClick={() => history.push(`/governingBodies/administration/${governingBody.id}`)}>
            {adminsCount !== 0 ?
                <Badge
                  count={adminsCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a>
            </Title>
            <Row className="governingBodyItems" justify="center" gutter={[0, 16]}>
            {admins.length !== 0 ? (
                admins.map((admin) => (
                  <Col className="governingBodyMemberItem" key={admin.id} xs={12} sm={8}>
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
                  <Paragraph>Ще немає проводу Керівного Органу</Paragraph>
                )}
            </Row>
            <div className="governingBodyMoreButton">
            {userAccesses["AddGBSecretary"] ? (
              <PlusSquareFilled
                type="primary"
                className="addReportIcon"
                onClick={() => setvisible(true)}
              />
              ) : null}
              <Button
                type="primary"
                className="governingBodyInfoButton"
                onClick={() =>
                  history.push(`/governingBodies/administration/${governingBody.id}`)
                }
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="governingBodyCard">
            <Title level={4}>Оголошення</Title>
            <Row className="governingBodyItems" justify="center" gutter={[0, 16]}>
            </Row>
            <div className="governingBodyMoreButton">
              <Button
                type="primary"
                className="governingBodyInfoButton"
                onClick={() => history.push(`/governingBodies/documents/${governingBody.id}`)}
              >
                Більше
              </Button>
              {userAccesses["ManipulatePoster"] ? (
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
          <Card hoverable className="governingBodyCard">
            <Title level={4}>Документообіг Керівного Органу</Title>
            <Row className="governingBodyItems" justify="center" gutter={[0, 16]}>
            </Row>
            <div className="governingBodyMoreButton">
              <Button
                type="primary"
                className="governingBodyInfoButton"
                onClick={() => history.push(`/governingBodies/documents/${governingBody.id}`)}
              >
                Більше
              </Button>
              {userAccesses["ManipulateDocument"] ? (
                <PlusSquareFilled
                  className="addReportIcon"
                  onClick={() => setVisibleModal(true)}
                />
              ) : null}
            </div>
          </Card>
        </Col>
      </Row>
      <GoverningBodyDetailDrawer
        governingBody={governingBody}
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
      ></GoverningBodyDetailDrawer>
      <Modal
        title="Додати діловода"
        visible={visible}
        onOk={handleOk}
        onCancel={handleOk}
        footer={null}
      >
        <AddCitiesNewSecretaryForm
          onAdd={handleOk}
          governingBodyId={+id}>
        </AddCitiesNewSecretaryForm>
      </Modal>
    </Layout.Content>
  ) : (
        <Title level={2}>Керівний Орган не знайдено</Title>
      );
};

export default GoverningBody;
