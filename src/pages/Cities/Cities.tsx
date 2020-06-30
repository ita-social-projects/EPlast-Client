import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Card, Layout } from 'antd';
import http from '../../api/api';
import City from '../../assets/images/city.jpg';
import Add from '../../assets/images/add.png';

const classes = require('./Cities.module.css');

interface CardProps {
  title: string;
  name: string;
  imgUrl?: string;
  userId?: string;
  id: string;
}

const Cities = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [cities, setCities] = useState([]);

  const getCities = async () => {
    const response = await http.get('posts');
    setCities(response.data.slice(0, 8));
  };

  useEffect(() => {
    getCities();
  }, []);

  return (
    <Layout.Content>
      <h1 className={classes.mainTitle}>Станиці</h1>
      <div className={classes.wrapper}>
        <Card hoverable
              className={classes.cardStyles}
              cover={<img src={Add} alt="Add" />}
              onClick={() => history.push(`${url}/new`)}>
          <Card.Meta className={classes.titleText} title="Створити нову станицю"/>
        </Card>

        {cities.map((city: CardProps) => (
          <Card
            key={city.id}
            hoverable
            className={classes.cardStyles}
            cover={<img src={City} alt="City" />}
            onClick={() => history.push(`${url}/${city.id}`)}
          >
            <Card.Meta title={city.title || city.name} className={classes.titleText} />
          </Card>
        ))}

      </div>
    </Layout.Content>
  );
};
export default Cities;
