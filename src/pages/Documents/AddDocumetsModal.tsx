import React from 'react';
import { Modal, Drawer } from 'antd';
import FormAddDocument from './FormAddDocument';

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
}

const AddDocumentsModal = ({ visibleModal, setVisibleModal, onAdd }: Props) => {

  const handleCancel = () => setVisibleModal(false);

  return (
    <Drawer
      title="Додати документ"
      placement="right"
      width="auto"
      height={10000}
      visible={visibleModal}
      onClose={handleCancel}
      footer={null}
    >
      <FormAddDocument
        setVisibleModal={setVisibleModal}
        onAdd={onAdd} />
    </Drawer>
  );
};

export default AddDocumentsModal;
