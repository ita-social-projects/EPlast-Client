import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import { Card, Layout, Pagination, Result, Skeleton, Tooltip } from "antd";
import Add from "../../../assets/images/add.png";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import { getActiveClubByPage, getNotActiveClubByPage, getLogo } from "../../../api/clubsApi";
import "./Clubs.less";
import ClubProfile from "../../../models/Club/ClubProfile";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import Search from "antd/lib/input/Search";
import userApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";

interface Props {
  switcher: boolean;
}

const nameMaxLength = 23;
const SortedClubs = ( {switcher}: Props) => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [clubs, setClubs] = useState<ClubProfile[]>([]);
  const [activeCities, setActiveCities] = useState<ClubProfile[]>([]);
  const [notActiveCities, setNotActiveCities] = useState<ClubProfile[]>([]);
  const [canCreate, setCanCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [activeTotal, setActiveTotal] = useState(0);
  const [notActiveTotal, setNotActiveTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [activeCanCreate, setActiveCanCreate] = useState<boolean>(false);

  const setPhotos = async (clubs: ClubProfile[]) => {
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
  const getActiveClubs = async () => {
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
      setTotal(response.data.total);
    } finally {
      setLoading(false);
    }
  };

  const getNotActiveClubs = async () => {
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
    setPage(page);
  };

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = (event: any) => {
    setPage(1);
    setSearchedData(event);
  };

  const renderCity = (arr: ClubProfile[]) => {
    if (arr) {
        // eslint-disable-next-line react/no-array-index-key
        return  arr.map((club: ClubProfile) =>(
          <Link to={`${url}/${club.id}`}>
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
    switcher ? (getNotActiveClubs()):(getActiveClubs()) 

  }, [page, pageSize, searchedData]);

  useEffect(()=>{
    setPage(1);
    switcher ? (getNotActiveClubs()) :(getActiveClubs())
    setCanCreate(switcher ? false : activeCanCreate);
  },[switcher])

  return (
    <Layout.Content className="cities">
      {switcher ? (
        <Title level={1}>Не активні курені</Title>) : (
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
                  onClick={() => history.push(`${url}/new`)}
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
                showLessItems
                onChange={(page) => handleChange(page)}
                onShowSizeChange={(page, size) => handleSizeChange(page, size)}
              />
            </div>
          </div>
      )}
    </Layout.Content>
  );
};
export default SortedClubs;
