import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import { Card, Layout, Pagination, Result, Skeleton } from "antd";
import Add from "../../../assets/images/add.png";
import ClubDefaultLogo from "../../../assets/images/default_club_image.jpg";
import { getClubByPage, getLogo } from "../../../api/clubsApi";
import "./Clubs.less";
import ClubProfile from "../../../models/Club/ClubProfile";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import Search from "antd/lib/input/Search";

const Clubs = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [clubs, setClubs] = useState<ClubProfile[]>([]);
  const [canCreate, setCanCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");

  const setPhotos = async (clubs: ClubProfile[]) => {
    for await (const club of clubs) {
      if (club.logo === null) {
        club.logo = ClubDefaultLogo;
      } else {
        const logo = await getLogo(club.logo);
        club.logo = logo.data;
      }
    }

    setPhotosLoading(false);
  };

  const getClubs = async () => {
    setLoading(true);

    try {
      const response = await getClubByPage(
        page,
        pageSize,
        searchedData.trim()
      );

      setPhotosLoading(true);
      setPhotos(response.data.clubs);
      setClubs(response.data.clubs);
      setCanCreate(response.data.canCreate);
      setTotal(response.data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (page: number) => {
    setPage(page);
  };

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    getClubs();
  }, [page, pageSize, searchedData]);

  const handleSearch = (event: any) => {
    setPage(1);
    setSearchedData(event);
  };

  return (
    <Layout.Content className="clubs">
      <Title level={1}>Курені</Title>
      <div className="searchContainer">
        <Search
          placeholder="Пошук"
          enterButton
          onSearch={handleSearch}
          loading={photosLoading}
          disabled={photosLoading}
        />
      </div>
      {loading ? (
        <Spinner />
      ) : (
          <div>
            <div className="clubWrapper">
              {canCreate && page === 1 && searchedData.length === 0 ? (
                <Card
                  hoverable
                  className="cardStyles addClub"
                  cover={<img src={Add} alt="AddClub" />}
                  onClick={() => history.push(`${url}/new`)}
                >
                  <Card.Meta
                    className="titleText"
                    title="Створити новий курінь"
                  />
                </Card>
              ) : null}

              {clubs.length === 0 && searchedData.length !== 0 ? (
                <div>
                  <Result status="404" title="Курінь не знайдено" />
                </div>
              ) : (
                  clubs.map((club: ClubProfile) => (
                    <Link to={`${url}/${club.id}`} key={`club-${club.id}`}>
                      <Card
                        key={club.id}
                        hoverable
                        className="cardStyles"
                        cover={
                          photosLoading ? (
                            <Skeleton.Avatar shape="square" active />
                          ) : (
                              <img src={club.logo || undefined} alt="Club" />
                            )
                        }
                        onClick={() => history.push(`${url}/${club.id}`)}
                      >
                        <Card.Meta title={club.name} className="titleText" />
                      </Card>
                    </Link>
                  ))
                )}
            </div>
            <div className="pagination">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                responsive
                showSizeChanger={total >= 10}
                onChange={(page) => handleChange(page)}
                onShowSizeChange={(page, size) => handleSizeChange(page, size)}
              />
            </div>
          </div>
        )}
    </Layout.Content>
  );
};
export default Clubs;
