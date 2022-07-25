import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch, Link, useParams } from "react-router-dom";
import { Card, Layout, Pagination, Result, Skeleton } from "antd";
import Add from "../../assets/images/add.png";
import RegionDefaultLogo from "../../assets/images/default_city_image.jpg";
import {
  getActiveRegionsByPage,
  getNotActiveRegionsByPage,
} from "../../api/regionsApi";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import Search from "antd/lib/input/Search";
import RegionProfile from "../../models/Region/RegionProfile";
import Props from "../Interfaces/SwitcherProps";

const classes = require("./ActionRegion.module.css");

const SortedRegions = ({ switcher }: Props) => {
  const path: string = "/regions";
  const history = useHistory();
  const [regions, setRegions] = useState<RegionProfile[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [activeCanCreate, setActiveCanCreate] = useState<boolean>(false);
  const { p = 1 } = useParams();
  const [page, setPage] = useState(+p);

  const setPhotos = async (regions: any[]) => {
    for await (const region of regions) {
      if (region.logo === null) {
        region.logo = RegionDefaultLogo;
      }
    }

    setPhotosLoading(false);
  };

  const getActiveRegions = async (page: number) => {
    setLoading(true);

    try {
      const response = await getActiveRegionsByPage(
        page,
        pageSize,
        searchedData.trim()
      );
      setPhotosLoading(true);
      setPhotos(response.data.regions);
      setActiveCanCreate(response.data.canCreate);
      setCanCreate(response.data.canCreate);
      setRegions(response.data.regions);
      setTotal(response.data.total);
    } finally {
      setLoading(false);
    }
  };

  const getNotActiveRegions = async (page: number) => {
    setLoading(true);
    try {
      const response = await getNotActiveRegionsByPage(
        page,
        pageSize,
        searchedData.trim()
      );
      setPhotosLoading(true);
      setPhotos(response.data.regions);
      setRegions(response.data.regions);
      setTotal(response.data.total);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (page: number) => {
    history.push(`${path}/page/${page}`);
    setPage(page);
  };

  const handleSizeChange = (pSize: number = 10) => {
    setPageSize(pSize);
  };

  const handleSearch = (event: any) => {
    handleChange(1);
    setSearchedData(event);
  };

  const renderRegion = (arr: RegionProfile[]) => {
    if (arr) {
      return arr.map((region: RegionProfile) => (
        <Link to={`${path}/${region.id}`}>
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
          >
            <Card.Meta title={region.regionName} className="titleText" />
          </Card>
        </Link>
      ));
    }
    return null;
  };
  useEffect(() => {
    if (switcher) {
      getNotActiveRegions(page);
    } else {
      getActiveRegions(page);
    }
    setCanCreate(switcher ? false : activeCanCreate);
  }, [page, pageSize, searchedData, switcher]);

  return (
    <Layout.Content className="cities">
      {switcher ? (
        <Title level={1}>Не активні округи</Title>
      ) : (
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
            {switcher ? null : canCreate &&
              page === 1 &&
              searchedData.length === 0 ? (
              <Card
                hoverable
                className="cardStyles addCity"
                cover={<img src={Add} alt="AddCity" />}
                onClick={() => history.push(`${path}/new`)}
              >
                <Card.Meta className="titleText" title="Створити нову округу" />
              </Card>
            ) : null}

            {regions.length === 0 ? (
              <div>
                <Result status="404" title="Округу не знайдено" />
              </div>
            ) : (
              renderRegion(regions)
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
export default SortedRegions;
