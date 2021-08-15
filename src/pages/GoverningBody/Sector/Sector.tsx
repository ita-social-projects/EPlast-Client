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
  ExclamationCircleOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import {
  getSectorById,
  getSectorLogo,
  getUserAccess,
  removeSector
} from "../../../api/governingBodySectorsApi";
import "../GoverningBody/GoverningBody.less";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import SectorProfile from "../../../models/GoverningBody/Sector/SectorProfile";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import SectorDetailDrawer from "./SectorDetailDrawer";
import notificationLogic from "../../../components/Notifications/Notification";
import Crumb from "../../../components/Breadcrumb/Breadcrumb";
import { successfulDeleteAction } from "../../../components/Notifications/Messages";
import PsevdonimCreator from "../../../components/HistoryNavi/historyPseudo";
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
import SectorAdmin from "../../../models/GoverningBody/Sector/SectorAdmin";
import Paragraph from "antd/lib/typography/Paragraph";
import userApi from "../../../api/UserApi";
import moment from "moment";
import SectorDocument from "../../../models/GoverningBody/Sector/SectorDocument";
import AddDocumentModal from "./AddDocumentModal";
import AddSectorAdminForm from "./AddSectorAdminForm";

const Sector = () => {
  const history = useHistory();
  const { governingBodyId, sectorId } = useParams();
  const { url } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState<SectorProfile>(new SectorProfile());
  const [sectorLogo64, setSectorLogo64] = useState<string>("");
  const [documents, setDocuments] = useState<SectorDocument[]>([]);
  const [documentsCount, setDocumentsCount] = useState<number>(0);
  const [document, setDocument] = useState<SectorDocument>(new SectorDocument());
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [sectorLogoLoading, setSectorLogoLoading] = useState<boolean>(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});
  const [admins, setAdmins] = useState<SectorAdmin[]>([]);
  const [sectorHead, setSectorHead] = useState<SectorAdmin>();

  const deleteSector = async () => {
    await removeSector(sector.id);
    notificationLogic("success", successfulDeleteAction("Напрям керівного органу"));
    history.push("/governingBodies/" + governingBodyId);
  };

  const setPhotos = async (members: SectorAdmin[], logo: string) => {
    for (let i = 0; i < members.length; i++) {
      members[i].user.imagePath = (
        await userApi.getImage(members[i].user.imagePath)
      ).data;
    }
    setPhotosLoading(false);

    if (logo === null) {
      setSectorLogo64(CityDefaultLogo);
    } else {
      const response = await getSectorLogo(logo);
      setSectorLogo64(response.data);
    }
    setSectorLogoLoading(false);
  };

  const onDocumentAdd = (newDocument: SectorDocument) => {
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
    setDocumentsCount(documentsCount + 1);
  };

  function seeDeleteModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити даний напрям керівного органу?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        deleteSector();
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

  const getSector = async () => {
    setLoading(true);
    try {
      const response = await getSectorById(+sectorId);
      const sectorViewModel = response.data.sectorViewModel
      await getUserAccesses();

      setSectorLogoLoading(true);
      const admins = [
        ...sectorViewModel.administration,
        sectorViewModel.head,
      ].filter(a => a !== null);

      await setPhotos(
        [...admins],
        sectorViewModel.logo
      );

      setSector(sectorViewModel);
      setAdmins(admins);
      setSectorHead(sectorViewModel.head)
      setDocuments(sectorViewModel.documents);
      setDocumentsCount(response.data.documentsCount);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAdd = () => {
    setVisible(false);
  };

  useEffect(() => {
    getSector();
  }, []);

  useEffect(() => {
    if (sector.name.length != 0) {
      PsevdonimCreator.setPseudonimLocation(`sectors/${sector.name}`, `sectors/${sectorId}`);
    }
  }, [sector]);

  return loading ? (
    <Spinner />
  ) : sector.id !== 0 ? (
    <Layout.Content className="governingBodyProfile">
      <Row gutter={[0, 15]}>
        <Col span={8} offset={1} />
      </Row>
      <Row gutter={[0, 48]}>
        <Col xl={15} sm={24} xs={24}>
          <Card hoverable className="governingBodyCard">
            <div>
              <Crumb
                current={sector.name}
                first="/"
                second={url.replace(`/${sectorId}`, "")}
                second_name="Напрями керівних органів"
              />
            </div>
            <Title level={3}>Напрям Керівного Органу {sector.name}</Title>
            <Row className="governingBodyPhotos" gutter={[0, 12]}>
              <Col md={13} sm={24} xs={24}>
                {sectorLogoLoading ? (
                  <Skeleton.Avatar active shape={"square"} size={172} />
                ) : (
                  <img src={sectorLogo64} alt="GoverningBodySector" className="governingBodyLogo" />
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
                {sectorHead ? (
                  <div>
                    <Paragraph>
                      <b>Голова Напряму Керівного Органу:</b> {sectorHead.user.firstName}{" "}
                      {sectorHead.user.lastName}
                    </Paragraph>
                    {sectorHead.endDate ? (
                      <Paragraph>
                        <b>Час правління:</b>{" "}
                        {moment(sectorHead.startDate).format("DD.MM.YYYY")}{" - "}
                        {moment(sectorHead.endDate).format("DD.MM.YYYY")}
                      </Paragraph>
                    ) : (
                      <Paragraph>
                        <b>Початок правління:</b>{" "}
                        {moment(sectorHead.startDate).format("DD.MM.YYYY")}
                      </Paragraph>
                    )}
                  </div>
                ) : (
                  <Paragraph>
                    <b>Немає голови Напряму Керівного Органу</b>
                  </Paragraph>
                )}
              </Col>
              <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                {sector.email || sector.phoneNumber ? (
                  <div>
                    {sector.phoneNumber ? (
                      <Paragraph>
                        <b>Телефон:</b> {sector.phoneNumber}
                      </Paragraph>
                    ) : null}
                    {sector.email ? (
                      <Paragraph>
                        <b>Пошта:</b> {sector.email}
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
              {userAccesses["EditSector"] ? (
                <Col xs={24} sm={4}>
                  <Row
                    className="governingBodyIcons"
                    justify={userAccesses["DeleteGB"] ? "center" : "start"}
                  >
                    {userAccesses["EditSector"] ? (
                      <Col>
                        <Tooltip title="Редагувати Напрям Керівного Органу">
                          <EditOutlined
                            className="governingBodyInfoIcon"
                            onClick={() =>
                              history.push(`/governingBodies/${governingBodyId}/sectors/edit/${sector.id}`)
                            }
                          />
                        </Tooltip>
                      </Col>
                    ) : null}
                    {userAccesses["DeleteSector"] ? (
                      <Col offset={1}>
                        <Tooltip title="Видалити Напрям Керівного Органу">
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

        <Col
          xl={{ span: 7, offset: 1 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="governingBodyCard">
            <Title level={3}>Опис</Title>
            <Row className="governingBodyItems" justify="center" gutter={[0, 12]}>
              <div style={{'wordBreak': 'break-word'}}>
                <Paragraph>
                {sector.description !== null && sector.description.length > 0 ?
                  sector.description
                  : "Ще немає опису Напряму"}
                </Paragraph>
              </div>
            </Row>
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 0 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="governingBodyCard">
            <Title level={4}>Провід <a onClick={() => history.push(`/governingBodies/${governingBodyId}/sectors/${sector.id}/administration`)}>
              {admins.length !== 0 ?
                <Badge
                  count={admins.length}
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
                      onClick={() => {
                        if (userAccesses["GoToSecretaryProfile"]) {
                          history.push(`/userpage/main/${admin.userId}`)
                        }
                      }}
                    >
                      {photosLoading ? (
                        <Skeleton.Avatar active size={64} />
                      ) : (
                        <Avatar size={64} src={admin.user.imagePath} />
                      )}
                      <p className="userName">{admin.user.firstName}</p>
                      <p className="userName">{admin.user.lastName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає проводу Напряму</Paragraph>
              )}
            </Row>
            <div className="governingBodyMoreButton">
              {userAccesses["AddSecretary"] ? (
                <PlusSquareFilled
                  type="primary"
                  className="addReportIcon"
                  onClick={() => setVisible(true)}
                />
              ) : null}
              <Button
                type="primary"
                className="governingBodyInfoButton"
                onClick={() =>
                  history.push('/governingBodies/' + governingBodyId + '/sectors/' + sector.id + '/administration')
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
                onClick={() => history.push(`/GetAllAnnouncements`)}
              >
                Більше
              </Button>
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
            <Title level={4}>Документообіг <a onClick={() => history.push(`/governingBodies/${governingBodyId}/sectors/${sector.id}/documents`)}>
              {documentsCount !== 0 ?
                <Badge
                  count={documentsCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a></Title>
            <Row className="governingBodyItems" justify="center" gutter={[0, 16]}>
              {documents.length !== 0 ? (
                documents.map((d) => (
                  <Col
                    className="governingBodyDocumentItem"
                    xs={12}
                    sm={8}
                    key={d.id}
                  >
                    <div>
                      <FileTextOutlined className="documentIcon" />
                      <p className="documentText">
                        {d.sectorDocumentType.name}
                      </p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає документів Напряму</Paragraph>
              )}
            </Row>
            <div className="governingBodyMoreButton">
              <Button
                type="primary"
                className="governingBodyInfoButton"
                onClick={() => history.push(`/governingBodies/${governingBodyId}/sectors/${sector.id}/documents`)}
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
      <SectorDetailDrawer
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
        sector={sector}
      />
      <Modal
        title="Додати діловода"
        visible={visible}
        onOk={handleAdminAdd}
        onCancel={handleAdminAdd}
        footer={null}
      >
        <AddSectorAdminForm
          onAdd={handleAdminAdd}
          admins={admins}
          setAdmins={setAdmins}
          setSectorHead={setSectorHead}
          sectorId={+sectorId}
          governingBodyId={+governingBodyId}
        >
        </AddSectorAdminForm>
      </Modal>
      {userAccesses["ManipulateDocument"] ? (
        <AddDocumentModal
          sectorId={+sectorId}
          document={document}
          setDocument={setDocument}
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          onAdd={onDocumentAdd}
        />
      ) : null}
    </Layout.Content>
  ) : (
    <Title level={2}>Напрям Керівного Органу не знайдено</Title>
  );
};

export default Sector;
