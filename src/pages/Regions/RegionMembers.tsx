import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Skeleton, } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import { getRegionById } from "../../api/regionsApi";
import {getLogo} from "./../../api/citiesApi"
import "./Region.less";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../Spinner/Spinner";
import CityDefaultLogo from "../../assets/images/default_city_image.jpg"
import extendedTitleTooltip, {parameterMaxLength} from "../../components/Tooltip";
moment.locale("uk-ua");

const RegionMembers = () => {
  const {id} = useParams();
  const history = useHistory();

  const [members, setMembers] = useState<any[]>([{
    id: '',
    name: '',
    logo: ''
  },]);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const getMembers = async () => {
    setLoading(true);
    const response = await getRegionById(id);

    setPhotosLoading(true);
    setMembers(response.data.cities);
    setPhotos(response.data.cities);
    setLoading(false);
  };

  const setPhotos = async (member: any[]) => {

    for(let i=0; i<member.length;++i){
        members[i] = member[i]; 
        
    }
    for(let i=0; i<member.length;++i){
        if(member[i].logo!==null){
        members[i].logo=(await getLogo(member[i].logo)).data;
        }
        else{
            members[i].logo=CityDefaultLogo
        }
    }

    setPhotosLoading(false);
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>
        Члени округи
      </Title>
      {loading ? (
          <Spinner />
        ) : (
      <div className="cityMoreItems">
        {members.length > 0 ? (
          members.map((member: any) => (
            <Card
              key={member.id}
              className="detailsCard"
            >
              <div
                onClick={() => history.push(`/cities/${member.id}`)}
                className="cityMember"
              >
                {photosLoading ? (
                  <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                ) : (
                  <Avatar
                    size={86}
                    src={member.logo}
                    className="detailsIcon"
                  />
                )}
                <Card.Meta
                  className="detailsMeta"
                  title={
                    extendedTitleTooltip(parameterMaxLength, `${member.name}`)
                  }
                />
              </div>
            </Card>
          ))
        ) : (
          <Title level={4}>
            Ще немає членів округи
          </Title>
        )}
      </div>)}
      <div className="cityMoreItems">
        <Button
          className="backButton"
          icon={<RollbackOutlined />}
          size={"large"}
          onClick={() => history.goBack()}
          type="primary"
        >
          Назад
        </Button>
      </div>
      
    </Layout.Content>
  );
};

export default RegionMembers;
