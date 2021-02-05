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
import governingBodiesApi from "../../api/governingBodiesApi";
import { Organization } from "../../api/decisionsApi";
moment.locale("uk-ua");

const RegionBoardAdministration = () => {
  const { id } = useParams();
  const history = useHistory();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getGoverningBodies = async () => {
    setLoading(true);
    const responseOrgs = await governingBodiesApi.getOrganizationsList();
    setPhotosLoading(true);
    // setPhotos([...response.data].filter((a) => a != null));
    setOrganizations(responseOrgs);
    setLoading(false);
  };

  // const removeAdministrator = async (admin: CityAdmin) => {
  //   await removeAdmin(admin.id);
  //   await NotificationBoxApi.createNotifications(
  //     [admin.userId],
  //     `Вас було позбавлено адміністративної ролі: '${admin.adminType.adminTypeName}' в `,
  //     NotificationBoxApi.NotificationTypes.UserNotifications,
  //     `/regions/${id}`,
  //     `цій окрузі`
  //   );
  //   setAdministration(administration.filter((u) => u.id !== admin.id));
  // };

  const showModal = (member: any) => {
    setAdmin(member);
    setVisibleModal(true);
  };

  const handleOk = () => {
    setVisibleModal(false);
  };

  // const onAdd = async (newAdmin: any) => {
  //   const index = organizations.findIndex((a) => a.id === admin.id);
  //   organizations[index] = newAdmin;
  //   await NotificationBoxApi.createNotifications(
  //     [newAdmin.userId],
  //     `Вам було надано нову адміністративну роль: '${newAdmin.adminType.adminTypeName}' в `,
  //     NotificationBoxApi.NotificationTypes.UserNotifications,
  //     `/regions/${id}`,
  //     `цій окрузі`
  //   );
  //   setAdministration(administration);
  // };

  // const setPhotos = async (members: any[]) => {
  //   for (let i of members) {
  //     i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
  //   }

  //   setPhotosLoading(false);
  // };

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
          {organizations.length > 0 ? (
            organizations.map((organization) => (
              <Card
                key={organization.id}
                className="detailsCard"
                title={`${organization.organizationName}`}
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
              // actions={[
              //   <SettingOutlined onClick={() => showModal(member)} />,
              //   <CloseOutlined onClick={() => removeAdministrator(member)} />,
              // ]}
              >
                <div
                  // onClick={() =>
                  //   history.push(`/userpage/main/${member.userId}`)
                  // }
                  className="cityMember"
                >
                  <div>
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar size={86} src="" />
                    )}
                    <Card.Meta
                      className="detailsMeta"
                      title={`${organization.organizationName}`}
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
      >
      </Modal>
    </Layout.Content>
  );
};

export default RegionBoardAdministration;
