import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Row, Skeleton, } from "antd";
import { SettingOutlined, CloseOutlined, RollbackOutlined } from "@ant-design/icons";
import { removeAdministrator, getAllAdmins, getAllMembers, toggleMemberStatus } from "../../../api/citiesApi";
import userApi from "../../../api/UserApi";
import classes from "./City.module.css";
import CityMember from "../../../models/City/CityMember";
import CityAdmin from "../../../models/City/CityAdmin";
import AddAdministratorModal from "../AddAdministratorModal/AddAdministratorModal";
//import AdminType from './../../../models/Admin/AdminType';
import moment from "moment";
import "moment/locale/uk";
import SkeletonAvatar from "antd/lib/skeleton/Avatar";
moment.locale("uk-ua");

const CityMembers = () => {
  const {id} = useParams();
  const history = useHistory();

  const [members, setMembers] = useState<CityMember[]>([]);
  const [admins, setAdmins] = useState<CityAdmin[]>([]);
  const [head, setHead] = useState<CityAdmin>(new CityAdmin());
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<CityAdmin>(new CityAdmin());
  //const [adminType, setAdminType] = useState<AdminType>(new AdminType());
  const [canEdit, setCanEdit] = useState<Boolean>(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);

  const getMembers = async () => {
    const responseMembers = await getAllMembers(id);

    setPhotosLoading(true);
    setPhotos(responseMembers.data.members);
    setMembers(responseMembers.data.members);
    setCanEdit(responseMembers.data.canEdit);

    const responseAdmins = await getAllAdmins(id);
    setAdmins(responseAdmins.data.administration);
    setHead(responseAdmins.data.head);
  };

  const removeMember = async (member: CityMember) => {
    await toggleMemberStatus(member.id);

    const existingAdmin = [head, ...admins].filter(
      (a) => a?.userId === member.userId
    );

    for (let i = 0; i < members.length; i++) {
      await removeAdministrator(existingAdmin[i].id);
    }

    setMembers(members.filter((u) => u.id !== member.id));
  };

  const showModal = (member: CityMember) => {
    const existingAdmin = [head, ...admins].find((a) => a?.userId === member.userId);
    
    if (existingAdmin !== undefined) {
      setAdmin(existingAdmin);
      //setAdminType(existingAdmin.adminType);
    }
    else {
      setAdmin({
        ...(new CityAdmin()),
        userId: member.user.id,
        user: member.user,
        cityId: member.cityId,
      });
    }

    setVisibleModal(true);
  };

  const setPhotos = async (members: CityMember[]) => {
    for (let i = 0; i < members.length; i++) {
      members[i].user.imagePath = (
        await userApi.getImage(members[i].user.imagePath)
      ).data;
    }

    setPhotosLoading(false);
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <Layout.Content>
      <h1 className={classes.mainTitle}>Члени станиці</h1>
      <div className={classes.wrapper}>
        {members.length > 0 ? (
          members.map((member: CityMember) => (
            <Card
              key={member.id}
              className={classes.detailsCard}
              actions={
                canEdit
                  ? [
                      <SettingOutlined onClick={() => showModal(member)} />,
                      <CloseOutlined onClick={() => removeMember(member)} />,
                    ]
                  : undefined
              }
            >
              <div
                onClick={() => history.push(`/userpage/main/${member.userId}`)}
                className={classes.cityMember}
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
          <h1>Ще немає членів станиці</h1>
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
      <AddAdministratorModal
        admin={admin}
        setAdmin={setAdmin}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        //adminType={adminType}
        //setAdminType={setAdminType}
      ></AddAdministratorModal>
    </Layout.Content>
  );
};

export default CityMembers;
