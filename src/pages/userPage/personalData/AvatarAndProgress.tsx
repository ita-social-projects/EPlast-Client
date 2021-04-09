import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Sticky } from "react-sticky";

import { Avatar, Progress, Skeleton, Tooltip, Typography } from "antd";
import "./PersonalData.less";
import userApi from "../../../api/UserApi";
import kadrasApi from "../../../api/KadraVykhovnykivApi";
import distinctionApi from "../../../api/distinctionApi";
import precautionApi from "../../../api/precautionApi";
import KV1YPU from "../../../assets/images/KV1YPU.png";
import KV1YPN from "../../../assets/images/KV1YPN.png";
import KV2YPN from "../../../assets/images/KV2YPN.png";
import KV2YPU from "../../../assets/images/KV2YPU.png";
import UserDistinction from "../../Distinction/Interfaces/UserDistinction";
import UserPrecaution from "../../Precaution/Interfaces/UserPrecaution";
import User from "../../../models/UserTable/User";
import moment from "moment";

const { Title } = Typography;

class AvatarAndProgressProps {
  imageUrl: string | undefined;
  time: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  isUserPlastun: boolean | undefined;
  pseudo: string | undefined;
  city: string | undefined;
  club: string | undefined;
}

const contentListNoTitle: { [key: string]: any } = {
  5: (
    <div key="5" className="edustaffWrapper">
      <img src={KV1YPN} alt="Picture1" className="edustaffPhoto" />
    </div>
  ),
  6: (
    <div key="6" className="edustaffWrapper">
      <img src={KV1YPU} alt="Picture1" className="edustaffPhoto" />
    </div>
  ),
  7: (
    <div key="7" className="edustaffWrapper">
      <img src={KV2YPN} alt="Picture1" className="edustaffPhoto" />
    </div>
  ),
  8: (
    <div key="8" className="edustaffWrapper">
      <img src={KV2YPU} alt="Picture1" className="edustaffPhoto" />
    </div>
  ),
};

const AvatarAndProgress: React.FC<AvatarAndProgressProps> = (
  props: AvatarAndProgressProps
) => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const {
    time,
    imageUrl,
    firstName,
    lastName,
    isUserPlastun,
    pseudo,
    city,
    club,
  } = props;
  const [imageBase64, setImageBase64] = useState<string>();
  const [UserDistinctions, setData] = useState<UserDistinction[]>([
    {
      id: 0,
      distinction: {
        id: 0,
        name: "",
      },
      distinctionId: 0,
      userId: "",
      reporter: "",
      reason: "",
      number: 0,
      date: new Date(),
      user: new User(),
    },
  ]);
  const [UserPrecaution, setPrecaution] = useState<UserPrecaution[]>([
    {
      id: 0,
      precaution: {
        id: 0,
        name: "",
      },
      precautionId: 0,
      userId: "",
      reporter: "",
      status: "",
      reason: "",
      number: 0,
      date: new Date(),
      endDate: new Date(),
      isActive: true,
      user: new User(),
    },
  ]);

  const [kadras, setkadras] = useState<any[]>([
    {
      id: "",
      user: "",
      kadraVykhovnykivTypeId: "",
      dateOfGranting: "",
      numberInRegister: "",
      basisOfGranting: "",
      link: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      await kadrasApi.getAllKVsOfGivenUser(userId).then((responce) => {
        setkadras(responce.data);
      });

      await distinctionApi
        .getDistinctionOfGivenUser(userId)
        .then((response) => {
          setData(response.data);
        });

      await precautionApi.getPrecautionOfGivenUser(userId).then((response) => {
        setPrecaution(response.data);
      });

      await userApi.getImage(imageUrl).then((response: { data: any }) => {
        setImageBase64(response.data);
      });
      setLoading(true);
    };

    fetchData();
  }, [props]);

  return loading === false ? (
    <Sticky disableCompensation={true} topOffset={-80}>
      {({ style, isSticky }) => (
        <div
          style={
            window.innerWidth > 1321
              ? { ...style, marginTop: isSticky ? "80px" : "0" }
              : undefined
          }
        >
          <Skeleton.Avatar
            size={220}
            active={true}
            shape="circle"
            className="img"
          />
        </div>
      )}
    </Sticky>
  ) : (
    <Sticky disableCompensation={true} topOffset={-80}>
      {({ style, isSticky }) => (
        <div
          style={
            window.innerWidth > 1321 && isSticky
              ? { ...style, marginTop: "80px", paddingBottom: "80px" }
              : undefined
          }
        >
          <Avatar src={imageBase64} className="img" />
          <Title level={2}>
            {firstName} {lastName}
          </Title>
          <Title level={4}>Псевдо: {pseudo}</Title>
          <p className="statusText">Станиця: {city} </p>
          <p className="statusText">Курінь: {club}</p>
          {!isUserPlastun && (
            <div className="progress">
              <p className="statusText">
                {time} дні і {firstName} {lastName} - Дійсний член організації :)
              </p>
              <Progress
                type="circle"
                className="progressBar"
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068",
                }}
                percent={Math.round(
                  100 - ((time === undefined ? 0 : time) * 100) / 365
                )}
              />
            </div>
          )}
          <div className="edustaffAllPhotos">
            {kadras.map(
              (element) => contentListNoTitle[element.kadraVykhovnykivTypeId]
            )}
          </div>

          {UserDistinctions.map((dist) => (
            <div className="distinctions">
              <Tooltip title={dist?.reason}>
                <h2>
                  {dist.distinction.name} №{dist.number}
                </h2>
              </Tooltip>
            </div>
          ))}
          {UserPrecaution.map((dist) =>
            dist.status != "Скасовано" ? (
              <div className="precautions">
                <Tooltip title={dist?.reason}>
                  <h2>
                    {dist.precaution.name} №{dist.number} термін дії до:{" "}
                    {moment(dist.endDate.toLocaleString()).format("DD.MM.YYYY")}
                  </h2>
                </Tooltip>
              </div>
            ) : (
              ""
            )
          )}
        </div>
      )}
    </Sticky>
  );
};

export default AvatarAndProgress;
