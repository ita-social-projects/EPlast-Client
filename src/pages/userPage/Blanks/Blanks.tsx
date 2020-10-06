import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Data } from "../Interface/Interface";
import userApi from '../../../api/UserApi';
import notificationLogic from '../../../components/Notifications/Notification';
import AvatarAndProgress from "../personalData/AvatarAndProgress";
import { Form } from "antd";
import classes from "./Blanks.module.css";
import Title from "antd/lib/typography/Title";


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
            <div className={classes.wrapper}>
                <div className={classes.wrapperImg}>
                    <AvatarAndProgress imageUrl={data?.user.imagePath} time={data?.timeToJoinPlast} firstName={data?.user.firstName} lastName={data?.user.lastName} isUserPlastun={data?.isUserPlastun} />
                </div>
                <div className={classes.wrapper}>
                    <div className={classes.wrapperCol}>
                        <div className={classes.wrapper2}>
                            <Title level={2}>Життєпис</Title>
                            <div className={classes.line} />
                        </div>

                        <div className={classes.wrapper4}>
                            <Title level={2}>Сертифікати</Title>
                            <div className={classes.line} />
                        </div>
                        <div className={classes.wrapper6}>
                            <Title level={2}>Генерація</Title>
                            <div className={classes.line} />
                        </div>
                    </div>
                </div>
                <div className={classes.wrapper}>
                    <div className={classes.wrapperCol}>
                        <div className={classes.wrapper3}>
                            <Title level={2}>Пошук</Title>
                            <div className={classes.line} />
                        </div>

                        <div className={classes.wrapper5}>
                            <Title level={2}>СВУ</Title>
                            <div className={classes.line} />
                        </div>

                    </div>

                </div>

            </div>

        </>
    )
}
