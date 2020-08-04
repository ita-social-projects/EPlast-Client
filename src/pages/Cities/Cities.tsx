import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Card, Layout, Pagination, Spin } from "antd";
import Add from "../../assets/images/add.png";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg";
import { getCitiesByPage, getLogo } from "../../api/citiesApi";
import classes from "./Cities.module.css";
<<<<<<< HEAD

interface CardProps {
  id: number;
  name: string;
  logo: string;
}
=======
import CityProfile from '../../models/City/CityProfile';
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544

const Cities = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

<<<<<<< HEAD
  const [cities, setCities] = useState([]);
=======
  const [cities, setCities] = useState<CityProfile[]>([]);
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
  const [canCreate, setCanCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const getCities = async () => {
    setLoading(true);
<<<<<<< HEAD
    const response = await getCitiesByPage(page, pageSize);

    for await (const city of response.data.cities) {
      if (city.logo === null) {
        city.logo = CityDefaultLogo;
      } else {
        const logo = await getLogo(city.logo);
        city.logo = logo.data;
      }
    }

    setCities(response.data.cities);
    setCanCreate(true);
    setTotal(response.data.total);
    setLoading(false);
=======

    try {
      const response = await getCitiesByPage(page, pageSize);
      
      for await (const city of response.data.cities) {
        if (city.logo === null) {
          city.logo = CityDefaultLogo;
        } else {
          const logo = await getLogo(city.logo);
          city.logo = logo.data;
        }
      }
      
      setCities(response.data.cities);
      // setCanCreate(response.data.canCreate);
      setCanCreate(true);
      setTotal(response.data.total);
    }
    finally {
      setLoading(false);
    }
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
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
<<<<<<< HEAD
        {!loading && canCreate ? (
=======
        {!loading && canCreate && page === 1 ? (
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
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
<<<<<<< HEAD
          ? cities.map((city: CardProps) => (
=======
          ? cities.map((city: CityProfile) => (
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
              <Card
                key={city.id}
                hoverable
                className={classes.cardStyles}
                cover={
                  <img
<<<<<<< HEAD
                    src={city.logo}
=======
                    src={city.logo || undefined}
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
                    alt="City"
                    style={{ height: "154.45px" }}
                  />
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
