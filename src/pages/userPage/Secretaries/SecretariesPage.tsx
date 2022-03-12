import React, { useContext, useEffect, useState } from "react";
import userApi from "../../../api/UserApi";
import { useParams } from "react-router-dom";
import { Data } from "../Interface/Interface";
import notificationLogic from "../../../components/Notifications/Notification";
import { Card, Form, Skeleton } from "antd";
import "./Secretaries.less";
import { UserCitySecretaryTable } from "./UserCitySecretaryTable";
import { UserRegionSecretaryTable } from "./UserRegionSecretaryTable";
import { UserClubSecretaryTable } from "./UserClubSecretaryTable";
import { UserGoverningBodySecretaryTable } from "./UserGoverningBodySecretaryTable";
import { UserSectorSecretaryTable } from "./UserSectorSecretaryTable";
import { tryAgain } from "../../../components/Notifications/Messages";
import { StickyContainer } from "react-sticky";
import { PersonalDataContext } from "../personalData/PersonalData";
import AvatarAndProgressStatic from "../personalData/AvatarAndProgressStatic";
import { updateLocale } from "moment";

const tabList = [
  {
    key: "1",
    tab: "Діловодства краю",
  },
  {
    key: "2",
    tab: "Діловодства округи",
  },
  {
    key: "3",
    tab: "Діловодства станиці",
  },
  {
    key: "4",
    tab: "Діловодства куреня",
  },
  {
    key: "5",
    tab: "Діловодства напряму",
  },
];

export const Secretaries = () => {
  const { userId } = useParams();
  const [noTitleKey, setKey] = useState<string>("1");
  const [LoadInfo, setLoadInfo] = useState<boolean>(false);

  const { userProfile, fullUserProfile, UpdateData } = useContext(
    PersonalDataContext
  );

  const onTabChange = (key: string) => {
    setKey(key);
  };

  const contentListNoTitle: { [key: string]: any } = {
    1: (
      <div key="1">
        <UserGoverningBodySecretaryTable UserId={userId} />
      </div>
    ),
    2: (
      <div key="2">
        <UserRegionSecretaryTable UserId={userId} />
      </div>
    ),
    3: (
      <div key="3">
        <UserCitySecretaryTable UserId={userId} />
      </div>
    ),
    4: (
      <div key="4">
        <UserClubSecretaryTable UserId={userId} />
      </div>
    ),
    5: (
      <div key="5">
        <UserSectorSecretaryTable UserId={userId} />
      </div>
    ),
  };

  useEffect(() => {
    setLoadInfo(true);
  }, []);

  return LoadInfo === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : (
    <div className="container">
      <Form name="basic" className="formContainer">
        <div className="avatarWrapperSecretaries">
          <StickyContainer className="kadraWrapper">
            <AvatarAndProgressStatic
              time={fullUserProfile?.timeToJoinPlast}
              firstName={fullUserProfile?.user.firstName}
              lastName={fullUserProfile?.user.lastName}
              isUserPlastun={fullUserProfile?.isUserPlastun}
              pseudo={fullUserProfile?.user.pseudo}
              governingBody={fullUserProfile?.user.governingBody}
              region={fullUserProfile?.user.region}
              city={fullUserProfile?.user.city}
              club={fullUserProfile?.user.club}
              governingBodyId={fullUserProfile?.user.governingBodyId}
              cityId={fullUserProfile?.user.cityId}
              clubId={fullUserProfile?.user.clubId}
              regionId={fullUserProfile?.user.regionId}
              cityMemberIsApproved={fullUserProfile?.user.cityMemberIsApproved}
              clubMemberIsApproved={fullUserProfile?.user.clubMemberIsApproved}
              showPrecautions={userProfile?.shortUser === null}
            />
          </StickyContainer>
        </div>

        <div className="allFieldsSecretaries">
          <div className="rowBlockSecretaries">
            <Card
              style={{ width: "100%" }}
              tabList={tabList}
              activeTabKey={noTitleKey}
              onTabChange={(key) => {
                onTabChange(key);
              }}
            >
              {contentListNoTitle[noTitleKey]}
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};
export default Secretaries;
