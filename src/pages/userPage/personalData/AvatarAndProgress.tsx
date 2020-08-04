<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Avatar, Progress, Spin, Space } from 'antd';
import styles from './PersonalData.module.css';
import userApi from '../../../api/UserApi';

class AvatarAndProgressProps {
  imageUrl:string|undefined;
  time:number|undefined;
  firstName:string|undefined;
  lastName:string|undefined;
}



const AvatarAndProgress:React.FC<AvatarAndProgressProps> = (props: AvatarAndProgressProps)=> {
   const [loading, setLoading] = useState(false);
  const {time,imageUrl,firstName,lastName}=props;
  const [imageBase64, setImageBase64] = useState<string>();
      useEffect(() => {
        if(imageUrl!==undefined)
        {
          const fetchData = async () => {
            await userApi.getImage(imageUrl).then((response: { data: any; }) =>{
              setImageBase64(response.data);
            })
             setLoading(true);
          };
          fetchData();
        }
      }, [props]);

      return loading === false ? (
        <div className={styles.spaceWrapper}>
          <Space className={styles.loader} size="large">
            <Spin size="large" />
          </Space>
        </div>
        
      ) : (
    <div className={styles.leftPartWrapper}>
      <Avatar size={256} src={imageBase64} />
      <p className={styles.statusText}>{time} дні і {firstName} {lastName} Пластун:)</p>
      <Progress
        type="circle"
        className={styles.progressBar}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        percent={Math.round(100-(time===undefined?0:time)*100/365)}
      />
    </div>
  );
}
=======
import React, { useState, useEffect } from 'react';
import { Avatar, Progress, Spin, Space } from 'antd';
import styles from './PersonalData.module.css';
import userApi from '../../../api/UserApi';

class AvatarAndProgressProps {
  imageUrl:string|undefined;
  time:number|undefined;
  firstName:string|undefined;
  lastName:string|undefined;
}



const AvatarAndProgress:React.FC<AvatarAndProgressProps> = (props: AvatarAndProgressProps)=> {
   const [loading, setLoading] = useState(false);
  const {time,imageUrl,firstName,lastName}=props;
  const [imageBase64, setImageBase64] = useState<string>();
      useEffect(() => {
        if(imageUrl!==undefined)
        {
          const fetchData = async () => {
            await userApi.getImage(imageUrl).then((response: { data: any; }) =>{
              setImageBase64(response.data);
            })
             setLoading(true);
          };
          fetchData();
        }
      }, [props]);

      return loading === false ? (
        <div className={styles.spaceWrapper}>
          <Space className={styles.loader} size="large">
            <Spin size="large" />
          </Space>
        </div>
        
      ) : (
    <div className={styles.leftPartWrapper}>
      <Avatar size={256} src={imageBase64} />
      <p className={styles.statusText}>{time} дні і {firstName} {lastName} Пластун:)</p>
      <Progress
        type="circle"
        className={styles.progressBar}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        percent={Math.round(100-(time===undefined?0:time)*100/365)}
      />
    </div>
  );
}
>>>>>>> 5f13343c48a83b4427c8b26e0f4ee86ad7bf0544
export default AvatarAndProgress;