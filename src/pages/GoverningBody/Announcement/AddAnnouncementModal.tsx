import React from "react";
import { Drawer } from "antd";
import FormAddAnnouncement from "./FormAddAnnouncement";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (str:string) => void;
}

const AddAnnouncementModal = ({
  visibleModal,
  setVisibleModal,
  onAdd,
}: Props) => {
  const handleCancel = () => {
    setVisibleModal(false);
  };
  return (
    <Drawer
      title="Додати оголошення"
      placement="right"
      width="auto"
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormAddAnnouncement setVisibleModal={setVisibleModal} onAdd={onAdd} />
    </Drawer>
  );
};

export default AddAnnouncementModal;
