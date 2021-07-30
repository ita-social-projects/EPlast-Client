import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import { Card, Layout, Pagination, Result, Skeleton } from "antd";
import Add from "../../../assets/images/add.png";
import CityDefaultLogo from "../../../assets/images/default_city_image.jpg";
import { getActiveCitiesByPage, getNotActiveCitiesByPage, getLogo } from "../../../api/citiesApi";
import "./Cities.less";
import CityProfile from "../../../models/City/CityProfile";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
import Search from "antd/lib/input/Search";
import userApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";

interface Props {
  switcher: boolean;
}

const SortedCities = ( {switcher}: Props) => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [cities, setCities] = useState<CityProfile[]>([]);
  const [activeCities, setActiveCities] = useState<CityProfile[]>([]);
  const [notActiveCities, setNotActiveCities] = useState<CityProfile[]>([]);
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

  const setPhotos = async (cities: CityProfile[]) => {
    try{
      for await (const city of cities) {
        if (city.logo === null) {
          city.logo = CityDefaultLogo;
        } else {
          const logo = await getLogo(city.logo);
          city.logo = logo.data;
        }
      }
    }finally{
      setPhotosLoading(false);
    }
    
  };
  const getActiveCities = async () => {
    setLoading(true);

    try {
      const response = await getActiveCitiesByPage(
        page,
        pageSize,
        searchedData.trim()
      );

      setPhotosLoading(true);
      setActiveUserRoles(userApi.getActiveUserRoles);
      setPhotos(response.data.cities);
      setCities(response.data.cities);
      setCanCreate(response.data.canCreate);
      setTotal(response.data.total);
    } finally {
      setLoading(false);
    }
  };

  const getNotActiveCities = async () => {
    setLoading(true);

    try {
      const response = await getNotActiveCitiesByPage(
        page,
        pageSize,
        searchedData.trim()
      );

      setPhotosLoading(true);
      setActiveUserRoles(userApi.getActiveUserRoles);
      setPhotos(response.data.cities);
      setCities(response.data.cities);
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

  const renderCity = (arr: CityProfile[]) => {
    if (arr) {
        // eslint-disable-next-line react/no-array-index-key
        return  arr.map((city: CityProfile) =>(
          <Link to={`${url}/${city.id}`}>
              <Card
              key={city.id}
              hoverable
              className="cardStyles"
              cover={
                  photosLoading ? (
                  <Skeleton.Avatar shape="square" active />
                  ) : (
                      <img src={city.logo || undefined} alt="City" />
                  )
              }
              onClick={() => history.push(`${url}/${city.id}`)}
              >
                  <Card.Meta title={city.name} className="titleText" />
              </Card>
        </Link>
          ))   
    }
    return null;
};

  useEffect(() => {
    switcher ? (getNotActiveCities()):(getActiveCities()) 

  }, [page, pageSize, searchedData]);

  useEffect(()=>{
    setPage(1);
    switcher ? (getNotActiveCities()) :(getActiveCities())
    setCanCreate(switcher ? false : activeCanCreate);
  },[switcher])

  return (
    <Layout.Content className="cities">
      {switcher ? (
      <Title level={1}>Не активні станиці</Title>) : (
      <Title level={1}>Станиці</Title>
      )}
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
                    title="Створити нову станицю"
                  />
                </Card>
              ) : page === 1 && searchedData.length === 0 ?(
                <Card
                  hoverable
                  className="cardStyles addCity"
                  cover={<img src={Add} alt="AddRegionFollower" />}
                  onClick={() => history.push(`/regions/follower/new`)}
                >
                  <Card.Meta
                    className="titleText"
                    title={<div className="createFollowerTitleText">Подати заяву на створення нової станиці</div>}
                  />
                </Card>
              ) : null ) }

              {cities.length === 0 && searchedData.length !== 0 ? (
                <div>
                  <Result status="404" title="Станицю не знайдено" />
                </div>
              ) : (
                  renderCity(cities)
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
export default SortedCities;
