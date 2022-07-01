import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Form, Input, Skeleton, Tooltip } from "antd";
import moment from "moment";
import { useParams, useHistory, Link } from "react-router-dom";
import { StickyContainer } from "react-sticky";
import Facebook from "../../../assets/images/facebookGreen.svg";

import PlastLogo from "../../../assets/images/logo_PLAST.png"
import AvatarAndProgressStatic from "./AvatarAndProgressStatic";
import { Roles } from "../../../models/Roles/Roles";
import { PersonalDataContext } from "./PersonalData";
import classes from "../Blanks/Blanks.module.css";
import AddAchievementsModal from "../Blanks/UserAchievements/AddAchievementsModal";
import { getAllCourse, getAllCourseByUserId } from "../../../api/courseApi";
import Course from "../../../models/Course/Course";

export default function () {

  const [visibleAchievementModal, setvisibleAchievementModal] = useState(false);

  const [showAchievementModal, setshowAchievementModal] = useState(false);
  const [isDataLoaded, setDataLoaded] = useState<boolean>(false);

  const [allCourses, setallCourses] = useState<Course[]>([]);

  const { userId } = useParams<{ userId: string }>();
  const history = useHistory();
  const {
    userProfile,
    activeUserRoles,
    activeUserId,
    activeUserProfile,
    loading,
  } = useContext(PersonalDataContext);


  const urlaim = `/userpage/blank/${activeUserId}`;
  const getButton = async () => {
    setvisibleAchievementModal(true);
   
  };

  const fetchData = async () => {
   // const response =  await getAllCourse();
    const response1 = await getAllCourseByUserId(activeUserId);

    console.log(response1);

    setallCourses(response1.data);
   
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
      <Form name="basic" className="formContainer">
     

        <div className="allFields">
      {
      allCourses.map((sectitem) =>
        
          <div className="rowBlock">

          
            <h1> {   sectitem.name}  </h1> <br/>
            

            <p> <strong>{userProfile?.user.firstName} </strong>, пройдіть курс для продовження співпраці з нами   </p>


            <div className="rowBlock">
           
              <a
                href={sectitem.link}
              >
                <img src={PlastLogo} alt="PlastLogo" />
              </a>
           
            
          </div>    

          </div>
         ) }
        { !showAchievementModal ? (
            <div className="rowBlock">
                  <Button
                    type="primary"
                    
                    className="buttonaddcertificate"
                    onClick={() => getButton()
                    
                    }
                  >
                    Додати сертифікат
                  </Button>
             </div>
             
          ) :  null }
             <br/><br/><br/>

            {showAchievementModal ? (
             <div className="rowBlock">
           
           <p > Курс пройдено, сертифікат можна переглянути в  <Link to={urlaim} > <b>Досягненнях</b> </Link> :</p><br/>
        


            </div>
           ) : null}

           
             <AddAchievementsModal
            userId={activeUserId}
             visibleModal={visibleAchievementModal}
             setVisibleModal={setvisibleAchievementModal}
             showModal={showAchievementModal}
             setshowModal={setshowAchievementModal}
            />



       
        
        </div>
      </Form>
    </div>
  )  : (
    <> </>
  );
}
