import React, { useState, useEffect } from 'react';
import { Button, Space, Spin, Form, Input } from 'antd';
import './PersonalData.less';
import userApi from '../../../api/UserApi';
import moment from 'moment';
import AvatarAndProgress from './AvatarAndProgress';
import { Data } from '../Interface/Interface';
import {useParams, useHistory} from 'react-router-dom';
import notificationLogic from '../../../components/Notifications/Notification';
import Spinner from '../../Spinner/Spinner';
import{ tryAgain } from "../../../components/Notifications/Messages"

export default function () {
  const {userId}=useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();

  const fetchData = async () => {
    await userApi.getById(userId).then(response => {
      setLoading(true);
      setData(response.data);
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
     <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName} isUserPlastun={data?.isUserPlastun}/>
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