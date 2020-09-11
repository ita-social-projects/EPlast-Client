import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Avatar, Card, Layout, Button, Skeleton } from "antd";
import {
  SettingOutlined,
  CloseOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import clubsApi from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import classes from "./Club.module.css";
import ClubAdmin from '../../../models/Club/ClubAdmin';
import AddAdministratorModal from "../AddAdministratorModal/AddAdministratorModal";

const ClubAdministration = () => {
  const { id } = useParams();
  const history = useHistory();

  const [administration, setAdministration] = useState<ClubAdmin[]>([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
  const [isCurrentUserAdmin, setIsAdmin] = useState(false);
  const [isCurrentUserClubAdmin, setIsClubAdmin] = useState(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);

  const getAdministration = async () => {
    const response = await clubsApi.getAllAdmins(id);
    setPhotosLoading(true);
    setPhotos(response.data.clubAdministration);
    setAdministration(response.data.clubAdministration);
    setIsAdmin(response.data.isCurrentUserAdmin);
    setIsClubAdmin(response.data.isCurrentUserClubAdmin);
  };

  useEffect(() => {
    getAdministration();
  }, []);

  const setPhotos = async (members: ClubAdmin[]) => {
    for (let i = 0; i < members.length; i++) {
      members[i].clubMembers.user.imagePath = (
        await userApi.getImage(members[i].clubMembers.user.imagePath)
      ).data;
    }

    setPhotosLoading(false);
  };

  const removeAdmin = async (adminId: number) => {
    await clubsApi.removeAdministrator(adminId);
    setAdministration(administration.filter((u) => u.id !== adminId));
  };

  const showModal = (member: ClubAdmin) => {
    setAdmin(member);

    setVisibleModal(true);
  };

  return (
    <Layout.Content>
        <h1 className={classes.mainTitle}>Діловоди куреня</h1>
        <div className={classes.wrapper}>
          {administration.length > 0 ? (
            administration.map((member: ClubAdmin) => (
              <Card
                key={member.id}
                className={classes.detailsCard}
                title={`${member.adminType.adminTypeName}`}
                headStyle={{ backgroundColor: "#3c5438", color: "#ffffff" }}
                actions={
                  (isCurrentUserClubAdmin || isCurrentUserAdmin)
                    ? [
                        <SettingOutlined onClick={() => showModal(member)} />,
                        <CloseOutlined
                          onClick={() => removeAdmin(member.id)}
                        />,
                      ]
                    : undefined
                }
              >
                <div
                  onClick={() =>
                    history.push(`/userpage/main/${member.clubMembers.userId}`)
                  }
                  className={classes.cityMember}
                >
                  <div>
                    {photosLoading ? (
                      <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                    ) : (
                      <Avatar
                        size={86}
                        src={member.clubMembers.user.imagePath}
                        className={classes.detailsIcon}
                      />
                    )}
                    <Card.Meta
                      className={classes.detailsMeta}
                      title={`${member.clubMembers.user.firstName} ${member.clubMembers.user.lastName}`}
                    />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <h1>Ще немає діловодів куреня</h1>
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
        {(isCurrentUserClubAdmin || isCurrentUserAdmin) ? (
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
export default ClubAdministration;
