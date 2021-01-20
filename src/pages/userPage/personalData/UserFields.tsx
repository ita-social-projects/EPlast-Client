import React, { useState, useEffect } from 'react';
import { Button, Space, Spin, Form, Input } from 'antd';
import './PersonalData.less';
import userApi from '../../../api/UserApi';
import moment from 'moment';
import AvatarAndProgress from './AvatarAndProgress';
import { Data } from '../Interface/Interface';
import { useParams, useHistory } from 'react-router-dom';
import notificationLogic from '../../../components/Notifications/Notification';
import Spinner from '../../Spinner/Spinner';
import { tryAgain } from "../../../components/Notifications/Messages";
import PsevdonimCreator from "../../../components/HistoryNavi/historyPseudo";
import Facebook from "../../../assets/images/facebookGreen.svg";
import Twitter from "../../../assets/images/birdGreen.svg";
import Instagram from "../../../assets/images/instagramGreen.svg";

export default function () {
  const { userId } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const fetchData = async () => {
    await userApi.getById(userId).then(response => {
      setLoading(true);
      setData(response.data);
      PsevdonimCreator.setPseudonimLocation(`${response.data?.user.firstName}${response.data?.user.lastName}`, userId);
    }).catch(() => { notificationLogic('error', tryAgain) })
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  return loading === false ? (
    <Spinner />
  ) : (
<div className="container">
    <Form name="basic" className="formContainer">
   <div className="avatarWrapper">
     <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName} isUserPlastun={data?.isUserPlastun} pseudo={data?.user.pseudo} city={data?.user.city} club={data?.user.club}/>
   </div>
   <div className="allFields">
     <div className="rowBlock">
       <Form.Item
         label="Ім`я"
         className="formItem"
       >
         {data?.user.firstName!==null && data?.user.firstName!==""? 
                (<Input readOnly className="dataInput" value={data?.user.firstName}/>):
                <Input readOnly className="dataInput" value="-"/>
              }

       </Form.Item>
       <Form.Item
         label="Прізвище"
         className="formItem"
       >
         {(data?.user.lastName!==null && data?.user.lastName!=="")? 
                (<Input readOnly className="dataInput" value={data?.user.lastName} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
     </div>
     <div className="rowBlock">
       <Form.Item
         label="По-батькові"
         className="formItem"
       >
         {data?.user.fatherName!==null && data?.user.fatherName!==""? 
                (<Input readOnly className="dataInput" value={data?.user.fatherName} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
       <Form.Item 
         label="Стать" 
         className="formItem"
         >
         {data?.user.gender.name!==null && data?.user.gender.name!==""? 
                (<Input readOnly className="dataInput" value={data?.user.gender.name} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
     </div>

     <div className="rowBlock">
       <Form.Item
         label="Псевдо"
         className="formItem"
       >
         {data?.user.pseudo!==null && data?.user.pseudo!==""? 
                (<Input readOnly className="dataInput" value={data?.user.pseudo} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
       <Form.Item 
         label="Пошта" 
         className="formItem"
         >
         {data?.user.email!==null && data?.user.email!==""? 
                (<Input readOnly className="dataInput" value={data?.user.email} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
     </div>
    
     <div  className="rowBlock">
       <Form.Item
         label="Дата народження"
         className="formItem"
       >
         {data?.user.birthday!==null && data?.user.birthday.toString()!=="0001-01-01T00:00:00"? 
                (<Input readOnly className="dataInput" value={moment(data?.user.birthday).format("DD.MM.YYYY")} />):
                <Input readOnly className="dataInput" value="-"/>
              }
        
       </Form.Item>
       <Form.Item
         label="Номер телефону"
         className="formItem"
       >
         {data?.user.phoneNumber!==null && data?.user.phoneNumber!==""? 
                (<Input readOnly className="dataInput" value={data?.user.phoneNumber} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
      
     </div>
     <div className="rowBlock">
       <Form.Item
         label="Національність"
         className="formItem"
       >
         {data?.user.nationality.name!==null && data?.user.nationality.name!==""? 
                (<Input readOnly className="dataInput" value={data?.user.nationality.name} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
       <Form.Item
         label="Віровизнання"
         className="formItem"
       >
         {data?.user.religion.name!==null && data?.user.religion.name!==""? 
                (<Input readOnly className="dataInput" value={data?.user.religion.name} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
      
     </div>
     
     <div className="rowBlock">
       <Form.Item
         label="Навчальний заклад"
         className="formItem"
       >
          {data?.user.education.placeOfStudy!==null && data?.user.education.placeOfStudy!==""? 
                (<Input readOnly className="dataInput" value={data?.user.education.placeOfStudy} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
       <Form.Item
         label="Спеціальність"
         className="formItem"
       >
         {data?.user.education.speciality!==null && data?.user.education.speciality!==""? 
                (<Input readOnly className="dataInput" value={data?.user.education.speciality} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
     </div>
     <div className="rowBlock">
       <Form.Item
         label="Навчальний ступінь"
         className="formItem"
       >
          {data?.user.degree.name!==null && data?.user.degree.name!==""? 
                (<Input readOnly className="dataInput" value={data?.user.degree.name} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
       <Form.Item
         label="Місце праці"
         className="formItem"
       >
         {data?.user.work.placeOfwork!==null && data?.user.work.placeOfwork!==""? 
                (<Input readOnly className="dataInput" value={data?.user.work.placeOfwork} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
     </div>
     <div className="rowBlock">
       <Form.Item
         label="Посада"
         className="formItem"
       >
         {data?.user.work.position!==null && data?.user.work.position!==""? 
                (<Input readOnly className="dataInput" value={data?.user.work.position} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
       <Form.Item
         label="Адреса проживання"
         className="formItem"
       >
         {data?.user.address!==null && data?.user.address!==""? 
                (<Input readOnly className="dataInput" value={data?.user.address} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
     </div>

     <div className="rowBlock">
       <Form.Item
         label="Громадська, політична діяльність"
         className="formItem"
       >
         {data?.user.publicPoliticalActivity!==null && data?.user.publicPoliticalActivity!==""? 
                (<Input readOnly className="dataInput" value={data?.user.publicPoliticalActivity} />):
                <Input readOnly className="dataInput" value="-"/>
              }
       </Form.Item>
       <Form.Item 
          label="Ступінь в УПЮ"
          className="formItem"
        >
          { data?.user.upuDegree.id===1?
              data?.user.gender.id===2?
              (<Input readOnly className="dataInput" value="не була в юнацтві" />):
              (<Input readOnly className="dataInput" value="не був в юнацтві" />):
            data?.user.upuDegree.id===2?
              data?.user.gender.id===2?
              (<Input readOnly className="dataInput" value="пластунка учасниця" />):
              (<Input readOnly className="dataInput" value="пластун учасник" />):
             data?.user.upuDegree.id===3?
              data?.user.gender.id===2?
              (<Input readOnly className="dataInput" value="пластунка розвідувачка" />):
              (<Input readOnly className="dataInput" value="пластун розвідувач" />):                 
             data?.user.upuDegree.id===4?
              data?.user.gender.id===2?
              (<Input readOnly className="dataInput" value="пластунка вірлиця" />):
              (<Input readOnly className="dataInput" value="пластун скоб" />):
            (<Input readOnly className="dataInput" value="-"/>)
          }
        </Form.Item>
     </div>

     <div className="links">
      {data?.user.facebookLink!==null && data?.user.facebookLink!==""?
        <a href={data?.user.facebookLink}>
          <img src={Facebook} alt="Facebook" />
        </a>
        : null
      }
      {data?.user.twitterLink!==null && data?.user.twitterLink!==""?
        <a href={data?.user.twitterLink}>
          <img src={Twitter} alt="Twitter" />
        </a>
        : null
      }
      {data?.user.instagramLink!==null && data?.user.instagramLink!==""?
        <a href={data?.user.instagramLink}>
          <img src={Instagram} alt="Instagram" />
        </a>
        : null
      }
     </div>
     
     <Button 
       className="confirmBtn"
       onClick={() =>
         history.push(`/clubs`)
       }
     >
       Обрати/змінити курінь
     </Button>
     <Button 
       className="confirmBtn"
       onClick={() =>
         history.push(`/cities`)
       }
     >
       Обрати/змінити станицю
     </Button>
   </div>
   
 </Form>

</div>
    );
}