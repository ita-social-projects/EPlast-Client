import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Card, Layout, Pagination, Skeleton, Spin } from "antd";
import Add from "../../../assets/images/add.png";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import { getCitiesByPage, getLogo } from "../../../api/citiesApi";
import classes from "./Cities.module.css";
import CityProfile from '../../../models/City/CityProfile';

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
    <Layout.Content>
      <h1 className={classes.mainTitle}>Станиці</h1>
      <div className={classes.wrapper}>
        {!loading && canCreate && page === 1 ? (
          <Card
            hoverable
            className={`${classes.addCity} ${classes.cardStyles}`}
            cover={<img src={Add} alt="AddCity" />}
            onClick={() => history.push(`${url}/new`)}
          >
            <Card.Meta
              className={classes.titleText}
              title="Створити нову станицю"
            />
          </Card>
        ) : null}
        {!loading
          ? cities.map((city: CityProfile) => (
              <Card
                key={city.id}
                hoverable
                className={classes.cardStyles}
                cover={
                  photosLoading ? (
                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <Skeleton.Avatar
                        shape="square"
                        active
                        size={154}
                      />
                    </div>
                  ) : (
                    <img
                      src={city.logo || undefined}
                      alt="City"
                      style={{ height: "154.45px" }}
                    />
                  )
                }
                onClick={() => history.push(`${url}/${city.id}`)}
              >
                <Card.Meta title={city.name} className={classes.titleText} />
              </Card>
            ))
          : null}
      </div>
      <div className={classes.pagination}>
        {!loading ? (
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            onChange={(page) => handleChange(page)}
            onShowSizeChange={(page, size) => handleSizeChange(page, size)}
          />
        ) : (
          <Spin size="large" />
        )}
      </div>
    </Layout.Content>
  );
};
export default Cities;
