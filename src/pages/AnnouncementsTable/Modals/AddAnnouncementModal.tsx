import React from "react";
import { Drawer } from "antd";
import FormAddAnnouncement from "../Forms/FormAddAnnouncement";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
}

const AddAnnouncementModal = ({ visibleModal, setVisibleModal }: Props) => {
  const handleClose = () => {
    setVisibleModal(false);
  };

  return (
    <Drawer
      title="Додати оголошення"
      placement="right"
      width="auto"
      visible={visibleModal}
      onClose={handleClose}
      footer={null}
      closable={false}
    >
      <FormAddAnnouncement setVisibleModal={setVisibleModal} />
    </Drawer>
  );
};

export default AddAnnouncementModal;
