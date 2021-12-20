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
  FileTextOutlined,
  LockOutlined
} from "@ant-design/icons";
import {
  getAllAnnouncements,
  getGoverningBodyById,
  getGoverningBodyLogo,
  getUserAccess,
  removeGoverningBody
} from "../../../api/governingBodiesApi";
import "./GoverningBody.less";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import GoverningBodyProfile from "../../../models/GoverningBody/GoverningBodyProfile";
import SectorProfile from "../../../models/GoverningBody/Sector/SectorProfile";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import GoverningBodyDetailDrawer from "../GoverningBodyDetailDrawer";
import notificationLogic from "../../../components/Notifications/Notification";
import Crumb from "../../../components/Breadcrumb/Breadcrumb";
import { successfulDeleteAction } from "../../../components/Notifications/Messages";
import PsevdonimCreator from "../../../components/HistoryNavi/historyPseudo";
import AddGoverningBodiesSecretaryForm from "../AddAdministratorModal/AddGoverningBodiesSecretaryForm";
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
import GoverningBodyAdmin from "../../../models/GoverningBody/GoverningBodyAdmin";
import Paragraph from "antd/lib/typography/Paragraph";
import userApi from "../../../api/UserApi";
import moment from "moment";
import GoverningBodyDocument from "../../../models/GoverningBody/GoverningBodyDocument";
import GoverningBodyAnnouncement from "../../../models/GoverningBody/GoverningBodyAnnouncement";
import AddDocumentModal from "../AddDocumentModal/AddDocumentModal";
import { getSectorLogo } from "../../../api/governingBodySectorsApi";

