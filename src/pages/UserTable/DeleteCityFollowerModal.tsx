import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { InfoCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { getAllFollowers, removeFollower } from "../../api/citiesApi";
import "./DeleteCityFollowerModal.less";

interface Props {
  onChange: (id: string, userRoles: string) => void;
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  user: any;
}
const DeleteCityFollowerModal = (props: Props) => {
    const [comment, setComment] = useState<string>(props.user?.comment);
    const [isSecondaryLoading, setSecondaryLoading] = useState<boolean>(false);
    const [isPrimaryLoading, setPrimaryLoading] = useState<boolean>(false);
    
    const handleDelete = async (hasComment: boolean) => {
      if (hasComment && comment === "") return;
      
      if (hasComment) setPrimaryLoading(true);
      else setSecondaryLoading(true);
      let followersData = (await getAllFollowers(props.user.cityId)).data;
      let follower = followersData?.followers.find((itm: any) => itm.userId === props.user.id);

      if (!follower) return;

      await removeFollower(follower.id, hasComment ? comment : "");
      
      if (hasComment) setPrimaryLoading(false);
      else setSecondaryLoading(false);
      props.onChange("", "");
      props.setShowModal(false);
    }

    useEffect(() => {
      setComment(props.user?.comment)
    }, [props.user?.comment])

    return (
      <Modal className="deleteCityFollower"
        title="Відхилити зголошення користувача"
        visible={props.showModal}
        centered
        footer={[
          <Button loading={isSecondaryLoading} onClick={() => handleDelete(false)}>Видалити без коментаря</Button>,
          <Button loading={isPrimaryLoading} type="primary" onClick={() => handleDelete(true)}>Видалити та надіслати коментар</Button>
        ]}
        onCancel={() => props.setShowModal(false)}
      >
          <InfoCircleFilled style={{fontSize: "2em", color: "orange", float: "left", paddingRight: "10px", paddingTop: "7px"}}/>
          <p style={{textAlign: "justify", fontSize: "1em"}}>
              Ви можете додати коментар, пояснюючи причину відхилення зголошення нижче,
              або відхилити зголошення без надання коментаря.
          </p>
          <TextArea name="test" rows={4} value={comment} maxLength={256} onChange={evt => setComment(evt.target.value)}/>
      </Modal>
    );
};

export default DeleteCityFollowerModal;