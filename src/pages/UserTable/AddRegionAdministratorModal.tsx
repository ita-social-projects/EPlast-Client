import React from "react";
import { Modal } from "antd";
import AddNewAdministratorForm from "./AddRegionAdministratorForm";

interface Props {
  userId: string;
  regionId: number;
  showAdministratorModal: boolean;
  setShowAdministratorModal: (showModal: any) => void;
  roles: string | undefined;
  onChange: (id: string, userRoles: string) => void;
}
const AddRegionAdministratorModal = ({
  userId,
  showAdministratorModal,
  setShowAdministratorModal,
  regionId,
  roles,
  onChange,
}: Props) => {
  return (
    <Modal
      title="Додати в провід округи"
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
        onChange={onChange}
      />
    </Modal>
  );
};

export default AddRegionAdministratorModal;
