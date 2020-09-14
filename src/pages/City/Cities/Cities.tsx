import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Card, Layout, Pagination, Skeleton, Spin } from "antd";
import Add from "../../../assets/images/add.png";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import { getCitiesByPage, getLogo } from "../../../api/citiesApi";
import "./Cities.less";
import CityProfile from '../../../models/City/CityProfile';
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";

const Cities = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [cities, setCities] = useState<CityProfile[]>([]);
  const [canCreate, setCanCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);

  const setPhotos = async (cities: CityProfile[]) => {
    for await (const city of cities) {
      if (city.logo === null) {
        city.logo = CityDefaultLogo;
      } else {
        const logo = await getLogo(city.logo);
        city.logo = logo.data;
      }
    }

    setPhotosLoading(false);
  };

  const getCities = async () => {
    setLoading(true);

    try {
      const response = await getCitiesByPage(page, pageSize);
      
      setPhotosLoading(true);
      setPhotos(response.data.cities);

      setCities(response.data.cities);
      setCanCreate(response.data.canCreate);
      setTotal(response.data.total);
    }
    finally {
      setLoading(false);
    }
  };

  const handleChange = (page: number) => {
    setPage(page);
  }

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  }

  useEffect(() => {
    getCities();
  }, [page, pageSize]);

  return (
    <Layout.Content className="cities">
      <Title level={1}>Станиці</Title>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="cityWrapper">
            {canCreate && page === 1 ? (
              <Card
                hoverable
                className="cardStyles addCity"
                cover={<img src={Add} alt="AddCity" />}
                onClick={() => history.push(`${url}/new`)}
              >
                <Card.Meta
                  className="titleText"
                  title="Створити нову станицю"
                />
              </Card>
            ) : null}
            {cities.map((city: CityProfile) => (
              <Card
                key={city.id}
                hoverable
                className="cardStyles"
                cover={
                  photosLoading ? (
                    <Skeleton.Avatar shape="square" active />
                  ) : (
                    <img src={city.logo || undefined} alt="City" />
                  )
                }
                onClick={() => history.push(`${url}/${city.id}`)}
              >
                <Card.Meta title={city.name} className="titleText" />
              </Card>
            ))}
          </div>
          <div className="pagination">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              onChange={(page) => handleChange(page)}
              onShowSizeChange={(page, size) => handleSizeChange(page, size)}
            />
          </div>
        </div>
      )}
    </Layout.Content>
  );
};
export default Cities;
