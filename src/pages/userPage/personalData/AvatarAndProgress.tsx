import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Avatar, Progress, Spin, Space, Skeleton } from 'antd';
import './PersonalData.less';
import { useHistory } from "react-router-dom";
import userApi from '../../../api/UserApi';
import kadrasApi from '../../../api/KadraVykhovnykivApi';
import KV1YPU from '../../../assets/images/KV1YPU.png';
import KV1YPN from '../../../assets/images/KV1YPN.png';
import KV2YPN from '../../../assets/images/KV2YPN.png';
import KV2YPU from '../../../assets/images/KV2YPU.png';
import HomePict3 from "../../assets/images/homeMenuPicture(3).jpg";
import AuthStore from '../../../stores/AuthStore';
import jwt from 'jwt-decode';

import Spinner from '../../Spinner/Spinner';

class AvatarAndProgressProps {
  imageUrl: string | undefined;
  time: number | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  isUserPlastun: boolean | undefined;
}




const contentListNoTitle: { [key: number]: any } = {
  1: <div key ='1' className="edustaffWrapper">< img src={KV1YPN} alt="Picture1"  className="edustaffPhoto"/></div>,
  2: <div key ='2' className="edustaffWrapper"><img src={KV1YPU} alt="Picture1" className="edustaffPhoto"/></div>,
  3: <div key ='3' className="edustaffWrapper"><img src={KV2YPN} alt="Picture1" className="edustaffPhoto"/></div>,
  4: <div key ='4' className="edustaffWrapper"><img src={KV2YPU} alt="Picture1" className="edustaffPhoto"/></div>,
};



const AvatarAndProgress:React.FC<AvatarAndProgressProps> = (props: AvatarAndProgressProps)=> {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const { time, imageUrl, firstName, lastName, isUserPlastun } = props;
  const [imageBase64, setImageBase64] = useState<string>();



let arrOfKV: Array<any>=[];


  const [kadras, setkadras] = useState<any>([{
    id: '',
    user: '',
    kvType: '',
    dateOfGranting: '',
    numberInRegister: '',
    basisOfGranting: '',
    link: '',
  }])
  

      useEffect(() => {
 
          const fetchData = async () => {
           
            await kadrasApi.getAllKVsOfGivenUser(userId).then(responce => {
              setkadras(responce.data);
            })
            await userApi.getImage(imageUrl).then((response: { data: any; }) =>{
              setImageBase64(response.data);
            });
             setLoading(true);
          };
          
          fetchData();
        
      }, [props]);

  return loading === false ? (
    <Skeleton.Avatar size={300} active={true} shape="circle" className="img" />
  ) : (
      <div className="leftPartWrapper">
        <Avatar size={300} src={imageBase64} className="img" />
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
              percent={Math.round(100 - (time === undefined ? 0 : time) * 100 / 365)}
            />


          {  kadras.forEach((element: any) => 
              arrOfKV.push(element.kadraVykhovnykivTypeId)
              
            )}


      <div className="edustaffAllPhotos">
         { arrOfKV.map(element => 
              (contentListNoTitle[element ])
              
            )}
            </div>
        </div>
         
      }
    </div>
  );
}
export default AvatarAndProgress;