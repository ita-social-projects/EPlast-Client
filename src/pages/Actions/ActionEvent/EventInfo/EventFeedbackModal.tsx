import {
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Comment,
  Divider,
  Empty,
  Modal,
  Pagination,
  Popconfirm,
  Rate,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useRef, useState } from "react";
import eventsApi from "../../../../api/eventsApi";
import UserApi from "../../../../api/UserApi";
import EventFeedback from "../../../../models/EventUser/EventFeedback";
import { Roles } from "../../../../models/Roles/Roles";
import "./EventFeedbackModal.less";

interface Properties {
  eventId: number;
  feedbacks: EventFeedback[];
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  canLeaveFeedback: boolean;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FeedbackProperties {
  eventId: number;
  feedback: EventFeedback;
  isAdmin: boolean;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: string;
}

interface LeaveFeedbackProperties {
  eventId: number;
  feedbacks: EventFeedback[];
  setFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setRender: React.Dispatch<React.SetStateAction<boolean>>;
}

const Feedback: React.FC<FeedbackProperties> = (p: FeedbackProperties) => {
  const [avatar, setAvatar] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  const checkPermissions = async () => {
    if (p.isAdmin) {
      setCanDelete(true);
      return;
    }

    setCanDelete(p.currentUserId === p.feedback.authorUserId);
  };

  const fetchData = async () => {
    setLoading(true);
    let image = await UserApi.getImage(p.feedback.authorAvatarUrl);
    setAvatar(image.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    checkPermissions();
  }, []);

  const handleDelete = () => {
    eventsApi.deleteFeedback(p.eventId, p.feedback.id).then(() => {
      p.setRender((prev) => !prev);
    });
  };

  return (
    <>
      <Comment
        className="feedback"
        actions={[]}
        author={p.feedback.authorName}
        avatar={
          loading ? (
            <Avatar icon={<LoadingOutlined />} />
          ) : (
            <Avatar src={avatar} />
          )
        }
        content={p.feedback.text}
        datetime={
          <div className="feedbackActions">
            <Rate
              className="feedbackRate"
              allowHalf
              disabled
              defaultValue={p.feedback.rating}
            />
            {canDelete ? (
              <Popconfirm
                title="Видалити відгук?"
                okText="Так"
                cancelText="Ні"
                onConfirm={() => handleDelete()}
                icon={null}
                okButtonProps={{ danger: true }}
                placement={"leftTop"}
              >
                <CloseOutlined />
              </Popconfirm>
            ) : null}
          </div>
        }
      />
    </>
  );
};

const FeedbackForm: React.FC<LeaveFeedbackProperties> = (
  p: LeaveFeedbackProperties
) => {
  const [avatar, setAvatar] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [isButtonLoading, setButtonLoading] = useState<boolean>(false);

  const [rating, setRating] = useState<number>(-1);
  const [feedbackText, setFeedbackText] = useState<string>("");

  const [isRatingErrorShown, setRatingErrorShown] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    let userProfile = await UserApi.getActiveUserProfile();
    console.log(userProfile);
    let userImage = await UserApi.getImage(userProfile.imagePath);
    setAvatar(userImage.data);
    setName(userProfile.firstName + " " + userProfile.lastName);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async () => {
    if (rating === -1) {
      setRatingErrorShown(true);
      return;
    }

    if (isRatingErrorShown) {
      return;
    }

    setButtonLoading(true);

    let feedback: EventFeedback = new EventFeedback();
    feedback.rating = rating;
    feedback.text = feedbackText;

    try {
      await eventsApi.leaveFeedback(p.eventId, feedback);
      p.setFormVisible(false);
      p.setRender((prev) => !prev);
    } finally {
      setButtonLoading(false);
    }
  };

  const onChangeRating = (v: number) => {
    setRating(v);
    setRatingErrorShown(false);
  };

  const onChangeText = (v: string) => {
    setRatingErrorShown(v.length === 0);
    setFeedbackText(v);
  };

  return (
    <Comment
      className="feedbackForm"
      actions={[]}
      author={name}
      avatar={
        loading ? (
          <Avatar icon={<LoadingOutlined />} />
        ) : (
          <Avatar src={avatar} />
        )
      }
      content={
        <>
          <TextArea
            style={{ marginBottom: 8 }}
            rows={4}
            autoSize={{ minRows: 4, maxRows: 4 }}
            maxLength={256}
            minLength={1}
            placeholder={"Текст відгуку (максимальна довжина - 256 символів)"}
            onChange={(evt) => onChangeText(evt.target.value)}
          />
          <div className="feedbackFooter">
            <span className={`errorText${isRatingErrorShown ? "" : " hidden"}`}>
              <ExclamationCircleOutlined /> Поля оцінки та тексту відгука є
              обов'язковими
            </span>
            <Button
              type={"primary"}
              onClick={() => onSubmit()}
              loading={isButtonLoading}
            >
              Залишити відгук
            </Button>
          </div>
        </>
      }
      datetime={
        <Rate
          className="feedbackRate"
          allowHalf
          defaultValue={rating}
          onChange={(v) => onChangeRating(v)}
        />
      }
    />
  );
};

const EventFeedbackModal: React.FC<Properties> = (p: Properties) => {
  const [isFeedbackFormVisible, setFeedbackFormVisible] = useState<boolean>(
    true
  );

  const currentUserId = useRef<string>();
  const [isUserAdmin, setUserAdmin] = useState<boolean>(false);
  const [userHasFeedbackAlready, setUserHasFeedbackAlready] = useState<boolean>(
    false
  );

  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  useEffect(() => {
    currentUserId.current = UserApi.getActiveUserId();

    let roles = UserApi.getActiveUserRoles();
    setUserAdmin(roles.includes(Roles.Admin));
  }, [p.feedbacks]);

  useEffect(() => {
    setUserHasFeedbackAlready(
      p.feedbacks.some((f) => f.authorUserId == currentUserId.current)
    );
  }, [p.feedbacks]);

  return (
    <Modal
      className="ant-feedback-modal"
      title={"Відгуки"}
      visible={p.visible}
      footer={
        p.feedbacks.length > 5 ? (
          <Pagination
            onChange={(p) => setPage(p)}
            defaultCurrent={1}
            current={page}
            total={p.feedbacks.length}
            defaultPageSize={pageSize}
          />
        ) : null
      }
      onCancel={() => p.setVisible(false)}
    >
      {!userHasFeedbackAlready ? (
        p.canLeaveFeedback ? (
          <>
            <FeedbackForm
              setRender={p.setRender}
              eventId={p.eventId}
              feedbacks={p.feedbacks}
              setFormVisible={setFeedbackFormVisible}
            />
            <Divider style={{ margin: 6 }} />
          </>
        ) : (
          <>
            <div className="feedback-forbidden-warning">
              <InfoCircleFilled className="warning-icon" />
              <p className="feedback-forbidden-description">
                Відгук можна залишити протягом 3-х днів після закінчення події і
                тільки в тому випадку, якщо ви її відвідали.
              </p>
            </div>
            <Divider />
          </>
        )
      ) : null}
      {p.feedbacks.length !== 0 ? (
        p.feedbacks
          .sort((a, b) => b.id - a.id)
          .map((f, idx) => {
            return idx + 1 <= pageSize * page &&
              idx + 1 > pageSize * (page - 1) ? (
              <>
                <Feedback
                  key={f.id}
                  feedback={f}
                  currentUserId={currentUserId.current as string}
                  isAdmin={isUserAdmin}
                  eventId={p.eventId}
                  setRender={p.setRender}
                />
                {idx + 1 < pageSize * page && idx + 1 !== p.feedbacks.length ? (
                  <Divider style={{ margin: 6 }} />
                ) : null}
              </>
            ) : null;
          })
      ) : (
        <Empty
          description="Відгуків немає"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Modal>
  );
};

export default EventFeedbackModal;
