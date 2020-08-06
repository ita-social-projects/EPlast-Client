import React,{ useState, useEffect} from 'react';
import {Button, Space, Spin, Form, Input} from 'antd';
import './PersonalData.less';
import userApi from '../../../api/UserApi';
import moment from 'moment';
import AvatarAndProgress from './AvatarAndProgress';
import { Data } from '../Interface/Interface';
import {useParams} from 'react-router-dom';

export default function () {
  const {userId}=useParams(); 
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Data>();
  const fetchData = async () => {
    await userApi.getById(userId).then(response =>{
      setData(response.data);
      setLoading(true);
    })
  };
      
      useEffect(() => {
        fetchData();
      }, [userId]);
      
      return loading === false ? (
        <div className="spaceWrapper">
          <Space className="styles.loader" size="large">
            <Spin size="large" />
          </Space>
        </div>
      ) : (

        <div className="container">
         <Form name="basic" className="formContainer">
        <div className="avatarWrapper">
          <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName}/>
        </div>
        <div className="allFields">
          <h2 className="title">Особистий профіль</h2>
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
              {data?.user.birthday!==null? 
                     (<Input readOnly className="dataInput" value={moment(data?.user.birthday).format("DD-MM-YYYY")} />):
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
          <Button className="confirmBtn">
            Обрати/змінити курінь
          </Button>
        </div>
        
      </Form>
     
    </div>

      // <div className="userFieldsWrapper">
      // <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName}/>
      // <div >
        
      // <div className={styles.allFields}>
      //   <h2 className="title">Особистий профіль</h2>
      //     <div className={styles.rowBlock}>
      //       <Form.Item
      //         label="Ім`я"
      //         className={styles.formItem}
      //       >
      //         {data?.user.firstName!==null && data?.user.firstName!==""? 
      //               (<Input readOnly className={styles.dataInput} value={data?.user.firstName}/>):
      //                 (<span>-</span>)
      //             }
      //       </Form.Item>
      //       <Form.Item
      //         label="Прізвище"
      //         className={styles.formItem}
      //       >
      //         {(data?.user.lastName!==null && data?.user.lastName!=="")? 
      //               (<Input readOnly className={styles.dataInput} value={data?.user.lastName} />):
      //                 (<span>-</span>)
      //             }
      //       </Form.Item>
      //     </div>
      //     <div className={styles.rowBlock}>
      //       <Form.Item
      //         label="По-батькові"
      //         className={styles.formItem}
      //       >
      //         <Input disabled  className={styles.dataInput}/>
      //       </Form.Item>
      //       <Form.Item 
      //         label="Стать" 
      //         className={styles.formItem}
      //         >
      //          <Input disabled className={styles.dataInput} />
      //       </Form.Item>
      //     </div>
         
      //     <div className={styles.rowBlock}>
      //       <Form.Item
      //         label="Дата народження"
      //         className={styles.formItem}
      //       >
      //          <Input disabled className={styles.dataInput} /> 
             
      //       </Form.Item>
      //       <Form.Item
      //         label="Номер телефону"
      //         className={styles.formItem}
      //       >
      //           <Input disabled className={styles.dataInput} />
      //       </Form.Item>
           
      //     </div>
      //     <div className={styles.rowBlock}>
      //       <Form.Item
      //         label="Національність"
      //         className={styles.formItem}
      //       >
      //          <Input disabled className={styles.dataInput} />
      //       </Form.Item>
      //       <Form.Item
      //         label="Віровизнання"
      //         className={styles.formItem}
      //       >
      //        <Input disabled className={styles.dataInput} />
      //       </Form.Item>
           
      //     </div>
          
      //     <div className={styles.rowBlock}>
      //       <Form.Item
      //         label="Навчальний заклад"
      //         className={styles.formItem}
      //       >
      //         <Input disabled className={styles.dataInput} />
      //       </Form.Item>
      //       <Form.Item
      //         label="Спеціальність"
      //         className={styles.formItem}
      //       >
      //          <Input disabled className={styles.dataInput} />
      //       </Form.Item>
      //     </div>
      //     <div className={styles.rowBlock}>
      //       <Form.Item
      //         label="Навчальний ступінь"
      //         className={styles.formItem}
      //       >
      //          <Input disabled className={styles.dataInput} />
      //       </Form.Item>
      //       <Form.Item
      //         label="Місце праці"
      //         className={styles.formItem}
      //       >
      //        <Input disabled className={styles.dataInput} />
      //       </Form.Item>
      //     </div>
      //     <div className={styles.rowBlock}>
      //       <Form.Item
      //         label="Посада"
      //         className={styles.formItem}
      //       >
      //         <Input disabled className={styles.dataInput} />
      //       </Form.Item>
      //       <Form.Item
      //         label="Адреса проживання"
      //         className={styles.formItem}
      //       >
      //         <Input disabled className={styles.dataInput} />
      //       </Form.Item>
      //     </div>
      //   </div>
      
      //   {/* <div className="tableWrapper">
      //     <table className="table">
      //       <tbody>
      //         <tr>
      //           <td className="td">Прізвище:</td>
      //           <td className="td">Ім`я:</td>
      //         </tr>
      //         <tr>
      //           <td className="td">
      //             {(data?.user.lastName!==null && data?.user.lastName!=="")? 
      //               (<span>{data?.user.lastName}</span>):
      //                 (<span>-</span>)
      //             }
      //           </td>
      //           <td className="td">
      //             {data?.user.firstName!==null && data?.user.firstName!==""? 
      //               (<span>{data?.user.firstName}</span>):
      //                 (<span>-</span>)
      //             }
      //           </td>
      //         </tr>
      //         <tr>
      //         <td className="td">Стать:</td>
      //           <td className="td">Номер телефону:</td>
      //         </tr>
      //         <tr>
      //           <td className="td">
      //             {data?.user.gender.name!==null && data?.user.gender.name!==""? 
      //               (<span>{data?.user.gender.name}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //           <td className="td">
      //             {data?.user.phoneNumber!==null && data?.user.phoneNumber!==""? 
      //               (<span>{data?.user.phoneNumber}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //         </tr>
      //         <tr>
      //           <td className="td">Національність:</td>
      //           <td className="td">Віровизнання:</td>
      //         </tr>
      //         <tr>
      //           <td className="td">
      //             {data?.user.nationality.name!==null && data?.user.nationality.name!==""? 
      //               (<span>{data?.user.nationality.name}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //           <td className="td">
      //             {data?.user.religion.name!==null && data?.user.religion.name!==""? 
      //               (<span>{data?.user.religion.name}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //         </tr>
      //         <tr>
      //           <td className="td">Дата народження:</td>
      //           <td className="td">Науковий ступінь:</td>
      //         </tr>
      //         <tr>
      //           <td className="td">
      //             <span>{moment(data?.user.birthday).format("DD-MM-YYYY")}</span>
      //           </td>
      //           <td className="td">
      //             {data?.user.degree.name!==null && data?.user.degree.name!==""? 
      //               (<span>{data?.user.degree.name}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //         </tr>
      //         <tr>
      //           <td className="td">Місце навчання:</td>
      //           <td className="td">Спецальність:</td>
      //         </tr>
      //         <tr>
      //           <td className="td">
      //             {data?.user.education.placeOfStudy!==null && data?.user.education.placeOfStudy!==""? 
      //               (<span>{data?.user.education.placeOfStudy}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //           <td className="td">
      //             {data?.user.education.speciality!=null && data?.user.education.speciality!=''? 
      //               (<span>{data?.user.education.speciality}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //         </tr>
      //         <tr>
      //           <td className="td">Посада:</td>
      //           <td className="td">Місце роботи:</td>
      //         </tr>
      //         <tr>
      //         <td className="td">
      //             {data?.user.work.position!==null && data?.user.work.position!==""? 
      //               (<span>{data?.user.work.position}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //           <td className="td">
      //             {data?.user.work.placeOfwork!==null && data?.user.work.placeOfwork!==""? 
      //               (<span>{data?.user.work.placeOfwork}</span>):
      //                 <span>-</span>
      //             }
      //           </td>
      //         </tr>
      //       </tbody>
      //     </table>
      //   </div> */}
      //   <Button className="btn">Обрати/змінити курінь</Button>
      // </div>
      // </div>
      );
}