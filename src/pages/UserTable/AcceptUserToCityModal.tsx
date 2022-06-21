import React from "react";
import { Modal } from "antd";
import AcceptUserToCityForm from "./AcceptUserToCityForm";

interface Props {
  onChange: (id: string, userRoles: string) => void;
  record: string;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  user: any;
}
const AcceptUserToCityModal = ({
  record,
  showModal,
  setShowModal,
  onChange,
}: Props) => {
  return (
    <Modal
      title="Додати зголошеного в станицю"
      visible={showModal}
      centered
      footer={null}
      onCancel={() => setShowModal(false)}
    >
      <AcceptUserToCityForm
        onChange={onChange}
        record={record}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </Modal>
  );
};

export default AcceptUserToCityModal;
