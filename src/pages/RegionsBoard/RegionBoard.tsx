import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
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
  FileDoneOutlined
} from "@ant-design/icons";
import moment from "moment";
import {
  getRegionLogo,
  getRegionDocuments,
  getHead,
  GetRegionsBoard,
} from "../../api/regionsApi";
import "../Regions/Region.less";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../Spinner/Spinner";
import AddDocumentModal from "./AddDocModal";
import CityDocument from "../../models/City/CityDocument";
import RegionDetailDrawer from "./RegionsBoardDetailDrawer";
import Crumb from "../../components/Breadcrumb/Breadcrumb";
import decisionsApi, { Decision, statusTypeGetParser, Organization } from "../../api/decisionsApi";
import governingBodiesApi from "../../api/governingBodiesApi";
import AddDecisionModal from "../DecisionTable/AddDecisionModal";
import notificationLogic from '../../components/Notifications/Notification';

const RegionBoard = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const { id } = useParams();
  const [visibleModal, setVisibleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoStatus, setPhotoStatus] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
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

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgsCount, setOrgsCount] = useState<number>();
  const [decisionsCount, setDecisionsCount] = useState<number>();
  const [canCreate, setCanCreate] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [regionLogoLoading, setRegionLogoLoading] = useState<boolean>(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [visible, setvisible] = useState<boolean>(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [visibleDecisionModal, setVisibleDecisionModal] = useState<boolean>(false);


  const getRegion = async () => {
    setLoading(true);
    try {
      const response = await GetRegionsBoard();
      setRegionDecisions();
      setRegionOrgs();
      setRegionDocs(response.data.id);
      setPhotosLoading(false);
      setRegionLogoLoading(true);
      setRegion(response.data);
      setCanEdit(response.data.canEdit);
      if (response.data.logo == null) {
        setPhotoStatus(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const onAdd = (newDocument: CityDocument) => {
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
  };

  const setRegionDocs = async (id: number) => {
    try {
      const response: [] = await (await getRegionDocuments(id)).data;
      setDocuments(response.length > 6 ? response.slice(response.length - 6) : response);
    } finally {
    }
  };

  const setRegionOrgs = async () => {
    const responseOrgs: Organization[] = await governingBodiesApi.getOrganizationsList();
    setOrgsCount(responseOrgs.length);
    responseOrgs.length > 6 ? setOrganizations(responseOrgs.slice(responseOrgs.length - 6)) : setOrganizations(responseOrgs);
  }

  const setRegionDecisions = async () => {
    const responseDecisions: Decision[] = await decisionsApi.getAll();
    setDecisionsCount(responseDecisions.length);
    responseDecisions.length > 6 ? setDecisions(responseDecisions.slice(responseDecisions.length - 6)) : setDecisions(responseDecisions);
  }

  const handleAdd = async () => {
    const lastId = decisions[decisions.length - 1].id;
    await decisionsApi.getById(lastId + 1).then(res => {
      const dec: Decision = {
        id: res.id,
        name: res.name,
        organization: res.organization.organizationName,
        decisionStatusType: statusTypeGetParser(res.decisionStatusType),
        decisionTarget: res.decisionTarget.targetName,
        description: res.description,
        fileName: res.fileName,
        date: res.date
      };
      setDecisions([...decisions.slice(1), dec]);
    })
      .catch(() => {
        notificationLogic('error', "Рішення не існує");
      });
  }

  const openPDF = async (item: any) => {
    const pdf = await decisionsApi.getPdf(item.id);
    window.open(pdf);
  }

  useEffect(() => {
    getRegion();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <Layout.Content className="cityProfile">
      <Row gutter={[0, 48]}>
        <Col xl={15} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <div>
              <Crumb
                first="/"
                second_name="Крайовий Провід Пласту"
              />
            </div>
            <Title level={2}>{region.regionName}</Title>
            <Row className="cityPhotos" gutter={[0, 12]}>
              <Col md={13} sm={24} xs={24}>
                {photoStatus ? (
                  <img src={region.logo} alt="Region" className="cityLogo" />
                ) : (
                  <img
                    src={CityDefaultLogo}
                    alt="Region"
                    className="cityLogo"
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
            <Row className="cityInfo">
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
              {canCreate || canEdit ? (
                <>
                  <Col style={{ display: canCreate || canEdit ? "block" : "none" }}>
                  </Col>
                  <Col xs={24} sm={4} style={{ display: canCreate || canEdit ? "block" : "none" }}>
                    <Row
                      className="cityIcons"
                      justify={canCreate ? "center" : "start"}
                    >
                      <Col>
                        <Tooltip title="Крайовий Провід Пласту">
                          <EditOutlined
                            className="cityInfoIcon"
                            onClick={() =>
                              history.push(`/regionsBoard/edit`)
                            }
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
        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4}>Опис</Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              <div className="regionDesc">{region.description}</div>
            </Row>
          </Card>
        </Col>
        <Col
          xl={{ span: 7, offset: 0 }}
          md={{ span: 11, offset: 2 }}
          sm={24}
          xs={24}
        >
          <Card hoverable className="cityCard">
            <Title level={4}>Керівні Органи <a onClick={() => history.push(`/regionsBoard/governingBodies`)}>
              {organizations.length !== 0 ?
                <Badge
                  count={orgsCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {organizations.length !== 0 ? (
                organizations.map((organization) => (
                  <Col className="cityMemberItem" key={organization.id} xs={12} sm={8}>
                    <div>
                      {photosLoading ? (
                        <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                      ) : (
                        <Avatar size={64} src="" />
                      )}
                      <p className="userName">{organization.organizationName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає керівних органів</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              {canCreate || canEdit ? (<PlusSquareFilled
                type="primary"
                className="addReportIcon"
                onClick={() => setvisible(true)}
              ></PlusSquareFilled>) : null}
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() =>
                  history.push(`/regionsBoard/governingBodies`)
                }
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>

        <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
          <Card hoverable className="cityCard">
            <Title level={4}>Рішення <a onClick={() => history.push(`/decisions`)}>
              {decisions.length !== 0 ?
                <Badge
                  count={decisionsCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a>
            </Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {decisions.length !== 0 ? (
                decisions.map((decision) => (
                  <Col
                    className="cityMemberItem"
                    xs={12}
                    sm={8}
                    key={decision.id}
                    onClick={() => openPDF(decision)}
                  >
                    <div>
                      <FileDoneOutlined className="documentIcon" />
                      <p className="documentText">{decision.name}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає рішень</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              {canCreate || canEdit ? (<PlusSquareFilled
                type="primary"
                className="addReportIcon"
                onClick={() => setVisibleDecisionModal(true)}
              ></PlusSquareFilled>) : null}
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/decisions`)}
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
          <Card hoverable className="cityCard">
            <Title level={4}>Документообіг</Title>
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
                      <p className="documentText">{document.fileName}</p>
                    </div>
                  </Col>
                ))
              ) : (
                <Paragraph>Ще немає документів</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/regionsBoard/documents/${region.id}`)}
              >
                Більше
              </Button>
              {canCreate || canEdit ? (
                <PlusSquareFilled
                  className="addReportIcon"
                  onClick={() => setVisibleModal(true)}
                />) : null}
            </div>
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
      ></AddDocumentModal>
      <AddDecisionModal
        setVisibleModal={setVisibleDecisionModal}
        visibleModal={visibleDecisionModal}
        onAdd={handleAdd}
      />
      <RegionDetailDrawer
        region={region}
        setVisibleDrawer={setVisibleDrawer}
        visibleDrawer={visibleDrawer}
      ></RegionDetailDrawer>
    </Layout.Content>
  );
};

export default RegionBoard;
