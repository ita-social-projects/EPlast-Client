import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  Row,
  Col,
  Button,
  Layout,
  Skeleton,
  Card,
  Tooltip,
  Badge,
} from "antd";
import {
  FileTextOutlined,
  EditOutlined,
  PlusSquareFilled,
  FileDoneOutlined,
  LockOutlined,
} from "@ant-design/icons";
import jwt from "jwt-decode";
import { GetRegionsBoard } from "../../api/regionsApi";
import { getUserAccess } from "../../api/regionsBoardApi";
import "../Regions/Region.less";
import "./RegionBoard.less";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../Spinner/Spinner";
import AddDocumentModal from "./AddDocModal";
import CityDocument from "../../models/City/CityDocument";
import RegionDetailDrawer from "./RegionsBoardDetailDrawer";
import Crumb from "../../components/Breadcrumb/Breadcrumb";
import decisionsApi, {
  Decision,
  statusTypeGetParser,
  GoverningBody,
} from "../../api/decisionsApi";
import {
  addMainAdmin,
  getGoverningBodiesList,
  getGoverningBodyAdminsByPage,
  getGoverningBodyLogo,
} from "../../api/governingBodiesApi";
import AddDecisionModal from "../DecisionTable/AddDecisionModal";
import notificationLogic from "../../components/Notifications/Notification";
import AuthLocalStorage from "../../AuthLocalStorage";
import userApi from "../../api/UserApi";
import GoverningBodyAdmin from "../../models/GoverningBody/GoverningBodyAdmin";
import AddRegionBoardMainAdminModal from "./AddMainAdministratorModal/AddRegionBoardMainAdminModal";
import GoverningBodyUser from "../../models/GoverningBody/GoverningBodyUser";
import AdminType from "../../models/Admin/AdminType";
import {
  dataCantBeFetched,
  failEditAction,
} from "../../components/Notifications/Messages";
import NotificationBoxApi from "../../api/NotificationBoxApi";

