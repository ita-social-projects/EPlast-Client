import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import activeMembershipApi, {
  PlastDegree,
  UserPlastDegree,
} from "../../../../api/activeMembershipApi";
import FormAddPlastDegree from "./FormAddPlastDegree";

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

  const handleCancel = () => {
    props.setVisibleModal(false);
    setCancel(true);
  };

  const getAvailablePlastDegree = (
    allDegrees: Array<PlastDegree>,
    userPlastDegree: UserPlastDegree
  ): Array<PlastDegree> => {
    setCancel(false);
    const aupd: Array<PlastDegree> = [];
    allDegrees.forEach((d) => {
      if (userPlastDegree?.plastDegree?.id !== d.id) {
        aupd.push(d);
      }
    });
    return aupd;
  };

  const fetchData = async () => {
    console.log(props.userId);
    await activeMembershipApi.getAllPlastDegrees().then((response) => {setPlastDegrees(response)});
    await activeMembershipApi.getUserPlastDegree(props.userId).then((response) => setCurrentUserDegree(response));
  };

  useEffect(() => {
    if (props.visibleModal) fetchData();
  }, [props.visibleModal]);

  return (
    <Modal
      visible={props.visibleModal}
      onCancel={handleCancel}
      title="Прийняття пластуна до"
      footer={null}
    >
      <FormAddPlastDegree
        handleAddDegree={props.handleAddDegree}
        userId={props.userId}
        setVisibleModal={props.setVisibleModal}
        plastDegrees={plastDegrees}
        currentUserDegree={currentUserDegree}
        resetAvailablePlastDegree={fetchData}
        cancel={cancel}
      />
    </Modal>
  );
};

export default ModalAddPlastDegree;
