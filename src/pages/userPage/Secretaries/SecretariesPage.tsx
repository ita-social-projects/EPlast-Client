import React, { useEffect, useState } from 'react';
import userApi from '../../../api/UserApi';
import AvatarAndProgress from '../personalData/AvatarAndProgress';
import { useParams } from 'react-router-dom';
import { Data } from '../Interface/Interface';
import notificationLogic from '../../../components/Notifications/Notification';
import { Card, Form } from 'antd';
import './Secretaries.less'
import {UserCitySecretaryTable} from './UserCitySecretaryTable';
import { UserRegionSecretaryTable } from './UserRegionSecretaryTable';
import { UserClubSecretaryTable } from './UserClubSecretaryTable';
import{ tryAgain } from "../../../components/Notifications/Messages";
import { StickyContainer } from 'react-sticky';


const tabList = [
    {
        key: '1',
        tab: 'Діловодства округи',
    },
    {
        key: '2',
        tab: 'Діловодства станиці',
    },
    {
        key: '3',
        tab: 'Діловодства куреня',
    },
];



export const Secretaries = () => {
    const { userId } = useParams();
    
    const [noTitleKey, setKey] = useState<string>('1');
    const [data, setData] = useState<Data>();

    const fetchData = async () => {
        await userApi.getById(userId).then(response => {
            setData(response.data);
        }).catch(() => { notificationLogic('error', tryAgain) })
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    const onTabChange =  (key:string) => { setKey(key) };

     const contentListNoTitle: { [key: string]: any } = {
        1: <div key='1'><UserRegionSecretaryTable UserId={userId}/></div>,
        2: <div key='2'><UserCitySecretaryTable UserId={userId}/></div>,
        3: <div key='3'><UserClubSecretaryTable UserId={userId}/></div>
      };


    return (
        <>
            
            <p></p>
            <div className="container">
                <Form name="basic" className="formContainer">

                    <div className="avatarWrapperSecretaries">
                        <StickyContainer className="kadraWrapper">
                            <AvatarAndProgress
                                imageUrl={data?.user.imagePath}
                                time={data?.timeToJoinPlast}
                                firstName={data?.user.firstName}
                                lastName={data?.user.lastName}
                                isUserPlastun={data?.isUserPlastun}
                                pseudo={data?.user.pseudo}
                                region={data?.user.region}
                                city={data?.user.city}
                                club={data?.user.club} 
                                cityId={data?.user.cityId}
                                clubId={data?.user.clubId}
                                regionId={data?.user.regionId}/>
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
        </>
    )

}

export default Secretaries;