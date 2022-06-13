import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import activeMembershipApi, {
  PlastDegree,
  UserPlastDegree,
} from "../../../../api/activeMembershipApi";
import FormAddPlastDegree from "./FormAddPlastDegree";
import { LoadingOutlined } from "@ant-design/icons";

type ModalAddPlastDegreeProps = {
  userId: string;
  visibleModal: boolean;
  isCityAdmin?: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  handleAddDegree: () => void;
};

const ModalAddPlastDegree = (props: ModalAddPlastDegreeProps) => {
  const [plastDegrees, setPlastDegrees] = useState<Array<PlastDegree>>([]);
  const [currentUserDegree, setCurrentUserDegree] = useState<UserPlastDegree>();
  const [cancel, setCancel] = useState<boolean>(false);
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  const handleCancel = () => {
    props.setVisibleModal(false);
    setIsUserDataLoaded(false);
    setCancel(true);
  };

  const fetchData = async () => {
    await activeMembershipApi.getAllPlastDegrees().then((response) => {setPlastDegrees(response)});
    await activeMembershipApi.getUserPlastDegree(props.userId).then((response) => setCurrentUserDegree(response));
    setIsUserDataLoaded(true);
  };

  useEffect(() => {
    if (props.visibleModal) fetchData();
  }, [props.visibleModal]);

  return (
    <Modal
      visible={props.visibleModal}
      onCancel={handleCancel}
      title="Редагування ступіню"
      footer={null}
    >
      {isUserDataLoaded ? <FormAddPlastDegree
        handleAddDegree={props.handleAddDegree}
        userId={props.userId}
        setVisibleModal={props.setVisibleModal}
        plastDegrees={plastDegrees}
        currentUserDegree={currentUserDegree}
        resetAvailablePlastDegree={fetchData}
        cancel={cancel}
        isModalVisible={props.visibleModal}
      /> : <LoadingOutlined style={{fontSize: 24}}/> }
    </Modal>
  );
};

export default ModalAddPlastDegree;
