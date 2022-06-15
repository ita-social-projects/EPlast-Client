import React from "react";
import { Drawer } from "antd";
import FormEditAnnouncement from "../Forms/FormEditAnnouncement";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
}

const EditAnnouncementModal = ({ visibleModal, setVisibleModal }: Props) => {
  const handleClose = () => {
    setVisibleModal(false);
  };

  return (
    <Drawer
      title="Редагувати оголошення"
      placement="right"
      width="auto"
      visible={visibleModal}
      onClose={handleClose}
      footer={null}
      closable={false}
    >
      <FormEditAnnouncement setVisibleModal={setVisibleModal} />
    </Drawer>
  );
};

export default EditAnnouncementModal;
