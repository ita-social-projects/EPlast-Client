import React,{ useState, useEffect} from 'react';
import {Button, Space, Spin} from 'antd';
import styles from './PersonalData.module.css';
import userApi from '../../../api/UserApi';
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/Auth';
import moment from 'moment';
import AvatarAndProgress from './AvatarAndProgress';

export default function () {
   type Gender={
    id:number;
    name:string;
}
 type Work={
    id:number;
    placeOfwork: string;
    position: string;
}
 type Education={
    id:number;
    placeOfStudy: string;
    speciality: string;
}
 type Degree={
    id:number;
    name:string;
}
 type Religion={
    id:number;
    name:string;
}
   type Nationality={
    id:number;
    name:string;
}
 type User ={
    id:any;
    userProfileID:any;
    firstName: string;
    lastName: string;
    fatherName:string;
    imagePath:string;
    address: string;
    birthday: Date;
    phoneNumber: string;
    gender: Gender;
    nationality: Nationality;
    religion: Religion;
    education: Education;
    degree: Degree;
    work: Work;
}

  interface Data {
    isUserPlastun:boolean;
    timeToJoinPlast:number;
    user:User;
  }
  interface Datee {
    days:number;
  }
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const fetchData = async () => {
    const token = AuthStore.getToken() as string;
    const user : any = jwt(token);
    await userApi.getById(user.nameid).then(response =>{
      setData(response.data);
      setLoading(true);
    })
  };
      
      useEffect(() => {
        fetchData();
      }, []);
      
      return loading === false ? (
        <div className={styles.spaceWrapper}>
          <Space className={styles.loader} size="large">
            <Spin size="large" />
          </Space>
        </div>
        
      ) : (
      <div className={styles.userFieldsWrapper}>
      <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast}/>
      <div className={styles.rightPartWrapper}>
      <h2 className={styles.title}>Особистий профіль</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.td}>Прізвище:</td>
                <td className={styles.td}>Ім`я:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{data?.user.lastName}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.firstName}</span>
                </td>
              </tr>
              <tr>
              <td className={styles.td}>Стать:</td>
                <td className={styles.td}>Номер телефону:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{data?.user.gender.name}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.phoneNumber}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Національність:</td>
                <td className={styles.td}>Віровизнання:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{data?.user.nationality.name}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.religion.name}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Дата народження:</td>
                <td className={styles.td}>Ступінь:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{moment(data?.user.birthday).format("DD-MM-YYYY")}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.degree.name}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Місце навчання:</td>
                <td className={styles.td}>Спецальність:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{data?.user.education.placeOfStudy}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.education.speciality}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Посада:</td>
                <td className={styles.td}>Місце роботи:</td>
              </tr>
              <tr>
              <td className={styles.td}>
                  <span>{data?.user.work.position}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.work.placeOfwork}</span>
                </td>
              </tr>
            </tbody>
          </table>
           
        </div>
        <Button className={styles.btn}>Обрати/змінити курінь</Button>
      </div>
        
      </div>
      );
}