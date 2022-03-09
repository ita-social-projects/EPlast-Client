import React from "react";
import { Drawer } from "antd";
import FormEditSubsection from "./FormEditSubsection";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  id: number;
  sectId: number;
  title: string;
  description: string;
  fetchSubData: Function;
  editKey: number;
  setEditKey: any;
}

const EditSubsectionModal = ({
  visibleModal,
  setVisibleModal,
  id,
  sectId,
  title,
  description,
  fetchSubData,
  editKey,
  setEditKey,
}: Props) => {
  const handleCancel = () => {
    setVisibleModal(false);
  };
  return (
    <Drawer
      width="auto"
      title="Редагувати підрозділ"
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormEditSubsection
        setVisibleModal={setVisibleModal}
        id={id}
        sectId={sectId}
        title={title}
        description={description}
        fetchSubData={fetchSubData}
        editKey={editKey}
        setEditKey={setEditKey}
      />
    </Drawer>
  );
};

export default EditSubsectionModal;
