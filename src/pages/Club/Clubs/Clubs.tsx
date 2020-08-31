import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Card, Spin, Layout, Pagination} from "antd";
import clubsApi from "../../../api/clubsApi";
import Add from "../../../assets/images/add.png";
import classes from "./Clubs.module.css";
import Club from "../../../models/Club/Club";

const Clubs = () => {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [loading, setLoading] = useState(false);

  const [clubs, setClubs] = useState<Club[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [clubsCount, setClubsCount] = useState(0);

  const getClubs = async () => {
    const fetchData = async () => {
        setLoading(true);

        const responseCount = await clubsApi.getClubsCount();
        setClubsCount(responseCount.data);
        const response = await clubsApi.getClubsByPage(pageNumber, pageSize);
        console.log(response);
        setClubs(response.data);

        setLoading(false);
      };
      fetchData();
  };

  const handlePageNumberChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  }

  const handlePageSizeChange = (pageNumber: number, pageSize: number = 10) => {
    setPageNumber(pageNumber);
    setPageSize(pageSize);
  }

  useEffect(() => {
    getClubs();
  }, [pageNumber, pageSize]);

  return (
    <Layout.Content>
      <h1 className={classes.mainTitle}>Курені</h1>
      {loading ? ( 
        <div className={classes.spiner}>
          <Spin size="large" />
        </div>
      ) : (
        <div>
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
          {clubs.map((club: Club) => (
            <Card
              key={club.id}
              hoverable
              className={classes.cardStyles}
              cover={
                <img src={club.logo} alt="Club" className={classes.cardCoverStyles} />
              }
              onClick={() => history.push(`${url}/${club.id}`)}
            >
              <Card.Meta title={club.clubName} className={classes.titleText} />
            </Card>
          ))}
        </div>
        <div className={classes.pagination}>
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={clubsCount}
          showSizeChanger
          onChange={(pageNumber) => handlePageNumberChange(pageNumber)}
          onShowSizeChange={(pageNumber, pageSize) => handlePageSizeChange(pageNumber, pageSize)}
        />
        </div> 
      </div> )}
    </Layout.Content>
  );

};
export default Clubs;
