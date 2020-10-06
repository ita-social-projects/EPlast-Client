import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Data } from "../Interface/Interface";
import userApi from '../../../api/UserApi';
import notificationLogic from '../../../components/Notifications/Notification';
import AvatarAndProgress from "../personalData/AvatarAndProgress";
import { Form } from "antd";


export const Blanks = () => {
    const { userId } = useParams();
    const [data, setData] = useState<Data>();
    const [noTitleKey, setKey] = useState<string>('1');


    const fetchData = async () => {
        await userApi.getById(userId).then(response => {
            setData(response.data);
        }).catch(() => { notificationLogic('error', "Щось пішло не так") })
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    return (
        <>
            <p></p>
            <div className="container">
                <Form name="basic" className="formContainer">

                    <div className="avatarWrapper">
                        <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName} isUserPlastun={data?.isUserPlastun} />
                    </div>
                </Form>
            </div>

        </>
    )
}
