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
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import {
  getRegionById,
  removeRegion,
  getRegionAdministration,
  getRegionDocuments,
  getHead,
  getHeadDeputy,
  AddAdmin,
  EditAdmin,
  removeAdmin
} from "../../api/regionsApi";
import {
  cityNameOfApprovedMember,
} from "../../api/citiesApi";
import "./Region.less";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../Spinner/Spinner";
import RegionAdmin  from "../../models/Region/RegionAdmin";
import RegionDocument from "../../models/Region/RegionDocument";
import RegionProfile from "../../models/Region/RegionProfile";
import AddDocumentModal from "./AddDocModal";
import AddNewSecretaryForm from "./AddRegionSecretaryForm";
import userApi from "./../../api/UserApi";
import { getLogo } from "./../../api/citiesApi";
import CitiesRedirectForm from "./CitiesRedirectForm";
import RegionDetailDrawer from "./RegionsDetailDrawer";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import notificationLogic from "../../components/Notifications/Notification";
import { successfulDeleteAction, fileIsAdded, successfulEditAction } from "../../components/Notifications/Messages";
import Crumb from "../../components/Breadcrumb/Breadcrumb";
import PsevdonimCreator from "../../components/HistoryNavi/historyPseudo";
import { Roles } from "../../models/Roles/Roles";

