import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Divider, Typography, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  QuestionOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons/lib";
import { showError } from "../../EventsModals";
import { EventParticipant } from "./EventInfo";
import eventsApi from "../../../../api/eventsApi";
import "./ParticipantsTable.less";
import { useHistory, useParams } from "react-router-dom";
import NotificationBoxApi from "../../../../api/NotificationBoxApi";

const { Text } = Typography;

interface Props {
  userAccesses: { [key: string]: boolean };
  isEventFinished: boolean;
  participants: EventParticipant[];
  eventName: string;
  setRender: (render: boolean) => void;
}

const participantStatuses = {
  Approved: "Учасник",
  Undetermined: "Розглядається",
  Rejected: "Відмовлено",
};

const ParticipantsTable = ({
  userAccesses,
  isEventFinished,
  participants,
  eventName,
  setRender,
}: Props) => {
  const { id } = useParams();
  const [Participants, setParticipant] = useState<EventParticipant[]>(
    participants
  );
  const history = useHistory();

  useEffect(() => {
    setParticipant(participants);
  }, [participants]);

  const setTagColor = (status: string) => {
    let color = "";
    if (status === "Відмовлено") {
      color = "red";
    }
    if (status === "Учасник") {
      color = "green";
    }
    if (status === "Розглядається") {
      color = "orange";
    }
    return color;
  };

  const changeStatus = (participantId: number, newStatus: string) => {
    setParticipant(
      Participants.map((participant: EventParticipant) => {
        if (participant.participantId === participantId) {
          participant.status = newStatus;
        }
        setRender(true);
        return participant;
      })
    );
  };

  const changeStatusToApproved = (participantId: number, userId: string) => {
    const approveParticipant = async () => {
      await eventsApi.approveParticipant(participantId);
    };
    approveParticipant()
      .then(() => changeStatus(participantId, participantStatuses.Approved))
      .catch(() => {
        showError();
      });
    NotificationBoxApi.createNotifications(
      [userId],
      "Ви тепер учасник події ",
      NotificationBoxApi.NotificationTypes.EventNotifications,
      `/events/details/${id}`,
      eventName
    );
  };

  const changeStatusToUnderReviewed = (
    participantId: number,
    userId: string
  ) => {
    const underReviewedParticipant = async () => {
      await eventsApi.underReviewParticipant(participantId);
    };
    underReviewedParticipant()
      .then(() => changeStatus(participantId, participantStatuses.Undetermined))
      .catch(() => {
        showError();
      });
    NotificationBoxApi.createNotifications(
      [userId],
      "Ваш статус участі у події змінено на «Розглядається»  ",
      NotificationBoxApi.NotificationTypes.EventNotifications,
      `/events/details/${id}`,
      eventName
    );
  };

  const changeStatusToRejected = (participantId: number, userId: string) => {
    const rejectParticipant = async () => {
      await eventsApi.rejectParticipant(participantId);
    };
    rejectParticipant()
      .then(() => changeStatus(participantId, participantStatuses.Rejected))
      .catch(() => {
        showError();
      });
    NotificationBoxApi.createNotifications(
      [userId],
      "Вам було відмовлено в участі у події ",
      NotificationBoxApi.NotificationTypes.EventNotifications,
      `/events/details/${id}`,
      eventName
    );
  };

  function showRejectModal(participantId: number, userId: string) {
    return Modal.confirm({
      title: "Ви дійсно хочете відмовити цьому користувачу в участі у події?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, відмовити",
      okType: "danger",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
        changeStatusToRejected(participantId, userId);
      },
    });
  }

  const columns: ColumnsType<EventParticipant> = [
    {
      title: "Користувач",
      dataIndex: "fullName",
      key: "user",
      render: (text: any, record) => (
        <div onClick={() => history.push(`/userpage/main/${record.userId}`)}>
          <Text className="participant-table-fullName" strong>
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: any) => <Text strong>{text}</Text>,
    },
    {
      title: "Поточний статус",
      dataIndex: "status",
      key: "status",
      render: (status: any) => (
        <>
          <Tag color={setTagColor(status)} key={status}>
            {status.toUpperCase()}
          </Tag>
        </>
      ),
    },
  ];

  if (userAccesses["ApproveParticipant"] && !isEventFinished) {
    columns.push({
      title: "Змінити статус",
      dataIndex: "changeStatus",
      key: "changeStatus",
      render: (text, record) => (
        <Space size="small">
          {record.status != participantStatuses.Approved ? (
            <Button
              className="approveButton"
              shape="round"
              icon={<UserAddOutlined className="iconParticipant" />}
              size="small"
              onClick={() => {
                changeStatusToApproved(record.participantId, record.userId);
              }}
            />
          ) : (
            <Button
              className="disabledButton"
              shape="round"
              icon={<UserAddOutlined className="iconParticipant" />}
              size="small"
              disabled={true}
            />
          )}
          <Divider type="vertical" />
          {record.status != participantStatuses.Undetermined ? (
            <Button
              className="underReviewButton"
              shape="round"
              icon={<QuestionOutlined className="iconParticipant" />}
              size="small"
              onClick={() => {
                changeStatusToUnderReviewed(
                  record.participantId,
                  record.userId
                );
              }}
            />
          ) : (
            <Button
              className="disabledButton"
              shape="round"
              icon={<QuestionOutlined className="iconParticipant" />}
              size="small"
              disabled={true}
            />
          )}
          <Divider type="vertical" />
          {record.status != participantStatuses.Rejected ? (
            <Button
              className="banButton"
              shape="round"
              icon={<UserDeleteOutlined className="iconParticipant" />}
              size="small"
              onClick={() => {
                showRejectModal(record.participantId, record.userId);
              }}
            />
          ) : (
            <Button
              className="disabledButton"
              shape="round"
              icon={<UserDeleteOutlined className="iconParticipant" />}
              size="small"
              disabled={true}
            />
          )}
        </Space>
      ),
    });
  }

  return <Table columns={columns} dataSource={Participants} />;
};

export default ParticipantsTable;
