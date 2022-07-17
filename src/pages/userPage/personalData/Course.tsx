import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Input, Skeleton, Tooltip } from "antd";
import moment from "moment";
import { useParams, useHistory, Link } from "react-router-dom";
import { StickyContainer } from "react-sticky";
import jwt from "jwt-decode";

import PlastLogo from "../../../assets/images/logo_PLAST.png"
import AvatarAndProgressStatic from "./AvatarAndProgressStatic";
import { Roles } from "../../../models/Roles/Roles";
import { PersonalDataContext } from "./PersonalData";
import classes from "../Blanks/Blanks.module.css";
import AddAchievementsModal from "../Blanks/UserAchievements/AddAchievementsModal";
import { getAllCourse, getAllCourseByUserId } from "../../../api/courseApi";
import Course from "../../../models/Course/Course";
import Title from "antd/lib/typography/Title";
import { debug } from "console";
import ListOfAchievementsModal from "../Blanks/UserAchievements/ListOfAchievementsModal";
import BlankDocument from "../../../models/Blank/BlankDocument";
import { getAllAchievementDocumentsByUserId } from "../../../api/blankApi";
import AuthLocalStorage from "../../../AuthLocalStorage";

export default function () {

  const [visibleAchievementModal, setvisibleAchievementModal] = useState(false);
  const [visibleListModal, setvisibleListModal] = useState(false);
  const [showAchievementModal, setshowAchievementModal] = useState(false);
  const [isDataLoaded, setDataLoaded] = useState<boolean>(false);

  const [allCourses, setallCourses] = useState<Course[]>([]);
  const [achievementDoc, setAchievementDoc] = useState<BlankDocument[]>([]);
  const [userToken, setUserToken] = useState<any>([
    {
      nameid: "",
    },
  ]);

  const { userId } = useParams<{ userId: string }>();
  const history = useHistory();
  const {
    userProfile,
    activeUserRoles,
    activeUserId,
    userProfileAccess,
    activeUserProfile,
    loading,
  } = useContext(PersonalDataContext);

  const urlaim = `/userpage/blank/${activeUserId}`;

  const fetchData = async () => {
    const token = AuthLocalStorage.getToken() as string;
    setUserToken(jwt(token));
    const response = await getAllCourseByUserId(activeUserId);
    const response1 = await getAllAchievementDocumentsByUserId(activeUserId);
    setAchievementDoc(response1.data);
    setallCourses(response.data);
    setDataLoaded(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return loading === false ? (
    <div className="kadraWrapper">
      <Skeleton.Avatar
        size={220}
        active={true}
        shape="circle"
        className="img"
      />
    </div>
  ) : isDataLoaded === true ? (
    <div className="container">
      {
        allCourses.map((sectitem) =>
          <Col>
            <Title level={2}>{sectitem.name}</Title>
            <p> <strong>{userProfile?.user.firstName} </strong>, пройдіть курс для продовження співпраці з нами   </p>
            <div className="rowBlock">
              <a
                href={sectitem.link}
              >
                <img src={PlastLogo} alt="PlastLogo" />
              </a>
            </div>
          </Col>
        )}

      {allCourses.length === 0 ? (
        <Col>
          <Title level={2}>Vumonline курс</Title>
          <div className="rowBlock">
            <a
              href="https://vumonline.ua/search/?search=%D0%BF%D0%BB%D0%B0%D1%81%D1%82"
            >
              <img src={PlastLogo} alt="PlastLogo" />
            </a>
          </div>
        </Col>
      ) : null}


      <div className="rowBlock">
        <Button
          type="primary"
          className="buttonaddcertificate"
          onClick={() => setvisibleAchievementModal(true)}
        >
          Додати сертифікат
        </Button>
      </div>
      <br /><br /><br />

      {allCourses.length === 0 ? (
        <Col>

          <p > Курс пройдено, сертифікат можна переглянути в <div className="Link" onClick={() => setvisibleListModal(true)}>
              <b> Досягненнях</b> </div>  </p>
          <br />
        </Col>
      ) : null}

      <ListOfAchievementsModal
        userToken={userToken}
        visibleModal={visibleListModal}
        setVisibleModal={setvisibleListModal}
        achievementDoc={achievementDoc}
        hasAccess={
          userProfileAccess["CanSeeUserDistinction"] ||
          userToken.nameid === userId
        }
        hasAccessToSeeAndDownload={
          userProfileAccess["CanDownloadUserDistinction"] ||
          userToken.nameid === userId
        }
        hasAccessToDelete={
          userProfileAccess["CanDeleteUserDistinction"] ||
          userToken.nameid === userId
        }
        setAchievementDoc={setAchievementDoc}
      />
      <AddAchievementsModal
        userId={activeUserId}
        visibleModal={visibleAchievementModal}
        setVisibleModal={setvisibleAchievementModal}
        showModal={showAchievementModal}
        setshowModal={setshowAchievementModal}
      />

    </div>
  ) : (
    <> </>
  );
}
