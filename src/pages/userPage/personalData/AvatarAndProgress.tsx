import React, { useState, useEffect } from 'react';
import { Avatar, Progress } from 'antd';
import styles from './PersonalData.module.css';
import userApi from '../../../api/UserApi';

type AvatarAndProgressProps ={
  imageUrl:string|undefined;
  time:number|undefined;
}

const AvatarAndProgress:React.FC<AvatarAndProgressProps> = (props: AvatarAndProgressProps)=> {
  // const [loading, setLoading] = useState(false);
  const {time,imageUrl}=props;
  const [imageBase64, setImageBase64] = useState<string>();
      useEffect(() => {
        if(imageUrl!==undefined)
        {
          const fetchData = async () => {
            await userApi.getImage(imageUrl).then((response: { data: any; }) =>{
              setImageBase64(response.data);
            })
            // setLoading(false);
          };
          fetchData();
        }
      }, [props]);

  return (
    <div className={styles.leftPartWrapper}>
      <Avatar size={256} src={imageBase64} />
      <p className={styles.statusText}>{time} дні і Василь Хартманє Пластун:)</p>
      
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
export default AvatarAndProgress;