const RegionBoard = () => {
  const history = useHistory();
  const [visibleModal, setVisibleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState(true);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [document, setDocument] = useState<any>({
    ID: "",
    SubmitDate: "",
    BlobName: "",
    FileName: "",
    RegionId: "",
  });

  const [documents, setDocuments] = useState<any[]>([
    {
      id: "",
      submitDate: "",
      blobName: "",
      fileName: "",
      regionId: "",
    },
  ]);
  const [documentsCount, setDocumentsCount] = useState<number>(0);

  const [region, setRegion] = useState<any>({
    id: "",
    regionName: "",
    description: "",
    logo: "",
    administration: [{}],
    cities: [{}],
    phoneNumber: "",
    email: "",
    link: "",
    documents: [{}],
    postIndex: "",
    city: "",
  });

  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([
    {
      id: 0,
      governingBodyName: "",
      logo: "",
      description: "",
      phoneNumber: "",
      email: "",
    },
  ]);

  const [admins, setAdmins] = useState<GoverningBodyAdmin[]>([]);

  const [orgsCount, setOrgsCount] = useState<number>();
  const [adminsCount, setAdminsCount] = useState<number>(0);
  const [decisionsCount, setDecisionsCount] = useState<number>();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [visibleDecisionModal, setVisibleDecisionModal] = useState<boolean>(
    false
  );
  const [gbPhotosAreLoading, setGbPhotosAreLoading] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );

  const [visibleAddMainAdminModal, setVisibleAddMainAdminModal] = useState(
    false
  );

  const getRegion = async () => {
    setLoading(true);
    try {
      const response = await GetRegionsBoard();
      const userAccesses = (await getUserAccesses()).data;
      if (userAccesses["ViewDecisions"]) {
        await setRegionDecisions();
      }
      await setRegionOrgs();
      await setRegionDocs(response.data.documents);
      setRegion(response.data);
      if (response.data.logo == null) {
        setPhotoStatus(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const getUserAccesses = async () => {
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    let result: any;
    await getUserAccess(user.nameid).then((response) => {
      result = response;
      setUserAccesses(response.data);
    });
    return result;
  };

  const loadGbPhotos = async (governingBodies: GoverningBody[]) => {
    for (let i = 0; i < governingBodies.length; i++) {
      if (governingBodies[i].logo == undefined) continue;
      governingBodies[i].logo = (
        await getGoverningBodyLogo(governingBodies[i].logo!)
      ).data;
    }

    setGbPhotosAreLoading(false);
  };

  const loadGbAdminsPhotos = async (members: GoverningBodyAdmin[]) => {
    for (let i = 0; i < members.length; i++) {
      members[i].user.imagePath = (
        await userApi.getImage(members[i].user.imagePath)
      ).data;
    }
    setPhotosLoading(false);
  };

  const onAdd = (newDocument: CityDocument) => {
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
    setDocumentsCount(documentsCount + 1);
  };

  const setRegionDocs = async (documents: any) => {
    setDocumentsCount(documents.length);
    setDocuments(
      documents.length > 6 ? documents.slice(documents.length - 6) : documents
    );
  };

  const setRegionOrgs = async () => {
    const responseOrgs: GoverningBody[] = await getGoverningBodiesList();
    setOrgsCount(responseOrgs.length);
    responseOrgs.length > 6
      ? setGoverningBodies(responseOrgs.slice(responseOrgs.length - 6))
      : setGoverningBodies(responseOrgs);
    setGbPhotosAreLoading(true);
    loadGbPhotos(responseOrgs);
  };

  const setRegionDecisions = async () => {
    const decisions: Decision[] = await decisionsApi.getAll();
    setDecisionsCount(decisions.length);
    decisions.length > 6
      ? setDecisions(decisions.slice(decisions.length - 6))
      : setDecisions(decisions);
  };

  const handleAdd = async () => {
    const lastId = decisions[decisions.length - 1].id;
    let user: any;
    let curToken = AuthLocalStorage.getToken() as string;
    user = jwt(curToken);
    await decisionsApi
      .getById(lastId + 1)
      .then((res) => {
        const dec: Decision = {
          id: res.id,
          name: res.name,
          governingBody: res.governingBody.governingBodyName,
          decisionStatusType: statusTypeGetParser(res.decisionStatusType),
          decisionTarget: res.decisionTarget.targetName,
          description: res.description,
          fileName: res.fileName,
          userId: user.nameid,
          date: res.date,
        };
        setDecisions([...decisions.slice(1), dec]);
      })
      .catch(() => {
        notificationLogic("error", "Рішення не існує");
      });
  };

  const createNotification = async (userId: Array<string>, message: string) => {
    await NotificationBoxApi.createNotifications(
      userId,
      `${message}: `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/regionsBoard/administrations`,
      `Переглянути`
    );
  };

  const handleAddGoverningBodyAdmin = async (values: any) => {
    const newAdmin: GoverningBodyAdmin = {
      id: 0,
      userId: JSON.parse(values.user.toString()).id,
      startDate: values.startDate,
      endDate: values.endDate,
      governingBodyAdminRole: values.governingBodyAdminRole,
      user: new GoverningBodyUser(),
      adminType: new AdminType(),
      governingBodyId: 0,
    };

    await addMainAdmin(newAdmin)
      .then(async () => {
        notificationLogic("success", "Роль крайового користувача додано");
      })
      .catch(() => {
        notificationLogic("error", failEditAction("роль користувача."));
      });

    await createNotification(
      [newAdmin.userId],
      `Вам була присвоєна нова роль: '${newAdmin.governingBodyAdminRole}`
    ).catch(() => {
      notificationLogic(
        "error",
        "Помилка при відправленні повідомлення користувачу"
      );
    });

    getGoverningBodiesAdmins();
    setVisibleAddMainAdminModal(false);
  };

  const openPDF = async (item: any) => {
    const pdf = await decisionsApi.getPdf(item.id);
    window.open(pdf);
  };

  const getGoverningBodiesAdmins = async () => {
    try {
      setPhotosLoading(true);
      const response = await getGoverningBodyAdminsByPage(1, 6);
      setAdminsCount(response.data.item2);
      const responseAdmins = response.data.item1;
      await loadGbAdminsPhotos(responseAdmins);
      setAdmins(responseAdmins);
      console.log(response);
    } finally {
      setPhotosLoading(false);
    }
  };

  useEffect(() => {
    getRegion();
    getGoverningBodiesAdmins();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <Layout.Content className="regionBoardProfile">
      <Row style={{ justifyContent: "center" }} gutter={[0, 48]}>
        <Col xl={14} sm={24} xs={24}>
          <Card hoverable className="regionBoardCard">
            <div>
              <Crumb first="/" second_name="Крайовий Провід Пласту" />
            </div>
            <Title level={2}>{region.regionName}</Title>
            <Row className="regionBoardPhotos" gutter={[0, 12]}>
              <Col md={13} sm={24} xs={24}>
                {photoStatus ? (
                  <img
                    src={region.logo}
                    alt="Region"
                    className="regionBoardLogo"
                  />
                ) : (
                  <img
                    src={CityDefaultLogo}
                    alt="Region"
                    className="regionBoardLogo"
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
            <Row className="regionBoardInfo">
              <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                {region.link || region.email || region.phoneNumber ? (
                  <div>
                    {region.link ? (
                      <Paragraph ellipsis>
                        <b>Посилання:</b>{" "}
                        <u>
                          <a
                            href={region.link}
                            target="_blank"
                            className="link"
                          >
                            {region.link}
                          </a>
                        </u>
                      </Paragraph>
                    ) : null}
                    {region.phoneNumber ? (
                      <Paragraph>
                        <b>Телефон:</b> {region.phoneNumber}
                      </Paragraph>
                    ) : null}
                    {region.email ? (
                      <Paragraph>
                        <b>Пошта:</b> {region.email}
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
              className="regionBoardButtons"
              justify="center"
              gutter={[12, 0]}
            >
              <Col>
                <Button
                  type="primary"
                  className="regionBoardInfoButton"
                  onClick={() => setVisibleDrawer(true)}
                >
                  Деталі
                </Button>
              </Col>
              {userAccesses["EditRB"] ? (
                <>
                  <Col
                    style={{
                      display: userAccesses["EditRB"] ? "block" : "none",
                    }}
                  />
                  <Col
                    xs={24}
                    sm={4}
                    style={{
                      display: userAccesses["EditRB"] ? "block" : "none",
                    }}
                  >
                    <Row
                      className="regionBoardIcons"
                      justify={userAccesses["EditRB"] ? "center" : "start"}
                    >
                      <Col>
                        <Tooltip title="Редагувати Крайовий Провід Пласту">
                          <EditOutlined
                            className="regionBoardInfoIcon"
                            onClick={() => history.push(`/regionsBoard/edit`)}
                          />
                        </Tooltip>
                      </Col>
                    </Row>
                  </Col>
                </>
              ) : null}
            </Row>
          </Card>
        </Col>
        <Col xl={{ span: 8, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="regionBoardCard">
            <Title level={4}>
              Адміністрація Крайового Проводу{" "}
              <a onClick={() => history.push(`/regionsBoard/administrations`)}>
                {adminsCount !== 0 ? (
                  <Badge
                    count={adminsCount}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row
              className={
                adminsCount >= 4 ? "regionBoardItems1" : "regionBoardItems"
              }
              justify="center"
              gutter={[0, 16]}
            >
              {adminsCount !== 0 ? (
                admins.map((admin: GoverningBodyAdmin) => (
                  <Col
                    className="regionBoardMemberItem"
                    key={admin.id}
                    xs={12}
                    sm={8}
                  >
                    <div
                      onClick={() =>
                        userAccesses["EditRB"]
                          ? history.push(`/userpage/main/${admin.userId}`)
                          : undefined
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
                <Paragraph>Ще немає членів станиці</Paragraph>
              )}
            </Row>
            <div className="regionBoardMoreButton">
              {userAccesses["AddGoverningBodyAdmin"] && (
                <PlusSquareFilled
                  type="primary"
                  className="addReportIcon"
                  onClick={() => setVisibleAddMainAdminModal(true)}
                />
              )}
              <Button
                type="primary"
                className="regionBoardInfoButton"
                onClick={() => history.push(`/regionsBoard/administrations`)}
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
          <Card hoverable className="regionBoardCard">
            <Title level={4}>
              Керівні органи{" "}
              <a onClick={() => history.push(`/regionsBoard/governingBodies`)}>
                {governingBodies.length !== 0 ? (
                  <Badge
                    count={orgsCount}
                    style={{ backgroundColor: "#3c5438" }}
                  />
                ) : null}
              </a>
            </Title>
            <Row className="regionBoardItems" justify="center" gutter={[0, 16]}>
              {governingBodies.length !== 0 ? (
                governingBodies.map((governingBody) => (
                  <Col
                    className="regionBoardMemberItem"
                    key={governingBody.id}
                    xs={12}
                    sm={8}
                  >
                    <div
                      onClick={() =>
                        history.push(`/governingBodies/${governingBody.id}`)
                      }
                    >
                      {gbPhotosAreLoading ? (
                        <Skeleton.Avatar active size={64} />
                      ) : (
                        <Avatar
                          size={64}
                          src={
                            governingBody.logo == null
                              ? CityDefaultLogo
                              : governingBody.logo
                          }
                        />
                      )}
                      <p className="userName">
                        {governingBody.governingBodyName}
                      </p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає керівних органів</Paragraph>
              )}
            </Row>
            <div className="regionBoardMoreButton">
              {userAccesses["CreateGB"] ? (
                <PlusSquareFilled
                  type="primary"
                  className="addReportIcon"
                  onClick={() => history.push(`/regionsBoard/new`)}
                />
              ) : null}
              <Button
                type="primary"
                className="regionBoardInfoButton"
                onClick={() => history.push(`/regionsBoard/governingBodies`)}
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="regionBoardCard">
            <Title level={4}>Архів Крайового Проводу </Title>
            <>
              <Paragraph strong>У розробці</Paragraph>
              <LockOutlined style={{ fontSize: "150px" }} />
            </>
          </Card>
        </Col>

        <Col
          xl={{ span: 7, offset: 1 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="regionBoardCard">
            <Title level={4}>
              Документообіг{" "}
              <a
                onClick={() =>
                  userAccesses["ViewDocument"]
                    ? history.push("/regionsBoard/documents/" + region.id)
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
            <Row className="regionBoardItems" justify="center" gutter={[0, 16]}>
              {documents.length !== 0 ? (
                documents.map((document) => (
                  <Col
                    className="regionBoardDocumentItem"
                    xs={12}
                    sm={8}
                    key={document.id}
                  >
                    <div>
                      <FileTextOutlined className="documentIcon" />
                      <p className="documentText">{document.fileName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає документів</Paragraph>
              )}
            </Row>
            {userAccesses["ViewDocument"] ? (
              <div className="regionBoardMoreButton">
                <Button
                  type="primary"
                  className="regionBoardInfoButton"
                  onClick={() =>
                    history.push(`/regionsBoard/documents/${region.id}`)
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

      <AddDocumentModal
        regionId={region.id}
        document={document}
        setDocument={setDocument}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        onAdd={onAdd}
      />
      <AddDecisionModal
        setVisibleModal={setVisibleDecisionModal}
        visibleModal={visibleDecisionModal}
        onAdd={handleAdd}
      />
      <RegionDetailDrawer
        region={region}
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
      />
      <AddRegionBoardMainAdminModal
        visibleModal={visibleAddMainAdminModal}
        setVisibleModal={setVisibleAddMainAdminModal}
        handleAddGoverningBodyAdmin={handleAddGoverningBodyAdmin}
      />
    </Layout.Content>
  );
};

export default RegionBoard;
