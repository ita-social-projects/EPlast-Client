import React, {useEffect, useState} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {Avatar, Card, Layout, Spin, Skeleton, Button} from 'antd';
import {SettingOutlined, CloseOutlined, RollbackOutlined} from '@ant-design/icons';
import moment from "moment";
import clubsApi from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import classes from './Club.module.css';
import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from "../../../models/Club/ClubMember";
import AddAdministratorModal from "../AddAdministratorModal/AddAdministratorModal";

const ClubMembers = () => {
    const {id} = useParams();
    const history = useHistory();

    const [members, setMembers] = useState<ClubMember[]>([]);
    const [admins, setAdmins] = useState<ClubAdmin[]>([]);
    const [clubHead, setClubHead] = useState<ClubAdmin>(new ClubAdmin());
    const [visibleModal, setVisibleModal] = useState(false);
    const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
    const [isCurrentUserAdmin, setIsAdmin] = useState(false);
    const [isCurrentUserClubAdmin, setIsClubAdmin] = useState(false);
    const [photosLoading, setPhotosLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const getMembers = async () => {
        setLoading(true);
        const response = await clubsApi.getAllMembers(id);
        setPhotosLoading(true);
        setPhotos(response.data.members);
        setMembers(response.data.members);

        setIsAdmin(response.data.isCurrentUserAdmin);
        setIsClubAdmin(response.data.isCurrentUserClubAdmin);

        setClubHead(response.data.clubAdmin)
        setAdmins(response.data.clubAdministration);

        setLoading(false);
    };

    useEffect(() => {
        getMembers();
    }, []);

    const setPhotos = async (members: ClubMember[]) => {
        for (let i = 0; i < members.length; i++) {
          members[i].user.imagePath = (
            await userApi.getImage(members[i].user.imagePath)
          ).data;
        }
    
        setPhotosLoading(false);
      };

    const toggleMemberStatus = async (member: ClubMember) => {
        await clubsApi.toggleMemberStatus(id, member.id);

        const existingAdmin = [clubHead, ...admins].filter(
            (a) => a?.clubMembers.userId === member.userId && moment(a?.endDate).isAfter(moment())
        );

        for (let i = 0; i < existingAdmin.length; i++) {
            await clubsApi.removeAdministrator(existingAdmin[i].id);
        }

        setMembers(members.filter((u) => u.id !== member.id));
    };

    const showModal = (member: ClubMember) => {
        const existingAdmin = [clubHead, ...admins].find((a) => a?.clubMembers.userId === member.userId);
    
        if (existingAdmin !== undefined) {
            setAdmin(existingAdmin);
        }
        else {
        setAdmin({
        ...(new ClubAdmin()),
        //userId: member.user.id,
        clubMembers: member,
        clubId: member.clubId,
        });
    }

    setVisibleModal(true);
    };

    return loading ? (
        <Layout.Content className={classes.spiner}>
            <Spin size="large" />
        </Layout.Content>
        ) : (
        <Layout.Content>
        <h1 className={classes.mainTitle}>Члени куреня</h1>
        <div className={classes.wrapper}>
        {members.length > 0 ? (
            members.map((member: ClubMember) => (
            <Card
                key={member.id}
                className={classes.detailsCard}
                actions={
                    (isCurrentUserClubAdmin || isCurrentUserAdmin) ? [
                        <SettingOutlined onClick={() => showModal(member)} />,
                        <CloseOutlined onClick={() => toggleMemberStatus(member)} />,
                    ]
                    : undefined
                }
            >
                <div
                onClick={() => history.push(`/userpage/main/${member.userId}`)}
                className={classes.clubMember}
                >
                {photosLoading ? (
                    <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                ) : (
                    <Avatar
                    size={86}
                    src={member.user.imagePath}
                    className={classes.detailsIcon}
                    />
                )}
                <Card.Meta
                    className={classes.detailsMeta}
                    title={`${member.user.firstName} ${member.user.lastName}`}
                />
                </div>
            </Card>
            ))
        ) : (
            <h1>Ще немає членів куреня</h1>
        )}
        </div>
        <div className={classes.wrapper}>
        <Button
            className={classes.backButton}
            icon={<RollbackOutlined />}
            size={"large"}
            onClick={() => history.goBack()}
            type="primary"
        >
            Назад
        </Button>
        </div>
        { (isCurrentUserClubAdmin || isCurrentUserAdmin) ? (
            <AddAdministratorModal
                admin={admin}
                setAdmin={setAdmin}
                visibleModal={visibleModal}
                setVisibleModal={setVisibleModal}
            ></AddAdministratorModal>
        ) : null}
        </Layout.Content>
    );
};
export default ClubMembers;
