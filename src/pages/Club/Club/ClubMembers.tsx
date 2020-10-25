import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Button, Card, Layout, Row, Skeleton, Spin, } from "antd";
import { SettingOutlined, CloseOutlined, RollbackOutlined } from "@ant-design/icons";
import { removeAdministrator, getAllAdmins, getAllMembers, toggleMemberStatus } from "../../../api/clubsApi";
import userApi from "../../../api/UserApi";
import "./Club.less";
import ClubMember from "../../../models/Club/ClubMember";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import AddAdministratorModal from "../AddAdministratorModal/AddAdministratorModal";
import moment from "moment";
import "moment/locale/uk";
import Title from "antd/lib/typography/Title";
import Spinner from "../../Spinner/Spinner";
moment.locale("uk-ua");

const ClubMembers = () => {
  const {id} = useParams();
  const history = useHistory();

  const [members, setMembers] = useState<ClubMember[]>([]);
  const [admins, setAdmins] = useState<ClubAdmin[]>([]);
  const [head, setHead] = useState<ClubAdmin>(new ClubAdmin());
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
  const [canEdit, setCanEdit] = useState<Boolean>(false);
  const [photosLoading, setPhotosLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const getMembers = async () => {
    setLoading(true);
    const responseMembers = await getAllMembers(id);

    setPhotosLoading(true);
    setPhotos(responseMembers.data.members);
    setMembers(responseMembers.data.members);
    setCanEdit(responseMembers.data.canEdit);

    const responseAdmins = await getAllAdmins(id);
    setAdmins(responseAdmins.data.administration);
    setHead(responseAdmins.data.head);
    setLoading(false);
  };

  const removeMember = async (member: ClubMember) => {
    await toggleMemberStatus(member.id);

    const existingAdmin = [head, ...admins].filter(
      (a) =>
        a?.userId === member.userId &&
        (moment(a?.endDate).isAfter(moment()) || a?.endDate === null)
    );

    for (let i of existingAdmin) {
      await removeAdministrator(i.id);
    }

    setMembers(members.filter((u) => u.id !== member.id));
  };

  const onAdd = async () => {
    const responseAdmins = await getAllAdmins(id);
    setAdmins(responseAdmins.data.administration);
    setHead(responseAdmins.data.head);
  }

  const showModal = (member: ClubMember) => {    
    const existingAdmin = [head, ...admins].find((a) => a?.userId === member.userId);
    
    if (existingAdmin !== undefined) {
      setAdmin(existingAdmin);
    }
    else {
      setAdmin({
        ...(new ClubAdmin()),
        userId: member.user.id,
        clubId: member.ClubId,
      });
    }

    setVisibleModal(true);
  };

  const setPhotos = async (members: ClubMember[]) => {
    for (let i of members) {
      i.user.imagePath = (await userApi.getImage(i.user.imagePath)).data;
    }

    setPhotosLoading(false);
  };

  useEffect(() => {
    getMembers();
  }, []);

  return (
    <Layout.Content>
      <Title level={2}>
        Члени куреня
      </Title>
      {loading ? (
          <Spinner />
        ) : (
      <div className="clubMoreItems">
        {members.length > 0 ? (
          members.map((member: ClubMember) => (
            <Card
              key={member.id}
              className="detailsCard"
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
                className="clubMember"
              >
                {photosLoading ? (
                  <Skeleton.Avatar active size={86}></Skeleton.Avatar>
                ) : (
                  <Avatar
                    size={86}
                    src={member.user.imagePath}
                    className="detailsIcon"
                  />
                )}
                <Card.Meta
                  className="detailsMeta"
                  title={`${member.user.firstName} ${member.user.lastName}`}
                />
              </div>
            </Card>
          ))
        ) : (
          <Title level={4}>
            Ще немає членів куреня
          </Title>
        )}
      </div>)}
      <div className="clubMoreItems">
        <Button
          className="backButton"
          icon={<RollbackOutlined />}
          size={"large"}
          onClick={() => history.goBack()}
          type="primary"
        >
          Назад
        </Button>
      </div>
      {canEdit ? (
        <AddAdministratorModal
          admin={admin}
          setAdmin={setAdmin}
          visibleModal={visibleModal}
          setVisibleModal={setVisibleModal}
          clubId={+id}
          onAdd={onAdd}
        ></AddAdministratorModal>
      ) : null}
    </Layout.Content>
  );
};

export default ClubMembers;
