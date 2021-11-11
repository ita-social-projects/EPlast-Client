import React, { useState, useEffect } from "react";
import { Table, Tag, Space, Button, Divider, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  QuestionOutlined,
} from "@ant-design/icons/lib";
import { showError } from "../../EventsModals";
// eslint-disable-next-line import/no-cycle
import { EventParticipant } from "./EventInfo";
import eventsApi from "../../../../api/eventsApi";
import "./ParticipantsTable.less";
import { useHistory } from "react-router-dom";

const { Text } = Typography;

interface Props {
  userAccesses: { [key: string]: boolean; }
  isEventFinished: boolean;
  participants: EventParticipant[];
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
  setRender,
}: Props) => {

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
          // eslint-disable-next-line no-param-reassign
          participant.status = newStatus;
        }
        return participant;
      })
    );
  };

  const changeStatusToApproved = (participantId: number) => {
    const approveParticipant = async () => {
      await eventsApi.approveParticipant(participantId);
    };
    approveParticipant()
      .then(() => changeStatus(participantId, participantStatuses.Approved))
      .catch(() => {
        showError();
      });
  };

  const changeStatusToUnderReviewed = (participantId: number) => {
    const underReviewedParticipant = async () => {
      await eventsApi.underReviewParticipant(participantId);
    };
    underReviewedParticipant()
      .then(() => changeStatus(participantId, participantStatuses.Undetermined))
      .catch(() => {
        showError();
      });
  };

  const changeStatusToRejected = (participantId: number) => {
    const rejectParticipant = async () => {
      await eventsApi.rejectParticipant(participantId);
    };
    rejectParticipant()
      .then(() => changeStatus(participantId, participantStatuses.Rejected))
      .catch(() => {
        showError();
      });
  };

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
          <Button
            className="approveButton"
            shape="round"
            icon={<UserAddOutlined className="iconParticipant" />}
            size="small"
            onClick={() => {
              changeStatusToApproved(record.participantId);
            }}
          />
          <Divider type="vertical" />
          <Button
            className="underReviewButton"
            shape="round"
            icon={<QuestionOutlined className="iconUnderReview" />}
            size="small"
            onClick={() => {
              changeStatusToUnderReviewed(record.participantId);
            }}
          />
          <Divider type="vertical" />
          <Button
            className="banButton"
            shape="round"
            icon={<UserDeleteOutlined className="iconParticipant" />}
            size="small"
            onClick={() => {
              changeStatusToRejected(record.participantId);
              setRender(true);
            }}
          />
        </Space>
      ),
    });
  }

  return <Table columns={columns} dataSource={Participants} />;
};

export default ParticipantsTable;
