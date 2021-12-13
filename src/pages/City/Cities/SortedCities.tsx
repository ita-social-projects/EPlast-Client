import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
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
import Props from "../../Interfaces/SwitcherProps";

const SortedCities = ( {switcher}: Props) => {
  const path: string  = "/cities";
  const history = useHistory();
  const [cities, setCities] = useState<CityProfile[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const {p} = useParams();
  const [page, setPage] = useState(Number(p));

  const setPhotos = async (cities: CityProfile[]) => {
    try {
      for await (const city of cities) {
        if (city.logo === null) {
          city.logo = CityDefaultLogo;
        } 
      }
    } finally {
      setPhotosLoading(false);
    }
    
  };
  const getActiveCities = async (page: number = 1) => {
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
      setTotal(response.data.total);
    } finally {
      setLoading(false);
    }
  };

  const getNotActiveCities = async (page: number = 1) => {
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
    history.push(`${path}/page/${page}`);
    setPage(page);
  };

  const handleSizeChange = (page: number, pageSize: number = 10) => {
    setPageSize(pageSize);
  };

  const handleSearch = (event: any) => {
    setSearchedData(event);
  };

  const renderCity = (arr: CityProfile[]) => {
    if (arr) {
        // eslint-disable-next-line react/no-array-index-key
        return  arr.map((city: CityProfile) =>(
          <Link to={`${path}/${city.id}`}>
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
              >
                  <Card.Meta title={city.name} className="titleText" />
              </Card>
        </Link>
          ))   
    }
    return null;
};

  useEffect(() => {
    switcher ? (getNotActiveCities(page)):(getActiveCities(page)) 
  }, [page, pageSize, searchedData]);

  useEffect(()=> {
    if (cities.length !== 0) {
      switcher ? (getNotActiveCities()) :(getActiveCities())
    }
    
  },[switcher])

  return (
    <Layout.Content className="cities">
      {switcher ? (
      <Title level={1}>Неактивні станиці</Title>) : (
      <Title level={1}>Станиці</Title>
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

              {cities.length === 0 ? (
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
                showSizeChanger={total >= 20}
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
