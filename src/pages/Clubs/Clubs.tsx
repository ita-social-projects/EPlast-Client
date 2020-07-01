import React, {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from "react-router-dom";
import {Card, Layout} from "antd";
import http from "../../api/api";
import City from "../../assets/images/city.jpg";
import Add from "../../assets/images/add.png";
import clubImg from '../../assets/images/clubBuryverkhy.png';

const classes = require('./Clubs.module.css');

interface CardProps {
  title: string;
  name: string;
  imgUrl?: string;
  userId?: string;
  id: string;
}

const Clubs = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [clubs, setClubs] = useState([]);

  const getClubs = async () => {
    const response = await http.get('posts');
    setClubs(response.data.slice(0, 8));
  };

  useEffect(() => {
    getClubs();
  }, []);

  // trial data
  const clubBur = {
    title: 'Буриверхи',
    name: 'Буриверхи',
    imgUrl: {clubImg},
    id: '1111'
  };
  return (
      <Layout.Content>
        <h1 className={classes.mainTitle}>Курені</h1>
        <div className={classes.wrapper}>
          <Card hoverable
                className={classes.cardStyles}
                cover={<img src={Add} alt="Add" />}
                onClick={() => history.push(`${url}/new`)}>
            <Card.Meta className={classes.titleText} title="Створити новий курінь"/>
          </Card>

          <Card
              key={clubBur.id}
              hoverable
              className={classes.cardStyles}
              cover={<img src={clubImg} alt="Club" style={{width:'36%', margin: '10px auto 0'}}/>}
              onClick={() => history.push(`${url}/${clubBur.id}`)}
          >
            <Card.Meta title={clubBur.title || clubBur.name} className={classes.titleText} />
          </Card>

          {clubs.map((club: CardProps) => (
              <Card
                  key={club.id}
                  hoverable
                  className={classes.cardStyles}
                  cover={<img src={City} alt="Club" />}
                  onClick={() => history.push(`${url}/${club.id}`)}
              >
                <Card.Meta title={club.title || club.name} className={classes.titleText} />
              </Card>
          ))}
        </div>
      </Layout.Content>
  );
};
export default Clubs;


