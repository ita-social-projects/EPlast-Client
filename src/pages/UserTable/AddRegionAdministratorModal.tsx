import React from "react";
import { Modal } from "antd";
import AddNewAdministratorForm from "./AddRegionAdministratorForm";

interface Props {
  userId: string;
  regionId: number;
  showAdministratorModal: boolean;
  setShowAdministratorModal: (showModal: any) => void;
  roles: string | undefined;
}
const AddRegionAdministratorModal = ({
  userId,
  showAdministratorModal,
  setShowAdministratorModal,
  regionId,
  roles,
}: Props) => {
  return (
    <Modal
      title="Додати в провід округу"
      visible={showAdministratorModal}
      centered
      footer={null}
      onCancel={() => setShowAdministratorModal(false)}
    >
      <AddNewAdministratorForm
        userId={userId}
        regionId={regionId}
        showAdministratorModal={showAdministratorModal}
        setShowAdministratorModal={setShowAdministratorModal}
        roles={roles}
      />
    </Modal>
  );
};

export default AddRegionAdministratorModal;
