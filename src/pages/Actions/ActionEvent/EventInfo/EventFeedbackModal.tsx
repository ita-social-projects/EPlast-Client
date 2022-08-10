import { LoadingOutlined } from "@ant-design/icons";
import { Avatar, Comment, Divider, Modal, Rate } from "antd";
import React, { useEffect, useState } from "react";
import UserApi from "../../../../api/UserApi";
import EventFeedback from "../../../../models/EventUser/EventFeedback";
import "./EventFeedbackModal.less";

interface Properties {
  feedbacks: EventFeedback[];
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  canLeaveFeedback: boolean;
}

interface FeedbackProperties {
  feedback: EventFeedback;
}

const Feedback: React.FC<FeedbackProperties> = (p: FeedbackProperties) => {
  const [avatar, setAvatar] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    UserApi.getImage(p.feedback.authorAvatarUrl).then((response) =>
      setAvatar(response.data)
    );
    setLoading(false);
  }, []);

  return (
    <Comment
      className="feedback"
      actions={[]}
      author={p.feedback.authorName}
      avatar={loading ? <LoadingOutlined /> : <Avatar src={avatar} />}
      content={p.feedback.text}
      datetime={
        <Rate
          className="feedbackRate"
          allowHalf
          disabled
          defaultValue={p.feedback.rating}
        />
      }
    />
  );
};

const EventFeedbackModal: React.FC<Properties> = (p: Properties) => {
  const [feedbacks, setFeedbacks] = useState<EventFeedback[]>(p.feedbacks);

  useEffect(() => {}, []);

  return (
    <Modal
      visible={p.visible}
      footer={null}
      onCancel={() => p.setVisible(false)}
    >
      {p.feedbacks.map((f, idx) => {
        return (
          <>
            <Feedback feedback={f} />
            {idx < p.feedbacks.length - 1 ? (
              <Divider style={{ margin: 6 }} />
            ) : null}
          </>
        );
      })}
    </Modal>
  );
};

export default EventFeedbackModal;
