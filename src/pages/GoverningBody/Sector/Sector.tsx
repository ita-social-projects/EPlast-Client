/* eslint-disable no-plusplus */
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
  List,
} from "antd";
import {
  EditOutlined,
  PlusSquareFilled,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  LockOutlined,
  PushpinFilled,
} from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";
import jwt from "jwt-decode";
import moment from "moment";
import Title from "antd/lib/typography/Title";
import { Markup } from "interweave";
import {
  getSectorById,
  getSectorLogo,
  getUserAccess,
  removeSector,
  getSectorAnnouncementsById,
  addSectorAnnouncement,
} from "../../../api/governingBodySectorsApi";
import "../GoverningBody/GoverningBody.less";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import SectorProfile from "../../../models/GoverningBody/Sector/SectorProfile";
import Spinner from "../../Spinner/Spinner";
import SectorDetailDrawer from "./SectorDetailDrawer";
import notificationLogic from "../../../components/Notifications/Notification";
import Crumb from "../../../components/Breadcrumb/Breadcrumb";
import { successfulDeleteAction } from "../../../components/Notifications/Messages";
import PsevdonimCreator from "../../../components/HistoryNavi/historyPseudo";
import AuthLocalStorage from "../../../AuthLocalStorage";
import SectorAdmin from "../../../models/GoverningBody/Sector/SectorAdmin";
import userApi from "../../../api/UserApi";
import SectorDocument from "../../../models/GoverningBody/Sector/SectorDocument";
import AddDocumentModal from "./AddDocumentModal";
import AddSectorAdminForm from "./AddSectorAdminForm";
import GoverningBodyAnnouncement from "../../../models/GoverningBody/GoverningBodyAnnouncement";
import AddAnnouncementModal from "./SectorAnnouncement/AddAnnouncementModal";
import { getUsersByAllRoles } from "../../../api/adminApi";
import { Roles } from "../../../models/Roles/Roles";
import ShortUserInfo from "../../../models/UserTable/ShortUserInfo";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import PicturesWall, {
  AnnouncementGallery,
} from "../Announcement/PicturesWallModal";
import NewBreadcrumbs from "../../../components/Breadcrumb/NewBreadcrumbs";

const classes = require("../Announcement/Announcement.module.css");

