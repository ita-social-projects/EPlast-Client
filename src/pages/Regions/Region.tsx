import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Row, Col, Button, Spin, Layout, Modal, Skeleton, Divider, Card, Tooltip } from "antd";
import { FileTextOutlined, EditOutlined, PlusSquareFilled, UserAddOutlined, PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { addFollower, getRegionById, getLogo, removeRegion } from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import "./Region.less";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg"

import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";
import Spinner from "../Spinner/Spinner";
//import CityDetailDrawer from "../CityDetailDrawer/CityDetailDrawer";


const Region = () => {
  const history = useHistory();
  const {id} = useParams();

  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<any>({
    id:'',
    regionName:'',
    description:'',
    logo:'',
    administration:[{}],
    cities:[{}]
  });

  const [RegionLogo64, setRegionLogo64] = useState<string>("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [admins, setAdmins] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [canCreate, setCanCreate] = useState(false);
  const [followers, setFollowers] = useState<any[]>([]);
  const [canEdit, setCanEdit] = useState(false);
  const [canJoin, setCanJoin] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [regionLogoLoading, setRegionLogoLoading] = useState<boolean>(false);



  const setPhotos = async (members: any[], logo: string) => {
    
    setPhotosLoading(false);

    if (logo === null) {
      setRegionLogo64(CityDefaultLogo);
    } else {
      const response = await getLogo(logo);
      setRegionLogo64(response.data);
    }
    setRegionLogoLoading(false);
  };

  const deleteRegion = async () => {
    await removeRegion(region.id);
    history.push('/cities');
  }


  function seeDeleteModal () {
    return Modal.confirm({
      title: "Ви впевнені, що хочете видалити даний округ?",
      icon: <ExclamationCircleOutlined/>,
      okText: 'Так, видалити',
      okType: 'danger',
      cancelText: 'Скасувати',
      maskClosable: true,
      onOk() {deleteRegion()}
    });
  }


  const getRegion = async () => {
    setLoading(true);

    try {
      const response = await getRegionById(id);

      setPhotosLoading(true);
      setRegionLogoLoading(true);
      const admins = [...response.data.administration, response.data.head]
      .filter(a => a !== null);

      setPhotos([
        ...admins,
        ...response.data.cities,
        
      ], response.data.logo);
      
      setRegion(response.data);
      setAdmins(response.data.administration);
      setMembers(response.data.cities);
    } finally {
      setLoading(false);
    }
  };

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
              {canEdit ? (
                <Col>
                  <Button
                    type="primary"
                    className="cityInfoButton"
                    onClick={() => history.push(`/annualreport/table`)}
                  >
                    Річні звіти
                  </Button>
                </Col>
              ) : null}
              {canEdit ? (
                <Col xs={24} sm={4}>
                  <Row
                    className="cityIcons"
                    justify={canCreate ? "center" : "start"}
                  >
                    {canEdit ? (
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
                    ) : null}
                    {canCreate ? (
                      <Col offset={1}>
                        <Tooltip
                          title="Видалити станицю">
                            <DeleteOutlined
                              className="cityInfoIconDelete"
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
                  history.push(`/regions/administration/${region.id}`)
                }
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
            <Title level={4}>Прихильники станиці</Title>
            <Row className="cityItems" justify="center" gutter={[0, 16]}>
              {canJoin ? (
                <Col
                  className="cityMemberItem"
                  xs={12}
                  sm={8}
                 
                >
                  <div>
                    <Avatar
                      className="addFollower"
                      size={64}
                      icon={<UserAddOutlined />}
                    />
                    <p>Доєднати станицю</p>
                  </div>
                </Col>
              ) : null}
              
              {followers.length !== 0 ? (
                followers.slice(0, canJoin ? 5 : 6).map((followers) => (
                  <Col
                    className="cityMemberItem"
                    xs={12}
                    sm={8}
                    key={followers.id}
                  >
                    <div>
                      <div
                        onClick={() =>
                          history.push(`/userpage/main/${followers.userId}`)
                        }
                      >
                        {photosLoading ? (
                          <Skeleton.Avatar active size={64}></Skeleton.Avatar>
                        ) : (
                          <Avatar size={64} src={followers.user.imagePath} />
                        )}
                        <p className="userName">{followers.user.firstName}</p>
                        <p className="userName">{followers.user.lastName}</p>
                      </div>
                      {canEdit ? (
                        <PlusOutlined
                          className="approveIcon"
                         
                        />
                      ) : null}
                    </div>
                  </Col>
                ))
              ) : canJoin ? null : (
                <Paragraph>Ще немає прихильників округу</Paragraph>
              )}
            </Row>
            <div className="cityMoreButton">
              <Button
                type="primary"
                className="cityInfoButton"
                onClick={() => history.push(`/regions/followers/${region.id}`)}
              >
                Більше
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      
    </Layout.Content>
  ) 
};

export default Region;
