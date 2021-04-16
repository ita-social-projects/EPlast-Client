import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Row, Skeleton, Spin } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { getRegionById } from "../../api/regionsApi";
import { getLogo } from "../../api/citiesApi";
import "../Regions/Region.less";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
moment.locale("uk-ua");

const RegionBoardMembers = () => {
  const { id } = useParams();
  const history = useHistory();

  const [governingBodies, setGoverningBodies] = useState<any[]>([
    {
      id: "",
      name: "",
      logo: "",
    },
  ]);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getGoverningBodies = async () => {
    setLoading(true);
    const response = await getRegionById(id);

    setPhotosLoading(true);
    setPhotos(response.data.cities);

    setLoading(false);
  };

  const setPhotos = async (governingBody: any[]) => {
    for (let i = 0; i < governingBody.length; ++i) {
      governingBodies[i] = governingBody[i];
    }
    for (let i = 0; i < governingBody.length; ++i) {
      if (governingBody[i].logo !== null) {
        governingBodies[i].logo = (await getLogo(governingBody[i].logo)).data;
      } else {
        governingBodies[i].logo = CityDefaultLogo;
      }
    }

    setPhotosLoading(false);
  };

  useEffect(() => {
    getGoverningBodies();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>Члени округи</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {governingBodies.length > 0 ? (
            governingBodies.map((governingBody: any) => (
              <Card key={governingBody.id} className="detailsCard">
                <div
                  onClick={() => history.push(`/governingBody/${governingBody.id}`)}
                  className="cityMember"
                >
                  {photosLoading ? (
                    <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                  ) : (
                    <Avatar
                      size={86}
                      src={governingBody.logo}
                      className="detailsIcon"
                    />
                  )}
                  <Card.Meta className="detailsMeta" title={`${governingBody.name}`} />
                </div>
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає членів станиці</Title>
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

export default RegionBoardMembers;
