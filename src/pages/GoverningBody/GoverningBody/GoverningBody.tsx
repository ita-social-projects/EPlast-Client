import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams, useRouteMatch } from "react-router-dom";
import {
  Avatar,
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
  FileTextOutlined,
  EditOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  HomeOutlined, RollbackOutlined
} from "@ant-design/icons";
import moment from "moment";
import {
  getGoverningBodyById,
  getGoverningBodyLogo,
  removeGoverningBody
} from "../../../api/governingBodiesApi";
import "./GoverningBody.less";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import GoverningBodyProfile from "../../../models/GoverningBody/GoverningBodyProfile";
import GoverningBodyDocument from "../../../models/GoverningBody/GoverningBodyDocument";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import GoverningBodyDetailDrawer from "../GoverningBodyDetailDrawer";
import notificationLogic from "../../../components/Notifications/Notification";
import Crumb from "../../../components/Breadcrumb/Breadcrumb";
import { successfulDeleteAction } from "../../../components/Notifications/Messages";
import PsevdonimCreator from "../../../components/HistoryNavi/historyPseudo";
import AddCitiesNewSecretaryForm from "../AddAdministratorModal/AddGoverningBodiesSecretaryForm";

const GoverningBody = () => {
  const history = useHistory();
  const { id } = useParams();
  const { url } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [governingBody, setGoverningBody] = useState<GoverningBodyProfile>(new GoverningBodyProfile());
  const [governingBodyLogo64, setGoverningBodyLogo64] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  //const [admins, setAdmins] = useState<GoverningBodyAdmin[]>([]);
  //const [documents, setDocuments] = useState<GoverningBodyDocument[]>([]);
  const [canCreate, setCanCreate] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canJoin, setCanJoin] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [membersCount, setMembersCount] = useState<number>();
  const [adminsCount, setAdminsCount] = useState<number>();
  const [followersCount, setFollowersCount] = useState<number>();
  const [governingBodyLogoLoading, setGoverningBodyLogoLoading] = useState<boolean>(false);
  const [visible, setvisible] = useState<boolean>(false);
  //const [document, setDocument] = useState<GoverningBodyDocument>(new GoverningBodyDocument());

  const deleteGoverningBody = async () => {
    await removeGoverningBody(governingBody.id);
    notificationLogic("success", successfulDeleteAction("Керівний орган"));

    // admins.map(async (ad) => {
    //   await NotificationBoxApi.createNotifications(
    //     [ad.userId],
    //     `На жаль керівний орган: '${governingBody.governingBodyName}', в якому ви займали роль: '${ad.adminType.adminTypeName}' було видалено`,
    //     NotificationBoxApi.NotificationTypes.UserNotifications
    //   );
    // });
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

  const onAdd = (newDocument: GoverningBodyDocument) => {
    // if (documents.length < 6) {
    //   setDocuments([...documents, newDocument]);
    // }
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

  const getGoverningBody = async () => {
    setLoading(true);
    try {
      const response = await getGoverningBodyById(+id);
      setPhotosLoading(true);
      setGoverningBodyLogoLoading(true);
      // const admins = [
      //   ...response.data.administration,
      //   response.data.head,
      // ].filter((a) => a !== null);

      setPhotos(response.data.governingBody.logo);
      setGoverningBody(response.data.governingBody);
      //setAdmins(admins);
     // setDocuments(response.data.documents);
      setCanCreate(true);
      setCanEdit(true);
      setCanJoin(response.data.canJoin);
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
              {canEdit ? (
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
              {canEdit ? (
                <Col xs={24} sm={4}>
                  <Row
                    className="governingBodyIcons"
                    justify={canCreate ? "center" : "start"}
                  >
                    {canEdit ? (
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
                    {canCreate ? (
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
              {adminsCount !== 0 ?
                <Badge
                  count={adminsCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
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
              {canEdit ? (
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
              {canEdit ? (
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
