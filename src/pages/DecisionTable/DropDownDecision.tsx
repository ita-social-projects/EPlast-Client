import React, { useState } from 'react';
import { Menu } from 'antd';
import {
  FilePdfOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import classes from './Table.module.css';
import EditDecisionModal from './EditDecisionModal';
import deleteConfirm from './DeleteConfirm';

interface Props {
  record: { completed: boolean; title: string };
  pageX: number;
  pageY: number;
  showDropdown: boolean;
}

const DropDown = (props: Props) => {
  const { record, pageX, pageY, showDropdown } = props;
  const [showEditModal, setShowEditModal] = useState(false);

  const handleItemClick = (item: any) => {
    switch (item.key) {
      case '1':
        setShowEditModal(true);
        break;
      case '2':
        break;
      case '3':
        deleteConfirm();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Menu
        theme="dark"
        onClick={handleItemClick}
        className={classes.menu}
        style={{
          top: pageY,
          left: pageX,
          display: showDropdown ? 'block' : 'none',
        }}
      >
        <Menu.Item key="1">
          <EditOutlined />
          Редагувати
        </Menu.Item>
        <Menu.Item key="2">
          <FilePdfOutlined />
          Конвертувати в PDF
        </Menu.Item>
        <Menu.Item key="3">
          <DeleteOutlined />
          Видалити
        </Menu.Item>
      </Menu>
      <EditDecisionModal
        record={record}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
      />
    </>
  );
};

export default DropDown;
