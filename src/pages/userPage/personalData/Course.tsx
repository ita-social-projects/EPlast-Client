import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Modal, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import jwt from "jwt-decode";
import Title from "antd/lib/typography/Title";
import PlastLogo from "../../../assets/images/logo_PLAST.png"
import { PersonalDataContext } from "./PersonalData"; // TODO: Fix cyclic import 
import AddAchievementsModal from "../Blanks/UserAchievements/AddAchievementsModal";
import { getAllCourseByUserId } from "../../../api/courseApi";
import Course from "../../../models/Course/Course";
import ListOfAchievementsModal from "../Blanks/UserAchievements/ListOfAchievementsModal";
import BlankDocument from "../../../models/Blank/BlankDocument";
import { getAllAchievementDocumentsByUserId } from "../../../api/blankApi";
import AuthLocalStorage from "../../../AuthLocalStorage";

export default function () {

  const [visibleAchievementModal, setvisibleAchievementModal] = useState(false);
  const [visibleListModal, setvisibleListModal] = useState(false);
  const [showAchievementModal, setshowAchievementModal] = useState(false);
  const [isDataLoaded, setDataLoaded] = useState<boolean>(false);
  
  const [courseId, setcourseId] = useState<number>();
  const [allCourses, setallCourses] = useState<Course[]>([]);
  const [achievementDoc, setAchievementDoc] = useState<BlankDocument[]>([]);

  const [visible, setVisible] = useState<boolean>(false);
  let userToken: { nameid: string } = { nameid: "" };

  const { userId } = useParams<{ userId: string }>();
  const {
    userProfile,
    activeUserId,
    userProfileAccess,
    loading,
  } = useContext(PersonalDataContext);

  const fetchData = async () => {
    userToken = jwt(AuthLocalStorage.getToken() ?? "");
    const coursesPromise = getAllCourseByUserId(activeUserId);
    const achievementsPromise = getAllAchievementDocumentsByUserId(activeUserId);
    setAchievementDoc((await achievementsPromise).data);
    setallCourses((await coursesPromise).data);
    setDataLoaded(true);
  };
  const addCertificate = async (courseid : number) => {
    setcourseId(courseid);
    setvisibleAchievementModal(true);

  };
  const handleClose = async () => {
    setVisible(false);
  };
  useEffect(() => {
    if (!isDataLoaded) fetchData();
  }, []);

  return (!loading
    ? (
      <div className="kadraWrapper">
        <Skeleton.Avatar
          size={220}
          active
        shape="circle"
        className="img"
        />
      </div>
    )
    : isDataLoaded
      ? (
        <div className="container">
          {
            allCourses.map((sectitem) =>
              <Col key={sectitem.id}>
                <Title level={2} title={sectitem.name} />
                <p>
                  <strong>{userProfile?.user.firstName}</strong>, пройдіть курс для продовження співпраці з нами
                </p>
                <div className="rowBlock">
                  <a href={sectitem.link} >
                    <img src={PlastLogo} alt="PlastLogo" />
                  </a>
                </div>
             
            <Button
              type="primary"
              className="buttonaddcertificate"
              onClick={() => addCertificate(sectitem.id)}
            >
              Додати сертифікат
            </Button>
              </Col>
            )}

          {/* WARN: this is a hardcoded block, which will be shown only if there are no courses stored in DB */}
          {!allCourses.length
            ? (
              <Col>
                <Title level={2}>VumOnline курс</Title>
                <div className="rowBlock">
                  <a href="https://vumonline.ua/search/?search=%D0%BF%D0%BB%D0%B0%D1%81%D1%82" >
                    <img src={PlastLogo} alt="PlastLogo" />
                  </a>
                </div>
              </Col>
            )
            : null
          }
          {/* END WARN */}

        {/*          
          <div className="rowBlock">
            <Button
              type="primary"
              className="buttonaddcertificate"
              onClick={() => setVisible(true)}
            >
              Додати курс
            </Button>
          </div> */}

          {!allCourses.length
            ? (
              <Col style={{ marginTop: "64px" }}>
                <p>
                  Курс пройдено, сертифікат можна переглянути в <Button type="link" className="Link" onClick={() => setvisibleListModal(true)}>
                    <b> Досягненнях</b>
                  </Button>
                </p>
              </Col>
            )
            : null
          }
      <Modal
        title="Додати Курс"
        visible={visible}
        onCancel={handleClose}
        footer={null}
      >
        лінк назва
      </Modal>
      
          <ListOfAchievementsModal
            userToken={userToken}
            visibleModal={visibleListModal}
            setVisibleModal={setvisibleListModal}
            achievementDoc={achievementDoc}
            hasAccess={
              userProfileAccess.CanSeeUserDistinction
              || userToken.nameid === userId
            }
            hasAccessToSeeAndDownload={
              userProfileAccess.CanDownloadUserDistinction
              || userToken.nameid === userId
            }
            hasAccessToDelete={
              userProfileAccess.CanDeleteUserDistinction
              || userToken.nameid === userId
            }
            setAchievementDoc={setAchievementDoc}
          />

          <AddAchievementsModal
            userId={activeUserId}
            courseId={courseId}
            visibleModal={visibleAchievementModal}
            setVisibleModal={setvisibleAchievementModal}
            showModal={showAchievementModal}
            setshowModal={setshowAchievementModal}
          />
        </div>
      )
      : null
  );
}