const GoverningBody = () => {
  const history = useHistory();
  const { id } = useParams();
  const { url } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [governingBody, setGoverningBody] = useState<GoverningBodyProfile>(new GoverningBodyProfile());
  const [governingBodyLogo64, setGoverningBodyLogo64] = useState<string>("");
  const [documents, setDocuments] = useState<GoverningBodyDocument[]>([]);
  const [documentsCount, setDocumentsCount] = useState<number>(0);
  const [document, setDocument] = useState<GoverningBodyDocument>(new GoverningBodyDocument());
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [governingBodyLogoLoading, setGoverningBodyLogoLoading] = useState<boolean>(false);
  const [adminsPhotosLoading, setAdminsPhotosLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{[key: string] : boolean}>({});
  const [admins, setAdmins] = useState<GoverningBodyAdmin[]>([]);
  const [governingBodyHead, setGoverningBodyHead] = useState<GoverningBodyAdmin>();
  const [sectors, setSectors] = useState<SectorProfile[]>([]);
  const [sectorsPhotosLoading, setSectorsPhotosLoading] = useState<boolean>(false);
  const [announcements, setAnnouncements] = useState<GoverningBodyAnnouncement[]>([]);

  const deleteGoverningBody = async () => {
    await removeGoverningBody(governingBody.id);
    notificationLogic("success", successfulDeleteAction("Керівний орган"));

    history.push("/governingBodies");
  };

  const setPhotos = async (members: GoverningBodyAdmin[], logo: string, sectors: SectorProfile[]) => {
    for (let i = 0; i < members.length; ++i) {
        members[i].user.imagePath = (
          await userApi.getImage(members[i].user.imagePath)
        ).data;
    }
    setAdminsPhotosLoading(false);
    
    if (logo === null) {
      setGoverningBodyLogo64(CityDefaultLogo);
    } else {
      const response = await getGoverningBodyLogo(logo);
      setGoverningBodyLogo64(response.data);
    }
    setGoverningBodyLogoLoading(false);

    for (let i = 0; i < sectors.length; ++i) {
      if (sectors[i].logo === null)
        sectors[i].logo = CityDefaultLogo;
      else {
        sectors[i].logo = (
          await getSectorLogo(sectors[i].logo!)
        ).data;
      }
    }
    setSectorsPhotosLoading(false);
  };

  const onDocumentAdd = (newDocument: GoverningBodyDocument) => {
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
    setDocumentsCount(documentsCount + 1);
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
    let result :any
    await getUserAccess(user.nameid).then(
      response => {
        result = response
        setUserAccesses(response.data);
      }
    );
    return result
  }

  const getGoverningBody = async () => {
    setLoading(true);
    try {
      let userAccesses = await getUserAccesses();
      if(userAccesses.data["ViewAnnouncements"]){
        const res: GoverningBodyAnnouncement[]  = (await getAllAnnouncements()).data;
        let shortListedAnnoncements: GoverningBodyAnnouncement[] = [];
        for(let i = 0; i < res.length && i < 3; i++) {
          res[i].text = res[i].text.substring(0,40) + (res[i].text.length > 40? "...": "")
          shortListedAnnoncements = [...shortListedAnnoncements, res[i]]
        }
        setAnnouncements(shortListedAnnoncements)
      }
      const response = await getGoverningBodyById(+id);
      const governingBodyViewModel = response.data.governingBodyViewModel;

      const admins = [
        ...governingBodyViewModel.administration,
        governingBodyViewModel.head,
      ].filter(a => a !== null);

      const responseSectors = governingBodyViewModel.sectors;

      setGoverningBodyLogoLoading(true);
      setSectorsPhotosLoading(true);
      await setPhotos(
        [...admins],
        governingBodyViewModel.logo,
        responseSectors
      );

      setGoverningBody(governingBodyViewModel);
      setAdmins(admins);
      setGoverningBodyHead(governingBodyViewModel.head)
      setDocuments(governingBodyViewModel.documents);
      setDocumentsCount(response.data.documentsCount);
      setSectors(governingBodyViewModel.sectors);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAdd = () => {
    setVisible(false);

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
        <Col span={8} offset={1} />
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
                {governingBodyHead ? (
                  <div>
                    <Paragraph>
                      <b>Голова Керівного Органу:</b> {governingBodyHead.user.firstName}{" "}
                      {governingBodyHead.user.lastName}
                    </Paragraph>
                    {governingBodyHead.endDate ? (
                      <Paragraph>
                        <b>Час правління:</b>{" "}
                        {moment.utc(governingBodyHead.startDate).local().format("DD.MM.YYYY")}{" - "}
                        {moment.utc(governingBodyHead.endDate).local().format("DD.MM.YYYY")}
                      </Paragraph>
                    ) : (
                        <Paragraph>
                          <b>Початок правління:</b>{" "}
                          {moment.utc(governingBodyHead.startDate).local().format("DD.MM.YYYY")}
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
                    onClick={() => history.push(`/decisions`)}
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
            <Title level={4}>Напрями <a onClick={() => history.push(`/governingBodies/${governingBody.id}/sectors`)}>
              {sectors.length !== 0 ?
                <Badge
                  count={sectors.length}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a></Title>
            <Row className="governingBodyItems" justify="center" gutter={[0, 16]}>
              {sectors.length !== 0 ? (
                sectors.map((sector) => (
                  <Col className="governingBodyMemberItem" key={sector.id} xs={12} sm={8}>
                    <div
                      onClick={() =>
                        history.push(`${id}/sectors/${sector.id}`)
                      }
                    >
                      {sectorsPhotosLoading ? (
                        <Skeleton.Avatar active size={64} />
                      ) : (
                        <Avatar size={64} src={sector.logo === null ? undefined : sector.logo} />
                      )}
                      <p className="userName">{sector.name}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає напрямів Керівного Органу</Paragraph>
              )}
            </Row>
            <div className="governingBodyMoreButton">
              {userAccesses["AddGBSector"] ? (
                <PlusSquareFilled
                type="primary"
                className="addReportIcon"
                onClick={() => history.push(id + '/sectors/new')}
                />
                ) : null
              }
              <Button
                type="primary"
                className="governingBodyInfoButton"
                onClick={() =>
                  history.push(`/governingBodies/${governingBody.id}/sectors`)
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
                      {adminsPhotosLoading ? (
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
                  <Paragraph>Ще немає проводу Керівного Органу</Paragraph>
                )}
            </Row>
            <div className="governingBodyMoreButton">
            {userAccesses["AddGBSecretary"] ? (
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
              {userAccesses["ViewAnnouncements"] ?  
                announcements.length > 0 ?
                  announcements.map((announcement) => (
                    <Col
                      className="cityMemberItem"
                      xs={12}
                      sm={8}
                      key={announcement.id}
                      style={{padding: "0.3rem"}}
                    >
                      <Paragraph><strong>{announcement.user.firstName}</strong></Paragraph>
                      <Paragraph style={{overflow:"hidden",textOverflow:"ellipsis", wordBreak:"break-word"}}>{announcement.text}</Paragraph>
                      <Paragraph>{moment.utc(announcement.date).local().format("DD.MM.YYYY")}</Paragraph>
                    </Col>
                    )) 
                  : 
                  <Col>
                    <Paragraph>Ще немає оголошень</Paragraph>
                  </Col>
                : 
                <Col>
                   <Paragraph strong>У тебе немає доступу до оголошень!</Paragraph>
                   <LockOutlined style={{ fontSize:"150px" }} />
                </Col>}
            </Row>
            {userAccesses["ViewAnnouncements"] ?
              <div className="governingBodyMoreButton">
                <Button
                  type="primary"
                  className="governingBodyInfoButton"
                  onClick={() => history.push(`/announcements`)}
                >
                  Більше
                </Button>
              </div>
            : null}
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 1 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="governingBodyCard">
            <Title level={4}>Документообіг Керівного Органу{' '}
              <a onClick={() => userAccesses["ViewDocument"] ? history.push(`/governingBodies/documents/${governingBody.id}`) : undefined}>
                {documentsCount !== 0 ?
                  <Badge
                    count={documentsCount}
                    style={{ backgroundColor: "#3c5438" }}
                  /> : null
                }
              </a>
            </Title>
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
                            {d.governingBodyDocumentType.name}
                        </p>
                        </div>
                    </Col>
                    ))
                ) : (
                    <Paragraph>Ще немає документів Керівного Органу</Paragraph>
                    )}
            </Row>
            {userAccesses["ViewDocument"]?
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
            :null
            }
          </Card>
        </Col>
      </Row>
      <GoverningBodyDetailDrawer
        governingBody={governingBody}
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
      />
      <Modal
        title="Додати діловода"
        visible={visible}
        onOk={handleAdminAdd}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <AddGoverningBodiesSecretaryForm
          onAdd={handleAdminAdd}
          admins={admins}
          setAdmins={setAdmins}
          setGoverningBodyHead={setGoverningBodyHead}
          governingBodyId={+id}>
        </AddGoverningBodiesSecretaryForm>
      </Modal>
      {userAccesses["ManipulateDocument"] ? (
        <AddDocumentModal
          governingBodyId={+id}
          document={document}
          setDocument={setDocument}
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          onAdd={onDocumentAdd}
        />
      ) : null}
    </Layout.Content>
  ) : (
        <Title level={2}>Керівний Орган не знайдено</Title>
      );
};

export default GoverningBody;