import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Card, Input, Layout, Pagination, Skeleton } from "antd";

import Add from "../../assets/images/add.png";
import RegionDefaultLogo from "../../assets/images/default_city_image.jpg";
import { GetAllRegions } from "../../api/regionsApi";

import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";



const Regions = () => {
  const history = useHistory();
  const { url } = useRouteMatch();

  const [regions, setRegions] = useState<any[]>([{
    id:0,
    regionName:'',
    description:'',
    logo:''
  }
  ]);


  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [searchedData, setSearchedData] = useState('');

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
      const response = await GetAllRegions();
      
      setPhotosLoading(true);
      setPhotos(response.data);
      setRegions(response.data);

    }
    finally {
      setLoading(false);
    }
  };





  useEffect(() => {
    getRegions();
  }, [page, pageSize]);
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedData(event.target.value);
  };

  

  return (
    <Layout.Content className="cities">
      <Title level={1}>Округи</Title>
      <div className="searchContainer">
        <Input placeholder="Пошук" onChange={handleSearch} />
      </div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="cityWrapper">
            
              <Card
                hoverable
                className="cardStyles addCity"
                cover={<img src={Add} alt="AddCity" />}
                onClick={() => history.push(`${url}/new`)}
              >
                <Card.Meta
                  className="titleText"
                  title="Створити новий регіон"
                />
              </Card>
            
            {regions.map((region: any) => (
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
            ))}
          </div>
         
        </div>
      )}
    </Layout.Content>
  );
};
export default Regions;
