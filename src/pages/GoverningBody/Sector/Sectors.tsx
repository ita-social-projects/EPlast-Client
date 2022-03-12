import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Skeleton } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import "../../Regions/Region.less";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import {
  getSectorsListByGoverningBodyId,
  getSectorLogo,
} from "../../../api/governingBodySectorsApi";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import SectorProfile from "../../../models/GoverningBody/Sector/SectorProfile";
import extendedTitleTooltip, {
  parameterMaxLength,
} from "../../../components/Tooltip";
moment.locale("uk-ua");

const Sectors = () => {
  const history = useHistory();
  const { governingBodyId } = useParams();

  const [sectors, setSectors] = useState<SectorProfile[]>([]);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const setPhotos = async (sectors: SectorProfile[]) => {
    for (let i = 0; i < sectors.length; i++) {
      if (sectors[i].logo == null) sectors[i].logo = CityDefaultLogo;
      else {
        sectors[i].logo = (await getSectorLogo(sectors[i].logo!)).data;
      }
    }

    setPhotosLoading(false);
  };

  const getSectors = async () => {
    setLoading(true);
    const responseSectors = await getSectorsListByGoverningBodyId(
      governingBodyId
    );
    setSectors(responseSectors);
    setPhotosLoading(true);
    await setPhotos(responseSectors);
    setLoading(false);
  };

  useEffect(() => {
    getSectors();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>Напрями Керівного Органу</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cityMoreItems">
          {sectors.length > 0 ? (
            sectors.map((sector) => (
              <Card
                key={sector.id}
                className="detailsCard"
                title={extendedTitleTooltip(
                  parameterMaxLength,
                  `${sector.name}`
                )}
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
              >
                <div className="cityMember">
                  <div
                    onClick={() =>
                      history.push(
                        `/governingBodies/${governingBodyId}/sectors/${sector.id}`
                      )
                    }
                  >
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar
                        size={86}
                        src={sector.logo === null ? undefined : sector.logo}
                      />
                    )}
                    <Card.Meta className="detailsMeta" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Title level={4}>Ще немає Напрямів Керівного Органу</Title>
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

export default Sectors;
