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
import classes from "../Blanks/Blanks.module.css";
export default function () {

  const [visibleAchievementModal, setvisibleAchievementModal] = useState(false);
  const [visibleListModal, setvisibleListModal] = useState(false);
  const [showAchievementModal, setshowAchievementModal] = useState(false);
  const [isDataLoaded, setDataLoaded] = useState<boolean>(false);
  
  const [courseId, setcourseId] = useState<number>(0);


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
        <div className={classes.wrapper2}>
          
          {
           
            allCourses.map((sectitem) =>
        
            (sectitem.isFinishedByUser === false) ?
            (
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
            ) :
            (
              <Col style={{ marginTop: "64px" }}>
                    <Title level={2}> {sectitem.name}</Title>
                <p>
                  Курс {sectitem.name} пройдено, сертифікат можна переглянути в <Button type="link" className="Link" onClick={() => setvisibleListModal(true)}>
                    <b> Досягненнях</b>
                  </Button>
                </p>
              </Col>
            )
            )
          }

          {/* WARN: this is a hardcoded block, which will be shown only if there are no courses stored in DB */}
         
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
