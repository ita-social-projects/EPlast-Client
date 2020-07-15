import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Card, Layout } from "antd";
import clubsApi from "../../api/clubsApi";
import City from "../../assets/images/city.jpg";
import Add from "../../assets/images/add.png";

const classes = require("./Clubs.module.css");

interface CardProps {
  clubName: string;
  imgUrl?: string;
  id: string;
}

const Clubs = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [clubs, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await clubsApi.getAll();
      setData(res.data);
    };
    fetchData();
  }, []);

  return (
    <Layout.Content>
      <h1 className={classes.mainTitle}>Курені</h1>
      <div className={classes.wrapper}>
        <Card
          hoverable
          className={classes.cardStyles}
          cover={<img src={Add} alt="Add" />}
          onClick={() => history.push(`${url}/new`)}
        >
          <Card.Meta
            className={classes.titleText}
            title="Створити новий курінь"
          />
        </Card>

        {clubs.map((club: CardProps) => (
          <Card
            key={club.id}
            hoverable
            className={classes.cardStyles}
            cover={<img src={City} alt="Club" />}
            onClick={() => history.push(`${url}/${club.id}`)}
          >
            <Card.Meta title={club.clubName} className={classes.titleText} />
          </Card>
        ))}
      </div>
    </Layout.Content>
  );
};
export default Clubs;
