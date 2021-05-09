import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Typography, Row, Col } from "antd";
import adminApi from "../../api/adminApi";
import ClubForAdmin from "../../models/Club/ClubForAdmin";
import {
  addFollowerWithId,
  getAllFollowers,
  getAllMembers,
  getClubs,
  toggleMemberStatus,
} from "../../api/clubsApi";
import ClubAdmin from "../../models/Club/ClubAdmin";
import ClubMember from "../../models/Club/ClubMember";
import ClubUser from "../../models/Club/ClubUser";
import AdminType from "../../models/Admin/AdminType";
import AddAdministratorModal from "../Club/AddAdministratorModal/AddAdministratorModal";
import NotificationBoxApi from "../../api/NotificationBoxApi";
const { Title } = Typography;
const { Option } = Select;

interface Props {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onChange: (id: string, userRoles: string) => void;
  user: any
}

const ChangeUserClubForm = ({
  record,
  showModal,
  setShowModal,
  onChange,
  user
}: Props) => {
  const id = record;
  const [form] = Form.useForm();
  const [clubs, setClubs] = useState<ClubForAdmin[]>([]);

  const [clubId, setClubId] = useState<number>(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [admin, setAdmin] = useState<ClubAdmin>(new ClubAdmin());
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [followers, setFollowers] = useState<ClubMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await getClubs().then((response) => {
        setClubs(response.data);
      });
    };
    fetchData();
    if (showModal) {
      form.resetFields();
    }
  }, []);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleClick = async (event: any) => {
    const id = clubs.filter((c: any) => c.name === event)[0].id;
    setClubId(id);

    await getAllMembers(id).then((response) => {
      setMembers(response.data.members);
    });

    await getAllFollowers(id).then((response) => {
      setFollowers(response.data.followers);
    });
  };
  const handleClub = (club:any) => {
      if(user.clubName === club) {
          return true
      }
      return false
  }

  const handleFinish = async (value: any) => {
    const member = members.find((m: any) => m.userId === record);
    const follower = followers.find((f: any) => f.userId === record);

    if (member === undefined) {
      if (follower === undefined) {
        const newFollower: any = await addFollowerWithId(clubId, record);
        await toggleMemberStatus(newFollower.data.id);
      } else {
        await toggleMemberStatus(follower.id);
      }
    }

    const newAdmin: ClubAdmin = {
      id: 0,
      userId: record,
      user: new ClubUser(),
      adminType: new AdminType(),
      clubId: clubId,
    };
    setAdmin(newAdmin);
    setVisibleModal(true);
    setShowModal(false);
  };

  const handleChange = (id: string, userRole: string) => {
    onChange(id, userRole);
    const clubName = clubs.find((r) => r.id === clubId)?.name;
    clubName &&
      NotificationBoxApi.createNotifications(
        [id],
        `Вам була присвоєна нова роль: '${userRole}' в станиці: `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/clubs/${clubId}`,
        clubName
      );
  };

  return (
    <div>
      <Form name="basic" onFinish={handleFinish} form={form}>
        <h4>Оберіть курінь для користувача</h4>
        <Form.Item name="userClub">
          <Select onChange={handleClick}>
            {clubs.map((item: ClubForAdmin) => (              
              item.name === user.clubName ? 
              <Select.Option key={item.id} value={item.name} disabled={handleClub(item)}>
              {item.name}
              </Select.Option> : <> </>
            ))}
          </Select>
        </Form.Item>
        <Form.Item className="cancelConfirmButtons">
          <Row justify="end">
            <Col xs={11} sm={5}>
              <Button key="back" onClick={handleCancel}>
                Відмінити
              </Button>
            </Col>
            <Col
              className="publishButton"
              xs={{ span: 11, offset: 2 }}
              sm={{ span: 6, offset: 1 }}
            >
              <Button type="primary" htmlType="submit">
                Призначити
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <AddAdministratorModal
        admin={admin}
        setAdmin={setAdmin}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        clubId={clubId}
        onChange={handleChange}
      ></AddAdministratorModal>
    </div>
  );
};

export default ChangeUserClubForm;
