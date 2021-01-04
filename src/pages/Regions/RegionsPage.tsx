import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import { Card, Input, Layout, Pagination, Result, Skeleton, Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import Add from "../../assets/images/add.png";
import RegionDefaultLogo from "../../assets/images/default_city_image.jpg";
import { GetAllRegions, getRegionsByPage } from "../../api/regionsApi";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import Search from "antd/lib/input/Search";


const Regions = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [regions, setRegions] = useState<any[]>([{
    id: 0,
    regionName: '',
    description: '',
    logo: ''
  }
  ]);


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState("");
  const [canCreate, setCanCreate] = useState<boolean>(false);

  const setPhotos = async (regions: any[]) => {
    for await (const region of regions) {
      if (region.logo === null) {
        region.logo = RegionDefaultLogo;
      } else {

      }
    }

    setPhotosLoading(false);
  };

  const getRegions = async () => {
    setLoading(true);

    try {
      const response = await getRegionsByPage(page,
        pageSize,
        searchedData.trim()
      );

      setPhotosLoading(true);
      setPhotos(response.data.regions);
      setCanCreate(response.data.canCreate);
      setRegions(response.data.regions);
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

  useEffect(() => {
    getRegions();
  }, [page, pageSize, searchedData]);


  return (
    <Layout.Content className="cities">
      <Title level={1}>Округи</Title>
      <div className="searchContainer">
        <Search
          placeholder="Пошук"
          enterButton
          onSearch={handleSearch}
          loading={loading}
          disabled={loading}
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
                    title="Створити новий округ"
                  />
                </Card>
              ) : null}

              {regions.length === 0 && searchedData.length !== 0 ? (
                <div>
                  <Result status="404" title="Округ не знайдено" />
                </div>) : (
                  regions.map((region: any) => (
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
export default Regions;
