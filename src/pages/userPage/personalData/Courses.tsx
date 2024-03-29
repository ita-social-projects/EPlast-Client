import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Modal, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import jwt from "jwt-decode";
import Title from "antd/lib/typography/Title";
import AuthLocalStorage from "../../../AuthLocalStorage";
import { PersonalDataContext } from "./PersonalData"; // TODO: Fix cyclic import 
import Course from "../../../models/Course/Course";
import PlastLogo from "../../../assets/images/logo_PLAST.png"
import AddAchievementsModal from "../Blanks/UserAchievements/AddAchievementsModal";
import ListOfAchievementsModal from "../Blanks/UserAchievements/ListOfAchievementsModal";
import { getAllCourseByUserId } from "../../../api/courseApi";
import classes from "../Blanks/Blanks.module.css";

export const Courses: React.FC = () => {
  const [userToken, setUserToken] = useState<{nameid: string}>({nameid: ''});
  const [visible, setVisible] = useState(false);
  const [visibleAchievementModal, setVisibleAchievementModal] = useState(false);
  const [visibleListModal, setVisibleListModal] = useState(false);
  const [isDataLoaded, setDataLoaded] = useState(false);
  const [courseId, setCourseId] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);

  const { userId } = useParams<{ userId: string }>();
  const {
    userProfile,
    activeUserId,
    userProfileAccess,
    loading,
  } = useContext(PersonalDataContext);

  const fetchData = async () => {
    setUserToken(jwt(AuthLocalStorage.getToken() ?? ""));
    const courses = await getAllCourseByUserId(userProfile?.user.id);
    setCourses(courses.data);
    setDataLoaded(true);
  };

  const addCertificate = async (courseId: number) => {
    setCourseId(courseId);
    setVisibleAchievementModal(true);
  };

  const handleClose = async () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!isDataLoaded) fetchData();
    if (!visibleListModal || !visibleAchievementModal) fetchData();
  }, [visibleListModal, visibleAchievementModal]);

  return (
    !loading ? (
      <div className="kadraWrapper">
        <Skeleton.Avatar
          size={220}
          active
        shape="circle"
        className="img"
        />
      </div>
    )
    : isDataLoaded ? (
      <div className={[classes.wrapper6, classes.courseInfoBlock].join(' ')}>
        {
          courses.map(sectItem =>
            (sectItem.isFinishedByUser === false && 
            (userProfile?.user.id === activeUserId)) ? (
              <Col key={sectItem.id}>
                <Title level={2}>{sectItem.name}</Title>
                <p>
                  <strong>{userProfile?.user.firstName}</strong>, пройдіть курс для продовження співпраці з нами
                </p>
                <div className="courseParticipationBlock">
                  <a href={sectItem.link} >
                    <img src={PlastLogo} alt="PlastLogo" />
                  </a>
                  <Button
                    type="primary"
                    className="buttonAddCertificate"
                    onClick={() => addCertificate(sectItem.id)}
                  >
                    Додати сертифікат
                  </Button>
                </div>
              </Col>
            ) : (
              <Col>
                <Title level={2}>{sectItem.name}</Title>
                {
                  (sectItem.isFinishedByUser) ? (
                    <p>
                      Курс пройдено, сертифікат можна переглянути в
                      <Button style={{padding: "0 0 0 4px"}}
                        type="link" 
                        onClick={() => {
                          setVisibleListModal(true);
                          setCourseId(sectItem.id)
                        }}
                      >
                        <b>Досягненнях</b>
                      </Button>
                    </p>
                  ) : (
                    <p>Курс не пройдено</p>
                  )
                }
              </Col>
            )
          )
        }

        {/* WARN: this is a hardcoded block, which will be shown only if there are no courses stored in DB */}
        
        {/* END WARN */}
    
        {/* <div className="rowBlock">
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
          courseId={courseId}
          userToken={userToken}
          visibleModal={visibleListModal}
          setVisibleModal={setVisibleListModal}
          hasAccessToSee={
            userProfileAccess["CanSeeUserDistinction"]
            || userToken.nameid === userId
          }
          hasAccessToDownload={
            userProfileAccess["CanDownloadUserDistinction"]
            || userToken.nameid === userId
          }
          hasAccessToDelete={
            userProfileAccess["CanDeleteUserDistinction"]
            || userToken.nameid === userId
          }
        />

        <AddAchievementsModal
          userId={activeUserId}
          courseId={courseId}
          visibleModal={visibleAchievementModal}
          setVisibleModal={setVisibleAchievementModal}
        />
      </div>
    ) : null
  );
}
