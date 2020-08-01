import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Avatar, Card, Layout} from 'antd';
import {UserOutlined, CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {getAllFollowers, removeFollower, toggleMemberStatus} from "../../api/citiesApi";
import classes from './City.module.css';
import CityMember from './../../models/City/CityMember';

const CityFollowers = () => {
    const {id} = useParams();

    const [followers, setFollowers] = useState<CityMember[]>([]);

    const getFollowers = async () => {
        const response = await getAllFollowers(id);
        setFollowers(response.data);
    };

    const addMember = async (followerId: number) => {
        await toggleMemberStatus (followerId);
        setFollowers(followers.filter(u => u.id !== followerId));
    }

    const removeMember = async (followerId: number) => {
        await removeFollower(followerId);
        setFollowers(followers.filter(u => u.id !== followerId));
    }

    useEffect(() => {
        getFollowers();
    }, []);

    return (
        <Layout.Content>
            <h1 className={classes.mainTitle}>Прихильники станиці</h1>
            <div className={classes.wrapper}>
                {followers.map((follower: CityMember) => (
                    <Card
                        key={follower.id}
                        className={classes.detailsCard}
                        actions={[
                            <PlusOutlined key="plus"
                            onClick={e => addMember(follower.id)}/>,
                            <CloseOutlined key="close"
                            onClick={e => removeMember(follower.id)}/>,
                        ]}
                    >
                        <Avatar size={86} icon={<UserOutlined/>} className={classes.detailsIcon}/>
                        <Card.Meta className={classes.detailsMeta}
                                   title={`${follower.user.firstName} ${follower.user.lastName}`}/>
                    </Card>
                ))}
            </div>
        </Layout.Content>
    );
};
export default CityFollowers;
