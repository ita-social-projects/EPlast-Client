import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { Card, Layout, Pagination, Result, Skeleton, Tooltip } from "antd";
import Add from "../../../assets/images/add.png";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import { getActiveClubByPage, getNotActiveClubByPage, getLogo } from "../../../api/clubsApi";
import "./Clubs.less";
import ClubByPage from "../../../models/Club/ClubByPage";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import Search from "antd/lib/input/Search";
import userApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";
import Props from "../../Interfaces/SwitcherProps";

const nameMaxLength = 23;


const SortedClubs = ( {switcher}: Props) => { 
  const path: string  = "/clubs";
  const history = useHistory();
  const [clubs, setClubs] = useState<ClubByPage[]>([]);
  const [canCreate, setCanCreate] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [activeCanCreate, setActiveCanCreate] = useState<boolean>(false);
  const {p} = useParams();
  const [page, setPage] = useState(+p);

  const setPhotos = async (clubs: ClubByPage[]) => {
    try {
      for await (const club of clubs) {
        if (club.logo === null) {
          club.logo = CityDefaultLogo;
        } else {
          const logo = await getLogo(club.logo);
          club.logo = logo.data;
        }
      }
    } finally {
      setPhotosLoading(false);
    }
    
  };
  const getActiveClubs = async (page: number = 1) => {
    setLoading(true);

    try {
      const response = await getActiveClubByPage(
        page,
        pageSize,
        searchedData.trim()
      );

      setPhotosLoading(true);
      setActiveUserRoles(userApi.getActiveUserRoles);
      setPhotos(response.data.clubs);
      setClubs(response.data.clubs);
      setCanCreate(response.data.canCreate);
      setActiveCanCreate(response.data.canCreate);
      setTotal(response.data.rows);
    } finally {
      setLoading(false);
    }
  };

  const getNotActiveClubs = async (page: number = 1) => {
    setLoading(true);

    try {
      const response = await getNotActiveClubByPage(
        page,
        pageSize,
        searchedData.trim()
      );

      setPhotosLoading(true);
      setActiveUserRoles(userApi.getActiveUserRoles);
      setPhotos(response.data.clubs);
      setClubs(response.data.clubs);
      setTotal(response.data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (page: number) => {
    history.push(`${path}/page/${page}`);
    setPage(page);
  };

  const handleSizeChange = (pageSize: number = 10) => {
    setPageSize(pageSize);
  };

  const handleSearch = (event: any) => {
    setSearchedData(event);
  };

  const renderCity = (arr: ClubByPage[]) => {
    if (arr) {
        // eslint-disable-next-line react/no-array-index-key
        return  arr.map((club: ClubByPage) =>(
          <Link to={`${path}/${club.id}`}>
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
                >
                  {(club.name?.length > nameMaxLength) ?
                    <Tooltip title={club.name}>
                      <Card.Meta title={club.name.slice(0, 22) + "..."} className="titleText"/>
                    </Tooltip>
                    : 
                    <Card.Meta title={club.name} className="titleText"/>
                  }
              </Card>
          </Link>
        ))   
    }
    return null;
};

  useEffect(() => {
    setPage(+p);
  });

  useEffect(() => {
    switcher ? (getNotActiveClubs(page)):(getActiveClubs(page)) 
  }, [page, pageSize, searchedData]);

  useEffect(()=> {
    if (clubs.length !== 0){
      switcher ? (getNotActiveClubs()) :(getActiveClubs())
      setCanCreate(switcher ? false : activeCanCreate);
    }
  },[switcher])

  return (
    <Layout.Content className="cities">
      {switcher ? (
        <Title level={1}>Неактивні курені</Title>) : (
        <Title level={1}>Курені</Title>
      )}
      <div className="searchContainer">
        <Search
          placeholder="Пошук"
          enterButton
          onSearch={handleSearch}
          loading={photosLoading}
          disabled={photosLoading}
          allowClear={true}
        />
      </div>
      {loading ? (
        <Spinner />
      ) : (
        
          <div>
            <div className="cityWrapper">
              { switcher ? (null) : (
              activeUserRoles.includes(Roles.Admin) && page === 1 && searchedData.length === 0 ? (
                <Card
                  hoverable
                  className="cardStyles addCity"
                  cover={<img src={Add} alt="AddCity" />}
                  onClick={() => history.push(`${path}/new`)}
                >
                  <Card.Meta
                    className="titleText"
                    title="Створити новий курінь"
                  />
                </Card>
              ) : null ) }
              {clubs.length === 0 ? (
                <div>
                  <Result status="404" title="Курінь не знайдено" />
                </div>
              ) : (
                  renderCity(clubs)
                )}
            </div>
            <div className="pagination">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                responsive
                showSizeChanger={total >= 20}
                onChange={(page) => handleChange(page)}
                onShowSizeChange={(page, size) => handleSizeChange(size)}
              />
            </div>
          </div>
      )}
    </Layout.Content>
  );
};
export default SortedClubs;
