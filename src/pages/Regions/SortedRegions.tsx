import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import { Card, Input, Layout, Pagination, Result, Skeleton, Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import Add from "../../assets/images/add.png";
import RegionDefaultLogo from "../../assets/images/default_city_image.jpg";
import { getActiveRegionsByPage, getNotActiveRegionsByPage, getRegions } from "../../api/regionsApi";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import Search from "antd/lib/input/Search";
import RegionProfile from '../../models/Region/RegionProfile' 
import { emptyInput } from "../../components/Notifications/Messages";
import { clear } from "console";

interface Props {
    switcher: boolean;
}

const classes = require('./ActionRegion.module.css');

const SortedRegions = ({switcher}: Props) => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [regions, setRegions] = useState<RegionProfile[]>([]);
  const [activeRegions, setActiveRegions] = useState<RegionProfile[]>([]);
  const [notActiveRegions, setNotActiveRegions]= useState<RegionProfile[]>([]);


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [activeCanCreate, setActiveCanCreate] = useState<boolean>(false);

  const setPhotos = async (regions: any[]) => {
    for await (const region of regions) {
      if (region.logo === null) {
        region.logo = RegionDefaultLogo;
      } else {

      }
    }

    setPhotosLoading(false);
  };

  const getActiveRegions = async () => {
    setLoading(true);

    try {
      const response = await getActiveRegionsByPage(page,
        pageSize,
        searchedData.trim()
      );
      setPhotosLoading(true);
      setPhotos(response.data.regions);
      setActiveCanCreate(response.data.canCreate);
      setCanCreate(response.data.canCreate)
      setRegions(response.data.regions);
      setTotal(response.data.total);
    }
    finally {
      setLoading(false);
    }
  };

  const getNotActiveRegions = async () => {
    setLoading(true);
    try {
      const response = await getNotActiveRegionsByPage(page,
        pageSize,
        searchedData.trim()
      );
      setPhotosLoading(true);
      setPhotos(response.data.regions);
      setRegions( response.data.regions);
      setTotal(response.data.total);
    }
    finally {
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

  const renderRegion = (arr: RegionProfile[]) => {
    if (arr) {
        return  arr.map((region: RegionProfile) =>(
          <Link to={`${url}/${region.id}`}>
              <Card
                key={region.id}
                hoverable
                className="cardStyles"
                cover={
                  photosLoading ? (
                  <Skeleton.Avatar shape="square" active />
                  ) : (
                      <img src={region.logo || undefined} alt="RegionDefault" />
                  )
                }
                onClick={() => history.push(`${url}/${region.id}`)}
              >
                  <Card.Meta title={region.regionName} className="titleText" />
              </Card>
        </Link>
          ))   
    }
    return null;
};

  useEffect(() => {
      switcher ? (getNotActiveRegions()) :(getActiveRegions())
  }, [page, pageSize, searchedData]);

  useEffect(()=>{
    setPage(1);
    switcher ? (getNotActiveRegions()) :(getActiveRegions())
    setCanCreate(switcher ? false : activeCanCreate);
  },[switcher])

  return (
    <Layout.Content className="cities">
      {switcher ? (
      <Title level={1}>Не активні округи</Title>) : (
      <Title level={1}>Округи</Title>
      )}

      <div className="searchContainer">
        <Search
          placeholder="Пошук"
          enterButton
          onSearch={handleSearch}
          loading={loading}
          disabled={loading}
          allowClear={true}
        />
      </div>
      
      {loading ? (
        <Spinner />
      ) : (
          <div>
            <div className="cityWrapper">
              {canCreate && page === 1 && searchedData.length === 0 ? (
                < Card
                  hoverable
                  className="cardStyles addCity"
                  cover={<img src={Add} alt="AddCity" />}
                  onClick={() => history.push(`${url}/new`)}
                >
                  <Card.Meta
                  className="titleText"
                  title="Створити нову округу"
                  />
                </Card>
              ) : null}

              {regions.length === 0 ? (
                <div>
                  <Result status="404" title="Округу не знайдено" />
                </div>) : (
                  renderRegion(regions)
                )
              }
            </div>
            <div className="pagination">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                responsive
                showSizeChanger={total < 20 ? false : true}
                onChange={(page) => handleChange(page)}
                onShowSizeChange={(page, size) => handleSizeChange(page, size)}
              />
            </div>
          </div>
        )
      }
    </Layout.Content >

  );
};
export default SortedRegions;
