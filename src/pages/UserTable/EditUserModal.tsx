import React from 'react';
import { Modal, Button, Checkbox } from 'antd';
import classes from './Table.module.css';

interface Props {
  record: { email: string };
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}
const EditUserModal = ({ record, showModal, setShowModal }: Props) => {
  const handleOk = () => {};
  const handleCancel = () => setShowModal(false);

  return (
    <Modal
      // eslint-disable-next-line react/prop-types
      title={`Права доступу для ${record.email} `}
      visible={showModal}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Закрити
        </Button>,
        <Button
          key="submit"
          type="primary"
          className={classes.addDecision}
          onClick={handleOk}
        >
          Зберегти
        </Button>,
      ]}
    >
      <>
        <Checkbox>Адміністратор подій</Checkbox>
        <br />
        <Checkbox>Голова куреня</Checkbox>
        <br />
        <Checkbox>Голова округу</Checkbox>
        <br />
        <Checkbox>Голова пласту</Checkbox>
        <br />
        <Checkbox>Голова станиці</Checkbox>
        <br />
        <Checkbox>Діловод Куреня</Checkbox>
        <br />
        <Checkbox>Діловод округу</Checkbox>
        <br />
        <Checkbox>Діловод станиці</Checkbox>
        <br />
        <Checkbox>Пластун</Checkbox>
        <br />
        <Checkbox>Прихильник</Checkbox>
      </>
    </Modal>
  );
};

export default EditUserModal;
