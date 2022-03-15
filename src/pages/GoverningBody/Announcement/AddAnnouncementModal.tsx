import React from "react";
import { Drawer } from "antd";
import FormAddAnnouncement from "./FormAddAnnouncement";
import ButtonCollapse from "../../../components/ButtonCollapse/ButtonCollapse";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (text: string, images: string[]) => void;
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
        closable={false}
        width="auto"
        title="Додати оголошення"
        visible={visibleModal}
        onClose={handleCancel}
        footer={null}
      >
         <FormAddAnnouncement setVisibleModal={setVisibleModal} onAdd={onAdd} />
      </Drawer>
  );
};

export default AddAnnouncementModal;
