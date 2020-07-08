import React,{ useState, useEffect} from 'react';
import {Button, Space, Spin} from 'antd';
// import { DatePickerProps } from 'antd/lib/date-picker';
import styles from './PersonalData.module.css';
import userApi from '../../../api/UserApi';
import AvatarAndProgress from './AvatarAndProgress';

export default function () {
  interface User {
    email:string;
    firstName: string;
    lastName: string;
    id: string;
    fatherName?:string;
    imagePath:string;
    address: string;
    birthday: Date;
    degreeName: string;
    genderName: string;
    nationalityName: string;
    phoneNumber: string;
    placeOfStudy: string;
    placeOfWork: string;
    positionOfWork: string;
    religionName: string;
    speciality: string;
  }
  interface Data {
    isUserPlastun:boolean;
    timeToJoinPlast:Datee;
    user:User;
  }
  interface Datee {
    days:number;
  }
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const fetchData = async () => {
    await userApi.getById('ed26f626-5d97-4ca7-9890-fe4caa7d9446').then(response =>{
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
      
        {console.log(data)}
        <h2 className={styles.title}>Особистий профіль</h2>
        <div className={styles.tableWrapper}>
        <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast.days}/>
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
                <td className={styles.td}>Email:</td>
                <td className={styles.td}>Номер телефону:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{data?.user.email}</span>
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
                  <span>{data?.user.nationalityName}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.religionName}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Дата народження:</td>
                <td className={styles.td}>Стать:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{data?.user.birthday}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.genderName}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Місце навчання:</td>
                <td className={styles.td}>Спецальність:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{data?.user.placeOfStudy}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.speciality}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Ступінь:</td>
                <td className={styles.td}>Місце роботи:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  <span>{data?.user.degreeName}</span>
                </td>
                <td className={styles.td}>
                  <span>{data?.user.placeOfWork}</span>
                </td>
              </tr>
            </tbody>
          </table>
           
        </div>
        <Button className={styles.btn}>Обрати/змінити курінь</Button>
      </div>
      );
}
