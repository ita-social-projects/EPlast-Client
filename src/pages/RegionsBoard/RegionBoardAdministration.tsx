import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { Avatar, Button, Card, Layout, Modal, Skeleton } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import "../Regions/Region.less";
import "../City/Cities/Cities.less";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import {
  getGoverningBodiesList,
  getGoverningBodyLogo
} from "../../api/governingBodiesApi";
import { GoverningBody } from "../../api/decisionsApi";
import { getUserAccess } from "../../api/regionsBoardApi";
import jwt from "jwt-decode";
import AuthLocalStorage from "../../AuthLocalStorage";
import Add from "../../assets/images/add.png";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../components/Tooltip";
moment.locale("uk-ua");

const RegionBoardAdministration = () => {
  const history = useHistory();

  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const path: string = "governingBodies";
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );

  const getUserAccesses = async () => {
    let user: any = jwt(AuthLocalStorage.getToken() as string);
    await getUserAccess(user.nameid).then((response) => {
      setUserAccesses(response.data);
    });
  };

  const setPhotos = async (governingBodies: GoverningBody[]) => {
    for (let i = 0; i < governingBodies.length; i++) {
      if (governingBodies[i].logo == undefined) continue;
      governingBodies[i].logo = (
        await getGoverningBodyLogo(governingBodies[i].logo!)
      ).data;
    }

    setPhotosLoading(false);
  };

  const getGoverningBodies = async () => {
    setLoading(true);
    const responseOrgs = await getGoverningBodiesList();
    setGoverningBodies(responseOrgs);
    setPhotosLoading(true);
    setPhotos(responseOrgs);
    setLoading(false);
  };

  const renderGoverningBodies = (arr: GoverningBody[]) => {
    if (arr) {
      // eslint-disable-next-line react/no-array-index-key
      return arr.map((govBody: GoverningBody) => (
        <Link to={`${path}/${govBody.id}`}>
          <Card
            key={govBody.id}
            hoverable
            className="cardStyles"
            cover={
              photosLoading ? (
                <Skeleton.Avatar shape="square" active />
              ) : (
                <img src={govBody.logo || CityDefaultLogo} alt="Governing body" />
              )
            }
          >
            <Card.Meta title={govBody.governingBodyName} className="titleText" />
          </Card>
        </Link>
      ));
    }
    return null;
  }

  const handleOk = () => {
    setVisibleModal(false);
  };

  useEffect(() => {
    getUserAccesses();
    getGoverningBodies();
  }, []);

  return (
    <Layout.Content className="cities">
      <Title level={2}>Керівні органи Крайового Проводу</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityWrapper">
          { governingBodies.length === 0 ? (
                <Title level={4} style={{width: "100%"}}>
                  Ще немає керівних органів Крайового Проводу
                </Title>
              ) : null}
          {userAccesses["CreateGB"] ? (
            <Card
              hoverable
              className="cardStyles addCity"
              cover={<img src={Add} alt="AddCity" />}
              onClick={() => history.push(`${path}/new`)}
            >
             <Card.Meta
                className="titleText"
                title="Новий керівний орган"
              />
            </Card>
              ) : null }
              { governingBodies.length > 0 ? (
                renderGoverningBodies(governingBodies)
              ) : null}            
        </div>
      )}

      <Modal
        title="Редагувати діловода"
        visible={visibleModal}
        onOk={handleOk}
        onCancel={handleOk}
        footer={null}
      />
    </Layout.Content>
  );
};

export default RegionBoardAdministration;
