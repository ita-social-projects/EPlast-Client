import React, { useState, useEffect } from 'react';
import { Avatar, Progress, Spin, Space } from 'antd';
import './PersonalData.less';
import userApi from '../../../api/UserApi';

class AvatarAndProgressProps {
  imageUrl:string|undefined;
  time:number|undefined;
  firstName:string|undefined;
  lastName:string|undefined;
  isUserPlastun:boolean|undefined;
}



const AvatarAndProgress:React.FC<AvatarAndProgressProps> = (props: AvatarAndProgressProps)=> {
  const [loading, setLoading] = useState(false);
  const {time,imageUrl,firstName,lastName,isUserPlastun}=props;
  const [imageBase64, setImageBase64] = useState<string>();
      useEffect(() => {
        if(imageUrl!==undefined)
        {
          const fetchData = async () => {
            await userApi.getImage(imageUrl).then((response: { data: any; }) =>{
              setImageBase64(response.data);
            });
             setLoading(true);
          };
          fetchData();
        }
      }, [props]);

      return loading === false ? (
        <div className="spaceWrapper">
          <Space className="loader" size="large">
            <Spin size="large" />
          </Space>
        </div>
        
      ) : (
    <div className="leftPartWrapper">
      <Avatar size={300} src={imageBase64} className="img"/>
      {!isUserPlastun && 
         <div className="progress">
              <p className="statusText">{time} дні і {firstName} {lastName} Пластун:)</p>
              <Progress
              type="circle"
              className="progressBar"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              percent={Math.round(100-(time===undefined?0:time)*100/365)}
            />
        </div>
         
      }
    </div>
  );
}
export default AvatarAndProgress;