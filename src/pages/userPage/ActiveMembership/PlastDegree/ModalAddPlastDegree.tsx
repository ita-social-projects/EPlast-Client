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
const ModalAddPlastDegree = ({
  visibleModal,
  setVisibleModal,
  isCityAdmin,
  userId,
  handleAddDegree,
}: ModalAddPlastDegreeProps) => {
  const [availablePlastDegree, setAvailablePlastDegree] = useState<
    Array<PlastDegree>
  >([]);
  const [cancel, setCancel] = useState<boolean>(false);

  const handleCancel = () => {
    setVisibleModal(false);
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
    await activeMembershipApi.getAllPlastDegrees().then(async (response) => {
      await activeMembershipApi.getUserPlastDegree(userId).then((res) => {
        setAvailablePlastDegree(getAvailablePlastDegree(response, res));
      });
    });
  };
  useEffect(() => {
    fetchData();
  }, [userId]);
  return (
    <Modal
      visible={visibleModal}
      onCancel={handleCancel}
      title="Надання Пластового ступеня"
      footer={null}
    >
      <FormAddPlastDegree
        handleAddDegree={handleAddDegree}
        userId={userId}
        isCityAdmin={isCityAdmin!}
        setVisibleModal={setVisibleModal}
        availablePlastDegree={availablePlastDegree}
        resetAvailablePlastDegree={fetchData}
        cancel={cancel}
      />
    </Modal>
  );
};

export default ModalAddPlastDegree;
