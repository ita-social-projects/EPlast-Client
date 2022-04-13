import { Modal } from "antd";
import React from "react";
import DeleteGoverningBodyAdminForm from "./DeleteGoverningBodyAdminForm";

interface Props {
  onChange: (id: string, userRoles: string) => void;
  showModal: boolean;
  setShowModal: (showModal: any) => void;
  user: any;
}

const DeleteGoverningBodyAdminModal = ({
  user,
  showModal,
  setShowModal,
  onChange,
}: Props) => {
  
  return (
    <Modal
      title="Відмінити роль Крайового Адміна з даного користувача?"
      visible={showModal}
      centered
      footer={null}
      onCancel={() => setShowModal(false)}
      destroyOnClose
    >
      <DeleteGoverningBodyAdminForm
        user={user}
        setShowModal={setShowModal}  
        onChange={onChange} 
      />
    </Modal>
  )
};

export default DeleteGoverningBodyAdminModal;