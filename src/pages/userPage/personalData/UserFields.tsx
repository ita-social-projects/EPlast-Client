import React,{ useState, useEffect} from 'react';
import {Button, Space, Spin} from 'antd';
import styles from './PersonalData.module.css';
import userApi from '../../../api/UserApi';
import jwt from 'jwt-decode';
import AuthStore from '../../../stores/Auth';
import moment from 'moment';
import AvatarAndProgress from './AvatarAndProgress';
import { useHistory } from 'react-router-dom';
import { Data } from '../Interface/Interface';
import {useParams} from 'react-router-dom';
export default function () {
  const history = useHistory();
  const {userId}=useParams(); 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const fetchData = async () => {
  const token = AuthStore.getToken() as string;
    await userApi.getById(userId).then(response =>{
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
      <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName}/>
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
                  {(data?.user.lastName!==null && data?.user.lastName!=="")? 
                    (<span>{data?.user.lastName}</span>):
                      (<span>-</span>)
                  }
                </td>
                <td className={styles.td}>
                  {data?.user.firstName!==null && data?.user.firstName!==""? 
                    (<span>{data?.user.firstName}</span>):
                      (<span>-</span>)
                  }
                </td>
              </tr>
              <tr>
              <td className={styles.td}>Стать:</td>
                <td className={styles.td}>Номер телефону:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  {data?.user.gender.name!==null && data?.user.gender.name!==""? 
                    (<span>{data?.user.gender.name}</span>):
                      <span>-</span>
                  }
                </td>
                <td className={styles.td}>
                  {data?.user.phoneNumber!==null && data?.user.phoneNumber!==""? 
                    (<span>{data?.user.phoneNumber}</span>):
                      <span>-</span>
                  }
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Національність:</td>
                <td className={styles.td}>Віровизнання:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  {data?.user.nationality.name!==null && data?.user.nationality.name!==""? 
                    (<span>{data?.user.nationality.name}</span>):
                      <span>-</span>
                  }
                </td>
                <td className={styles.td}>
                  {data?.user.religion.name!==null && data?.user.religion.name!==""? 
                    (<span>{data?.user.religion.name}</span>):
                      <span>-</span>
                  }
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
                  {data?.user.degree.name!==null && data?.user.degree.name!==""? 
                    (<span>{data?.user.degree.name}</span>):
                      <span>-</span>
                  }
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Місце навчання:</td>
                <td className={styles.td}>Спецальність:</td>
              </tr>
              <tr>
                <td className={styles.td}>
                  {data?.user.education.placeOfStudy!==null && data?.user.education.placeOfStudy!==""? 
                    (<span>{data?.user.education.placeOfStudy}</span>):
                      <span>-</span>
                  }
                </td>
                <td className={styles.td}>
                  {data?.user.education.speciality!=null && data?.user.education.speciality!=''? 
                    (<span>{data?.user.education.speciality}</span>):
                      <span>-</span>
                  }
                </td>
              </tr>
              <tr>
                <td className={styles.td}>Посада:</td>
                <td className={styles.td}>Місце роботи:</td>
              </tr>
              <tr>
              <td className={styles.td}>
                  {data?.user.work.position!==null && data?.user.work.position!==""? 
                    (<span>{data?.user.work.position}</span>):
                      <span>-</span>
                  }
                </td>
                <td className={styles.td}>
                  {data?.user.work.placeOfwork!==null && data?.user.work.placeOfwork!==""? 
                    (<span>{data?.user.work.placeOfwork}</span>):
                      <span>-</span>
                  }
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