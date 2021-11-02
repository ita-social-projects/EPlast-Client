import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";

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
import { PersonalDataContext } from "./PersonalData";

const { Title } = Typography;
const nameMaxLength = 55;

class AvatarAndProgressStaticProps {
  time: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  isUserPlastun: boolean | undefined;
  pseudo: string | undefined;
  governingBody: string | undefined;
  region: string | undefined;
  city: string | undefined;
  club: string | undefined;
  governingBodyId: number | undefined;
  regionId: number | undefined;
  cityId: number | undefined;
  clubId: number | undefined;
  cityMemberIsApproved: boolean | undefined;
  clubMemberIsApproved: boolean | undefined;
  showPrecautions: boolean | undefined;
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

const AvatarAndProgressStatic: React.FC<AvatarAndProgressStaticProps> = (
  props: AvatarAndProgressStaticProps
) => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const {
    time,
    firstName,
    lastName,
    isUserPlastun,
    pseudo,
    region,
    city,
    club,
    cityId,
    clubId,
    regionId,
    cityMemberIsApproved,
    clubMemberIsApproved,
    showPrecautions
  } = props;

  const { imageBase64, userProfile } = useContext(PersonalDataContext);
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

      if (showPrecautions) {
        await precautionApi.getPrecautionOfGivenUser(userId).then((response) => {
          setPrecaution(response.data);
        });
      }
      setLoading(true);
    };
    fetchData();
  }, [props]);

  return loading === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : (
    <div className="kadraWrapper">
      <Avatar src={imageBase64} className="img" />
      <Title level={2}>
        {firstName} {lastName}
      </Title>
      {pseudo ? (
        <Title level={4}>Псевдо: {pseudo}</Title>
      ) : (
        <Title level={4}>Псевдо не внесено</Title>
      )}
      {cityMemberIsApproved == false ? (
        <div>
          {region ? (
            <p className="statusText">
              Є прихильником округи:{" "}
              <Link
                to={"/regions/" + regionId}
                target="_blank"
                className="LinkText"
              >
                {region}
              </Link>
            </p>
          ) : (
            <p className="statusText">Не є прихильником жодної округи</p>
          )}
          {city ? (
            <p className="statusText">
              Є прихильником станиці:{" "}
              <Link
                to={"/cities/" + cityId}
                target="_blank"
                className="LinkText"
              >
                {city}
              </Link>
            </p>
          ) : (
            <p className="statusText">Не є прихильником жодної станиці</p>
          )}
        </div>
      ) : (
        <div>
          <p className="statusText">
            Округа:{" "}
            <Link
              to={"/regions/" + regionId}
              target="_blank"
              className="LinkText"
            >
              {region}
            </Link>
          </p>
          <p className="statusText">
            Станиця:{" "}
            <Link to={"/cities/" + cityId} target="_blank" className="LinkText">
              {city}
            </Link>
          </p>
        </div>
      )}
      {clubMemberIsApproved == false ? (
        club ? (
          <p className="statusText">
            Є прихильником куреня:{" "}
            <Link to={"/clubs/" + clubId} target="_blank" className="LinkText">
              {club}
            </Link>
          </p>
        ) : (
          <p className="statusText">Не є прихильником жодного куреня</p>
        )
      ) : (
        <p className="statusText">
          Курінь:{" "}
          <Link to={"/clubs/" + clubId} target="_blank" className="LinkText">
            {club}
          </Link>
        </p>
      )}
      {!isUserPlastun && (
        <div className="progress">
          {time !== 0 ? (
            <p className="statusText">
              {time} дні і {firstName} {lastName} - Дійсний член організації :)
            </p>
          ) : (
            <p className="statusText">
              Менше 1 дня і {firstName} {lastName} - Дійсний член організації :)
            </p>
          )}
          <Progress
            type="circle"
            className="progressBar"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            percent={
              Math.round(
                (100 -
                  ((time === undefined ? 0 : time) * 100) / 365 +
                  Number.EPSILON) *
                10
              ) / 10
            }
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
      {showPrecautions && UserPrecaution.map((dist) =>
        dist.status !== "Скасовано" ? (
          <div className="precautions">
            <Tooltip title={dist?.reason}>
              <h2>
                {dist.precaution.name} №{dist.number} термін дії до:{" "}
                {moment.utc(dist.endDate.toLocaleString()).local().format("DD.MM.YYYY")}
              </h2>
            </Tooltip>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
};
export default AvatarAndProgressStatic;
