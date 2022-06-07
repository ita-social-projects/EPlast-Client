import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Avatar, Button, Card, Layout, Skeleton } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import "../Regions/Region.less";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import {
  getGoverningBodiesAdmins,
} from "../../api/governingBodiesApi";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../components/Tooltip";
import GoverningBodyAdmin from "../../models/GoverningBody/GoverningBodyAdmin";
import userApi from "../../api/UserApi";

moment.locale("uk-ua");

const adminTypeNameMaxLength = 23;
const RegionBoardMainAdministration = () => {
  const history = useHistory();

  const [governingBodiesAdmins, setGoverningBodiesAdmins] = useState<
    GoverningBodyAdmin[]
  >([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const setPhotos = async (admins: GoverningBodyAdmin[]) => {
    for (let i of admins) {
      i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
    }
    setPhotosLoading(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      debugger
      const responseAdmins = (await getGoverningBodiesAdmins()).data;
      setGoverningBodiesAdmins(responseAdmins);
      setPhotosLoading(true);
      setPhotos(responseAdmins);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setVisibleModal(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>Адміністрація Крайового Проводу</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {governingBodiesAdmins.length > 0 ? (
            governingBodiesAdmins.map((admin) => (
              <Card
                key={admin.id}
                className="detailsCard"
                title={extendedTitleTooltip(
                  adminTypeNameMaxLength,
                  `${admin.governingBodyAdminRole}`
                )}
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
              >
                <div className="cityMember">
                  <div
                    onClick={() =>
                      history.push(`/userpage/main/${admin.userId}`)
                    }
                  >
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86} />
                    ) : (
                      <Avatar size={86} src={admin.user.imagePath} />
                    )}
                    <Card.Meta
                      className="detailsMeta"
                      title={extendedTitleTooltip(
                        parameterMaxLength,
                        `${admin.user.firstName} ${admin.user.lastName}`
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає адміністрації Крайового Проводу</Title>
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

      
    </Layout.Content>
  );
};

export default RegionBoardMainAdministration;
