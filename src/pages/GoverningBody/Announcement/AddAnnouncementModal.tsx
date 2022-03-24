import React from "react";
import { Drawer } from "antd";
import FormAddAnnouncement from "./FormAddAnnouncement";
import GoverningBodyAnnouncement from "../../../models/GoverningBody/GoverningBodyAnnouncement";

interface Props {
  governingBodyId: number,
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (title: string, text: string, images: string[], gvbId: number, sectorId: number) => void;
}

const AddAnnouncementModal = ({
  governingBodyId,
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
      <FormAddAnnouncement 
        setVisibleModal={setVisibleModal} 
        onAdd={onAdd} 
        governingBodyId={governingBodyId}
        />
    </Drawer>
  );
};

export default AddAnnouncementModal;
