import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Card, Layout } from "antd";
import clubsApi from "../../api/clubsApi";
import Add from "../../assets/images/add.png";

const classes = require("./Clubs.module.css");

interface CardProps {
  id:number;
  clubName: string;
  clubURL: string;
  description: string;
  logo: string;
}

const Clubs = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [clubs, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const res = await clubsApi.getAll();
      setData(res.data);
    };
    fetchData();
    setLoading(false);

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
            cover={<img src={club.logo} alt="Club" style={{height: '154.45px'}}/>}
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
