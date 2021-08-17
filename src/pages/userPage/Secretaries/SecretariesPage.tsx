import React, { useEffect, useState } from 'react';
import userApi from '../../../api/UserApi';
import AvatarAndProgressStatic from '../personalData/AvatarAndProgressStatic';
import { useParams } from 'react-router-dom';
import { Data } from '../Interface/Interface';
import notificationLogic from '../../../components/Notifications/Notification';
import { Card, Form, Skeleton } from 'antd';
import './Secretaries.less'
import {UserCitySecretaryTable} from './UserCitySecretaryTable';
import { UserRegionSecretaryTable } from './UserRegionSecretaryTable';
import { UserClubSecretaryTable } from './UserClubSecretaryTable';
import { UserGoverningBodySecretaryTable } from './UserGoverningBodySecretaryTable';
import{ tryAgain } from "../../../components/Notifications/Messages";
import { StickyContainer } from 'react-sticky';


const tabList = [
    {
        key: '1',
        tab: 'Діловодства краю',
    },
    {
        key: '2',
        tab: 'Діловодства округи',
    },
    {
        key: '3',
        tab: 'Діловодства станиці',
    },
    {
        key: '4',
        tab: 'Діловодства куреня',
    },
];


export const Secretaries = () => {
    const { userId } = useParams();
    
    const [noTitleKey, setKey] = useState<string>('1');
    const [data, setData] = useState<Data>();
     const [LoadInfo, setLoadInfo] = useState<boolean>(false);

    const fetchData = async () => {
        await userApi.getById(userId).then(response => {
            setData(response.data);
            setLoadInfo(true);
        }).catch(() => { notificationLogic('error', tryAgain) })
    };

    const onTabChange =  (key:string) => { setKey(key) };

     const contentListNoTitle: { [key: string]: any } = {
        1: <div key='1'><UserGoverningBodySecretaryTable UserId={userId}/></div>,
        2: <div key='2'><UserRegionSecretaryTable UserId={userId}/></div>,
        3: <div key='3'><UserCitySecretaryTable UserId={userId}/></div>,
        4: <div key='4'><UserClubSecretaryTable UserId={userId}/></div>
      };

      useEffect(() => {
        fetchData();
    }, []);
    return LoadInfo === false ? (
      <div className="kadraWrapper">
        <Skeleton.Avatar
          size={220}
          active={true}
          shape="circle"
          className="img"
        />
      </div>
    ) : ( 
            <div className="container">
                <Form name="basic" className="formContainer">
                    <div className="avatarWrapperSecretaries">
                        <StickyContainer className="kadraWrapper">
                            <AvatarAndProgressStatic
                                imageUrl={data?.user.imagePath as string}
                                time={data?.timeToJoinPlast}
                                firstName={data?.user.firstName}
                                lastName={data?.user.lastName}
                                isUserPlastun={data?.isUserPlastun}
                                pseudo={data?.user.pseudo}
                                governingBody={data?.user.governingBody}
                                region={data?.user.region}
                                city={data?.user.city}
                                club={data?.user.club} 
                                governingBodyId={data?.user.governingBodyId}
                                cityId={data?.user.cityId}
                                clubId={data?.user.clubId}
                                regionId={data?.user.regionId}
                                cityMemberIsApproved={data?.user.cityMemberIsApproved}
                                clubMemberIsApproved={data?.user.clubMemberIsApproved}/>
                        </StickyContainer>
                    </div>

                    <div className="allFieldsSecretaries">
                        <div className="rowBlockSecretaries">
                        
                            <Card
                                style={{ width: '100%' }}
                                tabList={tabList}
                                activeTabKey={noTitleKey}

                                onTabChange={key => {
                                    onTabChange(key);

                                }}
                            >
                                {contentListNoTitle[noTitleKey]}
                            </Card>

                        </div>
                    </div>
                </Form>
            </div>
    )

}

export default Secretaries;