const Region = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const { id } = useParams();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [photoStatus, setPhotoStatus] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  const [document, setDocument] = useState<RegionDocument>(new RegionDocument());

  const [documents, setDocuments] = useState<RegionDocument[]>([]);

  const [region, setRegion] = useState<RegionProfile>(new RegionProfile());

  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [admins, setAdmins] = useState<RegionAdmin[]>([
    
  ]);

  const [members, setMembers] = useState<any[]>([
    {
      id: "",
      name: "",
      logo: "",
    },
  ]);

  const [memberRedirectVisibility, setMemberRedirectVisibility] = useState<boolean>(false);

  const [canCreate, setCanCreate] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [regionLogoLoading, setRegionLogoLoading] = useState<boolean>(false);
  const [membersCount, setMembersCount] = useState<number>();
  const [adminsCount, setAdminsCount] = useState<number>();
  const [documentsCount, setDocumentsCount] = useState<number>();
  const [visible, setVisible] = useState<boolean>(false);
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [isActiveUserRegionAdmin, setIsActiveUserRegionAdmin] = useState<boolean>(false);
  const [isActiveUserFromRegion, setIsActiveUserFromRegion] = useState<boolean>(false);
  
  const [head, setHead] = useState<any>({
    user: {
      firstName: "",
      lastName: "",
    },
    startDate: "",
    endDate: "",
  });

  const [headDeputy, setHeadDeputy] = useState<any>({
    user: {
      firstName: "",
      lastName: "",
    },
    startDate: "",
    endDate: "",
  });

  const setPhotos = async (members: any[], admins: any[]) => {
    for (let i = 0; i < admins.length; i++) {
      admins[i].user.imagePath = (
        await userApi.getImage(admins[i].user.imagePath)
      ).data;
    }

    for (let i = 0; i < members.length; i++) {
      if (members[i].logo !== null) {
        members[i].logo = (await getLogo(members[i].logo)).data;
      } else {
        members[i].logo = CityDefaultLogo;
      }
    }

    setPhotosLoading(false);

    setRegionLogoLoading(false);
  };

  const deleteRegion = async () => {
    await removeRegion(region.id);
    admins.map(async (ad) => {
      await NotificationBoxApi.createNotifications(
        [ad.userId],
        `На жаль регіон: '${region.regionName}', в якому ви займали роль: '${ad.adminType.adminTypeName}' було видалено`,
        NotificationBoxApi.NotificationTypes.UserNotifications
      );
    });
    history.push("/regions");
  };

  function seeDeleteModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити дану округу?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, видалити",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        {
          members[0].name !== ""
            ? setMemberRedirectVisibility(true)
            : deleteRegion();
        }
      },
    });
  }

  const getRegion = async () => {
    setLoading(true);

    try {
      const response = await getRegionById(id);
      const responseAdmins = await getRegionAdministration(id);
      const responce2 = await cityNameOfApprovedMember(userApi.getActiveUserId());

      const responseHead = await getHead(id);
      const responseHeadDeputy = await getHeadDeputy(id);
      
      const admins = [...response.data.administration, response.data.head, response.data.headDeputy]
        .filter(a => a !== null);

      setActiveUserRoles(userApi.getActiveUserRoles());
      setAdmins(responseAdmins.data);
      setHead(responseHead.data);
      setHeadDeputy(responseHeadDeputy.data);
      setMembersCount(response.data.cities.length);
      setSixMembers(response.data.cities, 6);

      setDocuments(response.data.documents);
      setDocumentsCount(response.data.documentsCount);

      setPhotosLoading(true);
      setSixAdmins(responseAdmins.data, 7);
      setAdminsCount(responseAdmins.data.length);

      setRegionLogoLoading(true);
      setPhotos([...response.data.cities], [...responseAdmins.data]);

      setRegion(response.data);
      setCanEdit(response.data.canEdit);
      setIsFromRegion(response.data.cities, responce2.data);
      setIsRegionAdmin(responseAdmins.data, userApi.getActiveUserId());

      if (response.data.logo === null) {
        setPhotoStatus(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateAdmins = async () => {
    const response = await getRegionById(id);
    const responseAdmins = await getRegionAdministration(id);
    const responseHead = await getHead(id);
    const responseHeadDeputy = await getHeadDeputy(id);
    setHead(responseHead.data);
    setHeadDeputy(responseHeadDeputy.data);
    setAdminsCount(responseAdmins.data.administrationCount);
    const admins = [
      ...response.data.administration,
      response.data.head,
      response.data.headDeputy,
    ].filter((a) => a !== null);
    setRegion(response.data);
    setAdmins(responseAdmins.data);
    setPhotosLoading(true);
    setPhotos([...response.data.cities], [...responseAdmins.data]);
  }

  const addRegionAdmin = async (admin: RegionAdmin) => {
    await AddAdmin(admin);
    await updateAdmins();
    notificationLogic("success", "Користувач успішно доданий в провід");
    await NotificationBoxApi.createNotifications(
      [admin.userId],
      `Вам була присвоєна адміністративна роль: '${admin.adminType.adminTypeName}' в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/cities/${id}`,
      `цій станиці`
    );
  };

  const editRegionAdmin = async (admin: RegionAdmin) => {
    await EditAdmin(admin);
    await updateAdmins();
    notificationLogic("success", successfulEditAction("Адміністратора"));
    await NotificationBoxApi.createNotifications(
      [admin.userId],
      `Вам була відредагована адміністративна роль: '${admin.adminType.adminTypeName}' в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/clubs/${id}`,
      `цьому курені`);
  };

  const showConfirmClubAdmin  = async (admin: RegionAdmin) => {
    return Modal.confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {head.user.firstName} {head.user.lastName}
          </b>{" "}
          є Головою Куреня, час правління закінчується{" "}
          <b>
            {moment(head.endDate).format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment(head.endDate).format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() { },
      async onOk() {
        if (admin.id === 0) {
         await addRegionAdmin(admin);
        } else {
         await editRegionAdmin(admin);
        }
      },
    });
  };
  
  const checkAdminId = async (admin: RegionAdmin)=> {
    if (admin.id === 0) {
      await addRegionAdmin(admin);
    } else {
      await editRegionAdmin(admin);
    }
  }

  const handleConfirm = async () => {
    setVisible(false);
  };

  const handleOk = async(admin: RegionAdmin) => {
    try {
      if (admin.adminType.adminTypeName === Roles.OkrugaHead) {
        if (head === '') {
          checkAdminId(admin);
        }else {
          if (head.userId !== admin.userId) {
            showConfirmClubAdmin(admin);
          }else {
            checkAdminId(admin);
          }
        }
      } else if(admin.adminType.adminTypeName === Roles.OkrugaHeadDeputy) {
        if (headDeputy === '') {
          checkAdminId(admin);
        }else{
          checkAdminId(admin);
        }
      }
      else {
          await addRegionAdmin(admin);
      }
    } finally {
      setVisible(false);
    }
  };

  const handleClose = async() => {
    setVisible(false);
  };

  const setIsFromRegion = (members: any[], city: string) => {
    for(let i = 0; i < members.length; i++){
      if(members[i].name == city){
        setIsActiveUserFromRegion(true);
        return;
      }
    }
  }

  const setIsRegionAdmin = (admins: any[], userId: string) => {
    for(let i = 0; i < admins.length; i++){
      if(admins[i].userId == userId){
        setIsActiveUserRegionAdmin(true);
        return;
      }
    }
  }

  const setSixMembers = (member: any[], amount: number) => {
    if (member.length > 6) {
      for (let i = 0; i < amount; i++) {
        members[i] = member[i];
      }
    } else {
      if (member.length !== 0) {
        for (let i = 0; i < member.length; i++) {
          members[i] = member[i];
        }
      }
    }
  };

  const setSixAdmins = (admin: any[], amount: number) => {
    if (admin.length > 7) {
      for (let i = 0; i < amount; i++) {
        admins[i] = admin[i];
      }
    } else {
      if (admin.length !== 0) {
        for (let i = 0; i < admin.length; i++) {
          admins[i] = admin[i];
        }
      }
    }
  };

  const onAdd =  async (newDocument: RegionDocument) => {
    const response = await getRegionById(id);
    setDocumentsCount(response.data.documentsCount);
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
  };

  useEffect(() => {
    getRegion();
  }, []);

  useEffect(() => {
    if (region.regionName.length !== 0) {
      PsevdonimCreator.setPseudonimLocation(`regions/${region.regionName}`, `regions/${id}`);
    }
  }, [region]);

  return loading ? (
    <Spinner />
  ) : (
      <Layout.Content className="cityProfile">
        <Row gutter={[0, 48]}>
          <Col xl={15} sm={24} xs={24}>
            <Card hoverable className="cityCard">
              <div>
                <Crumb
                  current={region.regionName}
                  first="/"
                  second={url.replace(`/${id}`, "")}
                  second_name="Округи"
                />
              </div>
              <Title level={3}>Округа {region.regionName}</Title>
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
                <Col md={13} sm={24} xs={24}>
                  {head.user ? (
                    <div>
                      <Paragraph>
                        <b>Голова Округи:</b> {head.user.firstName}{" "}
                        {head.user.lastName}
                      </Paragraph>
                      {head.endDate ? (
                        <Paragraph>
                          <b>Час правління:</b>{" "}
                          {moment(head.startDate).format("DD.MM.YYYY")}{" - "}
                          {moment(head.endDate).format("DD.MM.YYYY")}
                        </Paragraph>
                      ) : (
                          <Paragraph>
                            <b>Початок правління:</b>{" "}
                            {moment(head.startDate).format("DD.MM.YYYY")}
                          </Paragraph>
                        )}
                    </div>
                  ) : (
                      <p>Ще немає голови округи</p>
                    )}
                    {headDeputy.user ? (
                    <div>
                      <Paragraph>
                        <b>Заступник Голови Округи:</b> {headDeputy.user.firstName}{" "}
                        {headDeputy.user.lastName}
                      </Paragraph>
                      {headDeputy.endDate ? (
                        <Paragraph>
                          <b>Час правління:</b>{" "}
                          {moment(headDeputy.startDate).format("DD.MM.YYYY")}{" - "}
                          {moment(headDeputy.endDate).format("DD.MM.YYYY")}
                        </Paragraph>
                      ) : (
                          <Paragraph>
                            <b>Початок правління:</b>{" "}
                            {moment(headDeputy.startDate).format("DD.MM.YYYY")}
                          </Paragraph>
                        )}
                    </div>
                  ) : (
                      <p>Ще немає заступника голови округи</p>
                    )}
                </Col>

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
                      <Button
                        type="primary"
                        className="cityInfoButton"
                        onClick={() => history.push(`/annualreport/table/country`)}
                      >
                        Річні звіти
                </Button>
                    </Col>
                    <Col xs={24} sm={4} style={{ display: canEdit && ( isActiveUserRegionAdmin
                      || activeUserRoles.includes(Roles.Admin)) ? "block" : "none" }}>
                      <Row
                        className="cityIcons"
                        justify={canCreate ? "center" : "start"}
                      >
                        <Col>
                          <Tooltip title="Редагувати округу">
                            <EditOutlined
                              className="cityInfoIcon"
                              onClick={() =>
                                history.push(`/regions/edit/${region.id}`)
                              }
                            />
                          </Tooltip>
                        </Col>
                        
                        {
                          activeUserRoles.includes(Roles.Admin) ? 
                            <Col offset={1}>
                              <Tooltip title="Видалити округу">
                                <DeleteOutlined
                                  className="cityInfoIconDelete"
                                  onClick={() => seeDeleteModal()}
                                />
                              </Tooltip>
                            </Col>
                          : null
                        }
                      </Row>
                    </Col>
                  </>
                ) : null}


              </Row>
            </Card>
          </Col>

          <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
            <Card hoverable className="cityCard">
              <Title level={4}>Опис округи</Title>
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
              <Title level={4}>Провід округи <a onClick={() => history.push(`/region/administration/${region.id}`)}>
                {adminsCount !== 0 ?
                  <Badge
                    count={adminsCount}
                    style={{ backgroundColor: "#3c5438" }}
                  /> : null
                }
              </a>
              </Title>
              <Row className="cityItems" justify="center" gutter={[0, 16]}>
                {adminsCount !== 0 ? (
                  admins.map((admin) => (
                    <Col className="cityMemberItem" key={admin.id} xs={12} sm={8}>
                      <div
                        onClick={() =>
                          !activeUserRoles.includes(Roles.RegisteredUser)
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
                    <Paragraph>Ще немає діловодів округи</Paragraph>
                  )}
              </Row>
              <div className="cityMoreButton">
                {canEdit && (activeUserRoles.includes(Roles.Admin) || isActiveUserRegionAdmin) 
                ?(
                  <PlusSquareFilled
                    type="primary"
                    className="addReportIcon"
                    onClick={() => setVisible(true)}
                  />
                ) : null}
                <Button
                  type="primary"
                  className="cityInfoButton"
                  onClick={() =>
                    history.push(`/region/administration/${region.id}`)
                  }
                >
                  Більше
              </Button>
              </div>
            </Card>
          </Col>

          <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
            <Card hoverable className="cityCard">
              <Title level={4}>Члени округи <a onClick={() => history.push(`/regions/members/${id}`)}>
                {membersCount !== 0 ?
                  <Badge
                    count={membersCount}
                    style={{ backgroundColor: "#3c5438" }}
                  /> : null
                }
              </a>
              </Title>
              <Row className="cityItems" justify="center" gutter={[0, 16]}>
                {members[0].name !== "" ? (
                  members.map((member) => (
                    <Col
                      className="cityMemberItem"
                      key={member.id}
                      xs={12}
                      sm={8}
                    >
                      <div onClick={() => history.push(`/cities/${member.id}`)}>
                        {photosLoading ? (
                          <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                        ) : (
                            <Avatar size={64} src={member.logo} />
                          )}
                        <p className="userName">{member.name}</p>
                      </div>
                    </Col>
                  ))
                ) : (
                    <Paragraph>Ще немає членів округи</Paragraph>
                  )}
              </Row>
              <div className="cityMoreButton">
                <Button
                  type="primary"
                  className="cityInfoButton"
                  onClick={() => history.push(`/regions/members/${id}`)}
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
              <Title level={4}>Документообіг округи <a onClick={() => 
                 canEdit || activeUserRoles.includes(Roles.KurinHead) || activeUserRoles.includes(Roles.CityHead)
                 || activeUserRoles.includes(Roles.CityHeadDeputy) || activeUserRoles.includes(Roles.KurinHeadDeputy)
                 || (!activeUserRoles.includes(Roles.RegisteredUser) && isActiveUserFromRegion)
                 ? 
                history.push(`/regions/documents/${region.id}`)
                : undefined
              }>
              {documentsCount !== 0 ?
                <Badge
                  count={documentsCount}
                  style={{ backgroundColor: "#3c5438" }}
                /> : null
              }
            </a>
              </Title>
              <Row className="cityItems" justify="center" gutter={[0, 16]}>
                {documents.length !== 0 ? (
                  documents.map((document) => (
                    <Col
                      className="cityDocumentItem"
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
                    <Paragraph>Ще немає документів округи</Paragraph>
                  )}
              </Row>
              <div className="cityMoreButton">
                {
                  canEdit || activeUserRoles.includes(Roles.KurinHead) || activeUserRoles.includes(Roles.CityHead)
                  || activeUserRoles.includes(Roles.CityHeadDeputy) || activeUserRoles.includes(Roles.KurinHeadDeputy)
                  || (!activeUserRoles.includes(Roles.RegisteredUser) && isActiveUserFromRegion)
                  ? <Button
                      type="primary"
                      className="cityInfoButton"
                      onClick={() => history.push(`/regions/documents/${region.id}`)}
                    > 
                      Більше
                    </Button>
                  : null
                }
                {activeUserRoles.includes(Roles.Admin)
                || ((activeUserRoles.includes(Roles.OkrugaHead) || activeUserRoles.includes(Roles.OkrugaHeadDeputy)) 
                    && isActiveUserRegionAdmin)
                ?(
                <PlusSquareFilled
                  className="addReportIcon"
                  onClick={() => setVisibleModal(true)}
                />
                ):null}
              </div>
            </Card>
          </Col>
        </Row>

        <AddDocumentModal
          regionId={+id}
          document={document}
          setDocument={setDocument}
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          onAdd={onAdd}
        ></AddDocumentModal>

        <Modal
          title="Додати діловода"
          visible={visible}
          onCancel={handleClose}
          footer={null}
        >
          <AddNewSecretaryForm 
              onAdd={handleOk}
              regionId={region.id}
              head={head}
              headDeputy={headDeputy}
              visibleModal={visible}
          >
          </AddNewSecretaryForm>
        </Modal>

        <Modal
          title="Оберіть округу до якої належатимуть станиці-члени:"
          visible={memberRedirectVisibility}
          onOk={handleConfirm}
          onCancel={handleConfirm}
          footer={null}
        >
          <CitiesRedirectForm regionId = {region.id} onAdd={handleConfirm} />
        </Modal>

        <RegionDetailDrawer
          region={region}
          setVisibleDrawer={setVisibleDrawer}
          visibleDrawer={visibleDrawer}
        ></RegionDetailDrawer>
      </Layout.Content>
    );
};

export default Region;
