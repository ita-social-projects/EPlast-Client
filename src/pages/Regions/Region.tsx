import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Row, Col, Button, Spin, Layout, Modal, Skeleton, Divider, Card, Tooltip, Input } from "antd";
import { FileTextOutlined, EditOutlined, PlusSquareFilled, UserAddOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { addFollower, getRegionById, getRegionLogo, removeRegion, getRegionAdministration, getRegionDocuments } from "../../api/regionsApi";
import "./Region.less";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg"
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../Spinner/Spinner";
import AddDocumentModal from "./AddDocModal";
import CityDocument from "../../models/City/CityDocument";
import AddNewSecretaryForm from "./AddRegionSecretaryForm";
import userApi from "./../../api/UserApi";
import {getLogo} from "./../../api/citiesApi"
import { Console } from "console";



const Region = () => {
  const history = useHistory();
  const { id } = useParams();
  const [visibleModal, setVisibleModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [document, setDocument] = useState<any>({
    ID: '',
    SubmitDate: '',
    BlobName: '',
    FileName: '',
    RegionId: ''
  });

  const [documents, setDocuments] = useState<any[]>([{
    id: '',
    submitDate: '',
    blobName: '',
    fileName: '',
    regionId: ''
  }]);

  const [region, setRegion] = useState<any>({
    id: '',
    regionName: '',
    description: '',
    logo: '',
    administration: [{}],
    cities: [{}],
    phoneNumber: '',
    email: '',
    link: '',
    documents: [{}]
  });

  const [RegionLogo64, setRegionLogo64] = useState<string>("");

  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [admins, setAdmins] = useState<any[]>([{
    id: '',
    userId: '',
    user: {
      id: '',
      firstName: '',
      lastName: '',
      imagePath: '',
      email: '',
      phoneNumber: ''
    },
    adminType: {
      adminTypeName: ''
    },
    startDate: '',
    endDate: ''
  }]);
  const [members, setMembers] = useState<any[]>([{
    id: '',
    name: '',
    logo: ''
  }]);

  const [canCreate, setCanCreate] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [regionLogoLoading, setRegionLogoLoading] = useState<boolean>(false);

  const [visible, setvisible] = useState<boolean>(false);



  const setPhotos = async (members: any[], admins: any[], logo: string) => {

    for (let i = 0; i < admins.length; i++) {
      admins[i].user.imagePath = (
        await userApi.getImage(admins[i].user.imagePath)
      ).data;
    }

    for (let i = 0; i < members.length; i++) {

      if(members[i].logo!==null){
      members[i].logo = (
        await getLogo(members[i].logo)
      ).data;
      }
      else{
        members[i].logo=CityDefaultLogo;
      }
     
    }

    setPhotosLoading(false);

    if (logo === null) {
      setRegionLogo64(CityDefaultLogo);
    } else {
      const response = await getRegionLogo(logo);
      setRegionLogo64(response.data);
    }
    setRegionLogoLoading(false);
  };


  const deleteRegion = async () => {
    await removeRegion(region.id);
    history.push('/regions');
  }


  function seeDeleteModal() {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити даний округ?",
      icon: <ExclamationCircleOutlined />,
      okText: 'Так, видалити',
      okType: 'danger',
      cancelText: 'Скасувати',
      maskClosable: true,
      onOk() { deleteRegion() }
    });
  }


  const getRegion = async () => {
    setLoading(true);

    try {
      const response = await getRegionById(id);
      const response1 = await getRegionAdministration(id);
      setMembers(response.data.cities);
      setPhotosLoading(true);
      setAdmins(response1.data);
      setRegionLogoLoading(true);
      setPhotos([...response.data.cities], [...response1.data],
        response.data.logo);

      setRegion(response.data);

    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {

    setvisible(false);

  };


  const onAdd = (newDocument: CityDocument) => {
    if (documents.length < 6) {
      setDocuments([...documents, newDocument]);
    }
  }




  const setRegionDocs = async () => {
    try {
      const response = await getRegionDocuments(id);
      setDocuments(response.data);
    }
    finally {

    }
  }



  useEffect(() => {
    setRegionDocs();
    getRegion();

  }, []);

  return loading ? (
    <Spinner />
  ) : (
      <Layout.Content className="cityProfile">
        <Row gutter={[0, 48]}>
          <Col xl={15} sm={24} xs={24}>
            <Card hoverable className="cityCard">
              <Title level={3}>Округ {region.regionName}</Title>
              <Row className="cityPhotos" gutter={[0, 12]}>
                <Col md={13} sm={24} xs={24}>
                  {regionLogoLoading ? (
                    <Skeleton.Avatar active shape={"square"} size={172} />
                  ) : (
                      <img src={RegionLogo64} alt="City" className="cityLogo" />
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
                  {region.head ? (
                    <div>
                      <Paragraph>
                        <b>Голова округу:</b> {region.head.user.firstName}{" "}
                        {region.head.user.lastName}
                      </Paragraph>
                      <Paragraph>
                        <b>Час правління:</b> {moment(region.head.startDate).format("DD.MM.YYYY")}
                        {region.head.endDate
                          ? ` - ${moment(region.head.endDate).format(
                            "DD.MM.YYYY"
                          )}`
                          : " "}
                      </Paragraph>
                    </div>
                  ) : (
                      <Paragraph>
                        <b>Немає голови округу</b>
                      </Paragraph>
                    )}
                </Col>

                <Col md={{ span: 10, offset: 1 }} sm={24} xs={24}>
                  {region.link || region.email || region.phoneNumber ? (
                    <div>
                      {region.link ? (
                        <Paragraph
                          ellipsis>
                          <b>Посилання:</b>{" "}
                          <u><a href={region.link} target="_blank">
                            {region.link}
                          </a></u>
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

                <Col>
                  <Button
                    type="primary"
                    className="cityInfoButton"
                    onClick={() => history.push(`/annualreport/table`)}
                  >
                    Річні звіти
                  </Button>
                </Col>


                <Col xs={24} sm={4}>
                  <Row
                    className="cityIcons"
                    justify={canCreate ? "center" : "start"}
                  >

                    <Col>
                      <Tooltip
                        title="Редагувати округ">
                        <EditOutlined
                          className="cityInfoIcon"
                          onClick={() =>
                            history.push(`/regions/edit/${region.id}`)
                          }
                        />
                      </Tooltip>
                    </Col>


                    <Col offset={1}>
                      <Tooltip
                        title="Видалити округ">
                        <DeleteOutlined
                          className="cityInfoIconDelete"
                          onClick={() => seeDeleteModal()}
                        />
                      </Tooltip>
                    </Col>

                  </Row>
                </Col>

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
              <Title level={4}>Провід округу</Title>
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
                    <Paragraph>Ще немає діловодів округу</Paragraph>
                  )}
              </Row>
              <div className="cityMoreButton">
                <Button
                  type="primary"
                  className="cityInfoButton"
                  onClick={() =>
                    setvisible(true)
                  }
                >
                  Додати діловода
              </Button>
                <Button
                  type="primary"
                  className="cityInfoButton"
                  onClick={() =>
                    history.push(`/region/administration/${region.id}`)
                  }
                >Більше</Button>
              </div>
            </Card>
          </Col>


          <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
            <Card hoverable className="cityCard">
              <Title level={4}>Документообіг округу</Title>
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
                          {document.fileName}
                        </p>
                      </div>
                    </Col>
                  ))
                ) : (
                    <Paragraph>Ще немає документів Округу</Paragraph>
                  )}
              </Row>
              <div className="cityMoreButton">
                <Button
                  type="primary"
                  className="cityInfoButton"
                  onClick={() => history.push(`/regions/documents/${region.id}`)}
                >
                  Більше
              </Button>

                <PlusSquareFilled
                  className="addReportIcon"
                  onClick={() => setVisibleModal(true)}
                />
              </div>
            </Card>
          </Col>


          <Col xl={{ span: 7, offset: 1 }} md={11} sm={24} xs={24}>
            <Card hoverable className="cityCard">
              <Title level={4}>Члени округу</Title>
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
                          history.push(`/cities/${member.id}`)
                        }
                      >
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
                    <Paragraph>Ще немає членів округу</Paragraph>
                  )}

              </Row>

            </Card>
          </Col>І
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
          onOk={handleOk}
          onCancel={handleOk}
          footer={null}
        >
          <AddNewSecretaryForm onAdd={handleOk}></AddNewSecretaryForm>
        </Modal>


      </Layout.Content>
    )
};

export default Region;