const Sector = () => {
  const history = useHistory();
  const { governingBodyId, sectorId }: any = useParams();
  const { url } = useRouteMatch();
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState<SectorProfile>(new SectorProfile());
  const [sectorLogo64, setSectorLogo64] = useState<string>("");
  const [documents, setDocuments] = useState<SectorDocument[]>([]);
  const [documentsCount, setDocumentsCount] = useState<number>(0);
  const [document, setDocument] = useState<SectorDocument>(
    new SectorDocument()
  );
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [sectorLogoLoading, setSectorLogoLoading] = useState<boolean>(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [admins, setAdmins] = useState<SectorAdmin[]>([]);
  const [sectorHead, setSectorHead] = useState<SectorAdmin>();
  const [announcements, setAnnouncements] = useState<
    GoverningBodyAnnouncement[]
  >([]);
  const [announcementsCount, setAnnouncementsCount] = useState<number>(0);
  const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false);

  const deleteSector = async () => {
    await removeSector(sector.id);
    notificationLogic(
      "success",
      successfulDeleteAction("Напрям керівного органу")
    );
    history.push(`/regionsBoard/governingBodies/${governingBodyId}`);
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
    const user: any = jwt(AuthLocalStorage.getToken() as string);
    let result: any;
    await getUserAccess(user.nameid).then((response) => {
      result = response;
      setUserAccesses(response.data);
    });
    return result;
  };

  const getSector = async () => {
    setLoading(true);
    try {
      const response = await getSectorById(+sectorId);
      const sectorViewModel = response.data.sectorViewModel;
      await getUserAccesses();

      setSectorLogoLoading(true);
      const admins = [
        ...sectorViewModel.administration,
        sectorViewModel.head,
      ].filter((a) => a !== null);

      await setPhotos([...admins], sectorViewModel.logo);
      setSector(sectorViewModel);
      setAdmins(admins);
      setSectorHead(sectorViewModel.head);
      setDocuments(sectorViewModel.documents);
      setDocumentsCount(response.data.documentsCount);
      setAnnouncementsCount(response.data.announcementsCount);
      setAnnouncements(sectorViewModel.announcements);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    let result: any;
    await getUsersByAllRoles([[Roles.RegisteredUser]], false).then(
      (response) => {
        result = response;
      }
    );
    return result;
  };
  const newAnnouncementNotification = async () => {
    const usersId = ((await getUsers()).data as ShortUserInfo[]).map(
      (x) => x.id
    );
    await NotificationBoxApi.createNotifications(
      usersId,
      "Додане нове оголошення.",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/sector/announcements/${governingBodyId}/${sectorId}/1`,
      `Переглянути`
    );
    if (sectorId) {
      await NotificationBoxApi.createNotifications(
        usersId,
        "Додане нове оголошення.",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/sector/announcements/${governingBodyId}/${sectorId}/1`,
        `Переглянути`
      );
    } else {
      await NotificationBoxApi.createNotifications(
        usersId,
        "Додане нове оголошення.",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/governingBodies/announcements/${governingBodyId}/1`,
        `Переглянути`
      );
    }
  };

  const onAnnouncementAdd = async (
    title: string,
    text: string,
    images: string[],
    isPined: boolean
  ) => {
    setVisibleAddModal(false);
    setLoading(true);
    newAnnouncementNotification();
    const announcementId = (
      await addSectorAnnouncement(
        title,
        text,
        images,
        isPined,
        governingBodyId,
        sectorId
      )
    ).data;
    const newAnnouncement: GoverningBodyAnnouncement = (
      await getSectorAnnouncementsById(announcementId)
    ).data;
    setAnnouncements((old: GoverningBodyAnnouncement[]) => [
      newAnnouncement,
      ...old,
    ]);
    setLoading(false);
    notificationLogic("success", "Оголошення опубліковано");
    getSector();
  };

  const handleAdminAdd = () => {
    setVisible(false);
  };

  const showFullAnnouncement = async (annId: number) => {
    const pics: AnnouncementGallery[] = [];
    await getSectorAnnouncementsById(annId).then((response) => {
      response.data.images.map((image: any) => {
        pics.push({
          announcementId: image.id,
          fileName: image.imageBase64,
        });
        return image;
      });
      return Modal.info({
        title: (
          <div className={classes.announcementDate}>
            {response.data.user.firstName} {response.data.user.lastName}
            <div>{moment(response.data.date).format("DD.MM.YYYY")}</div>
          </div>
        ),
        content: (
          <div>
            <Markup content={response.data.title} />
            <Markup content={response.data.text} />
            <div>
              <PicturesWall pictures={pics} key="removePictures" />
            </div>
          </div>
        ),
        maskClosable: true,
        icon: null,
      });
    });
  };

  useEffect(() => {
    getSector();
  }, []);

  useEffect(() => {
    if (sector.name.length != 0) {
      PsevdonimCreator.setPseudonimLocation(
        `sectors/${sector.name}`,
        `sectors/${sectorId}`
      );
    }
  }, [sector]);

  const announcementDescription = (item: GoverningBodyAnnouncement) => {
    return (
      <>
        {moment(item.date).format("DD.MM.YYYY")}{" "}
        {item.isPined ? <PushpinFilled /> : null}
      </>
    );
  };

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
            <NewBreadcrumbs />
            <Title level={3}>Напрям Керівного Органу {sector.name}</Title>
            <Row className="governingBodyPhotos" gutter={[0, 12]}>
              <Col md={13} sm={24} xs={24}>
                {sectorLogoLoading ? (
                  <Skeleton.Avatar active shape="square" size={172} />
                ) : (
                  <img
                    src={sectorLogo64}
                    alt="GoverningBodySector"
                    className="governingBodyLogo"
                  />
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
                      <b>Голова Напряму Керівного Органу:</b>{" "}
                      {sectorHead.user.firstName} {sectorHead.user.lastName}
                    </Paragraph>
                    {sectorHead.endDate ? (
                      <Paragraph>
                        <b>Час правління:</b>{" "}
                        {moment
                          .utc(sectorHead.startDate)
                          .local()
                          .format("DD.MM.YYYY")}
                        {" - "}
                        {moment
                          .utc(sectorHead.endDate)
                          .local()
                          .format("DD.MM.YYYY")}
                      </Paragraph>
                    ) : (
                      <Paragraph>
                        <b>Початок правління:</b>{" "}
                        {moment
                          .utc(sectorHead.startDate)
                          .local()
                          .format("DD.MM.YYYY")}
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
            <Row
              className="governingBodyButtons"
              justify="center"
              gutter={[12, 0]}
            >
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
                              history.push(
                                `/governingBodies/${governingBodyId}/sectors/edit/${sector.id}`
                              )
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

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="governingBodyCard">
            <Title level={4}>
              Оголошення
              <a
                onClick={() =>
                  history.push(
                    `/sector/announcements/${governingBodyId}/${sectorId}/1`
                  )
                }
              >
                {announcementsCount !== 0 &&
                userAccesses["ViewAnnouncements"] ? (
                  <Badge
                    count={announcementsCount}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row
              className="governingBodyItems"
              justify="center"
              gutter={[0, 16]}
            >
              {userAccesses["ViewAnnouncements"] ? (
                announcementsCount > 0 ? (
                  <div
                    id="scrollableDiv"
                    style={{
                      width: "100%",
                      height: 400,
                      overflow: "hidden",
                    }}
                  >
                    <List
                      dataSource={announcements}
                      renderItem={(item) => (
                        <List.Item
                          style={{ cursor: "pointer" }}
                          key={item.id}
                          onClick={() => showFullAnnouncement(item.id)}
                        >
                          <List.Item.Meta
                            title={<Markup content={item.title} />}
                            description={announcementDescription(item)}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                ) : (
                  <Col>
                    <Paragraph>Ще немає оголошень</Paragraph>
                  </Col>
                )
              ) : (
                <Col>
                  <Paragraph strong>
                    У тебе немає доступу до оголошень!
                  </Paragraph>
                  <LockOutlined style={{ fontSize: "150px" }} />
                </Col>
              )}
            </Row>
            {userAccesses["ViewAnnouncements"] ? (
              <div className="governingBodyMoreButton">
                <Button
                  type="primary"
                  className="governingBodyInfoButton"
                  onClick={() =>
                    history.push(
                      `/sector/announcements/${governingBodyId}/${sectorId}/1`
                    )
                  }
                >
                  Більше
                </Button>
                {userAccesses["AddAnnouncement"] ? (
                  <PlusSquareFilled
                    type="primary"
                    className="addReportIcon"
                    onClick={() => setVisibleAddModal(true)}
                  />
                ) : null}
              </div>
            ) : null}
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 0 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="governingBodyCard">
            <Title level={4}>
              Провід напряму керівного органу
              <a
                onClick={() =>
                  history.push(
                    `/governingBodies/${governingBodyId}/sectors/${sector.id}/administration`
                  )
                }
              >
                {admins.length !== 0 ? (
                  <Badge
                    count={admins.length}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row
              className="governingBodyItems"
              justify="center"
              gutter={[0, 16]}
            >
              {admins.length !== 0 ? (
                admins.map((admin) => (
                  <Col
                    className="governingBodyMemberItem"
                    key={admin.id}
                    xs={12}
                    sm={8}
                  >
                    <div
                      onClick={() => {
                        if (userAccesses["GoToSecretaryProfile"]) {
                          history.push(`/userpage/main/${admin.userId}`);
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
                  history.push(
                    `/governingBodies/${governingBodyId}/sectors/${sector.id}/administration`
                  )
                }
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="governingBodyCard">
            <Title level={3}>Опис</Title>
            <Row
              className="governingBodyItems"
              justify="center"
              gutter={[0, 12]}
            >
              <div style={{ wordBreak: "break-word" }}>
                <Paragraph>
                  {sector.description !== null && sector.description.length > 0
                    ? sector.description
                    : "Ще немає опису Напряму"}
                </Paragraph>
              </div>
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
            <Title level={4}>
              Документообіг Напряму{" "}
              <a
                onClick={() =>
                  userAccesses["ViewDocument"]
                    ? history.push(
                        `/governingBodies/${governingBodyId}/sectors/${sector.id}/documents`
                      )
                    : undefined
                }
              >
                {documentsCount !== 0 ? (
                  <Badge
                    count={documentsCount}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row
              className="governingBodyItems"
              justify="center"
              gutter={[0, 16]}
            >
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
            {userAccesses["ViewDocument"] ? (
              <div className="governingBodyMoreButton">
                <Button
                  type="primary"
                  className="governingBodyInfoButton"
                  onClick={() =>
                    history.push(
                      `/governingBodies/${governingBodyId}/sectors/${sector.id}/documents`
                    )
                  }
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
            ) : null}
          </Card>
        </Col>
      </Row>
      <SectorDetailDrawer
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
        sector={sector}
      />
      <AddAnnouncementModal
        selectSectorId={sectorId}
        selectGoverningBodyId={governingBodyId}
        setVisibleModal={setVisibleAddModal}
        visibleModal={visibleAddModal}
        onAdd={onAnnouncementAdd}
      />
      <Modal
        title="Додати діловода"
        visible={visible}
        onOk={handleAdminAdd}
        onCancel={handleAdminAdd}
        footer={null}
      >
        <AddSectorAdminForm
          visibleModal={visible}
          onAdd={handleAdminAdd}
          admins={admins}
          setAdmins={setAdmins}
          setSectorHead={setSectorHead}
          sectorId={+sectorId}
          governingBodyId={+governingBodyId}
        />
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
