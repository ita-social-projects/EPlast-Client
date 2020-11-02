import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Typography } from "antd";
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
const { Title } = Typography;
const { Option } = Select;

interface Props {
  record: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  onChange: (id: string, userRoles: string) => void;
}

const ChangeUserClubForm = ({
  record,
  showModal,
  setShowModal,
  onChange,
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

  return (
    <div>
      <Form name="basic" onFinish={handleFinish} form={form}>
        <h4>Оберіть курінь для користувача</h4>
        <Form.Item name="userClub">
          <Select onChange={handleClick}>
            {clubs.map((item: ClubForAdmin) => (
              <Option key={item.id} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item style={{ textAlign: "right" }}>
          <Button key="back" onClick={handleCancel}>
            Відмінити
          </Button>
          <Button type="primary" htmlType="submit">
            Змінити
          </Button>
        </Form.Item>
      </Form>
      <AddAdministratorModal
        admin={admin}
        setAdmin={setAdmin}
        visibleModal={visibleModal}
        setVisibleModal={setVisibleModal}
        clubId={clubId}
        onChange={onChange}
      ></AddAdministratorModal>
    </div>
  );
};

export default ChangeUserClubForm;
