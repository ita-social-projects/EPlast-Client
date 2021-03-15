import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Skeleton, Spin } from "antd";
import {
  SettingOutlined,
  CloseOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { getRegionAdministration, removeAdmin } from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import "../Regions/Region.less";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import CityAdmin from "../../models/City/CityAdmin";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import { getGoverningBodiesList } from "../../api/governingBodiesApi";
import { GoverningBody } from "../../api/decisionsApi";
moment.locale("uk-ua");

const RegionBoardAdministration = () => {
  const { id } = useParams();
  const history = useHistory();

  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getGoverningBodies = async () => {
    setLoading(true);
    const responseOrgs = await getGoverningBodiesList();
    setPhotosLoading(true);

    setGoverningBodies(responseOrgs);
    setLoading(false);
  };

  const showModal = (member: any) => {
    setAdmin(member);
    setVisibleModal(true);
  };

  const handleOk = () => {
    setVisibleModal(false);
  };

  useEffect(() => {
    getGoverningBodies();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>Керівні органи Крайового Проводу</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {governingBodies.length > 0 ? (
            governingBodies.map((governingBody) => (
              <Card
                key={governingBody.id}
                className="detailsCard"
                title={`${governingBody.name}`}
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
              >
                <div className="cityMember">
                  <div 
                    onClick={() => history.push(`/governingBody/${governingBody.id}`)}
                  >
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar size={86} src={governingBody.logo} />
                    )}
                    <Card.Meta
                      className="detailsMeta"
                      title={`${governingBody.name}`}
                    />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає керівних органів Крайового Проводу</Title>
          )}
        </div>
      )}
      <div className="cityMoreItems">
        <Button
          className="backButton"
          icon={<RollbackOutlined />}
          size={"large"}
          onClick={() => history.goBack()}
          type="primary"
        >
          Назад
        </Button>
      </div>

      <Modal
        title="Редагувати діловода"
        visible={visibleModal}
        onOk={handleOk}
        onCancel={handleOk}
        footer={null}
      ></Modal>
    </Layout.Content>
  );
};

export default RegionBoardAdministration;
