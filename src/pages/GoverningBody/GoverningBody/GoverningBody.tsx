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
  const [visible, setvisible] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});

  const deleteGoverningBody = async () => {
    await removeGoverningBody(governingBody.id);
    notificationLogic("success", successfulDeleteAction("Керівний орган"));

    history.push("/governingBodies");
  };

  const setPhotos = async (logo: string) => {

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
      setPhotos(response.data.governingBody.logo);
      setGoverningBody(response.data.governingBody);
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
                        <Tooltip title="Редагувати керівний орган">
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
                        <Tooltip title="Видалити керівний орган">
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
          xl={{ span: 7 }}
          md={11}
          sm={24}
          xs={24}
        >
          <Card hoverable className="governingBodyCard">
            <Title level={4}>Провід керінвого органу <a onClick={() => history.push(`/governingBodies/administration/${governingBody.id}`)}>
              
            </a>
            </Title>
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

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="governingBodyCard">
            <Title level={4}>Документообіг керівного органу</Title>
            <Row className="governingBodyItems" justify="center" gutter={[0, 16]}>
              {/* {documents.length !== 0 ? (
                documents.map((document) => (
                  <Col
                    className="governingBodyMemberItem"
                    xs={12}
                    sm={8}
                    key={document.id}
                  >
                    <div>
                      <FileTextOutlined className="documentIcon" />
                      <p className="documentText">
                        {document.governingBodyDocumentType.name}
                      </p>
                    </div>
                  </Col>
                ))
              ) : (
                  <Paragraph>Ще немає документів керівного органу</Paragraph>
                )} */}
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

      {/* {canEdit ? (
        <AddDocumentModal
          governingBodyId={+id}
          document={document}
          setDocument={setDocument}
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          onAdd={onAdd}
        ></AddDocumentModal>
      ) : null} */}
    </Layout.Content>
  ) : (
        <Title level={2}>Керівний орган не знайдено</Title>
      );
};

export default GoverningBody;
