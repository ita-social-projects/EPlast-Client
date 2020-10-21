import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ScissorOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import classes from "./UserTable.module.css";
import userDeleteCofirm from "./UserDeleteConfirm";
import ChangeUserRoleModal from "./ChangeUserRoleModal";
import adminApi from "../../api/adminApi";
const { SubMenu } = Menu;

interface Props {
  record: string;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete: (id: string) => void;
  onChange: (id: string, userRoles: string) => void;
}

const DropDown = (props: Props) => {
  const history = useHistory();
  const { record, pageX, pageY, showDropdown, onDelete, onChange } = props;
  const [showEditModal, setShowEditModal] = useState(false);

  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        await history.push(`/userpage/main/${record}`);
        break;
      case "2":
        await userDeleteCofirm(record, onDelete);
        break;
      case "3":
        await setShowEditModal(true);
        break;
      case "4":
        await adminApi.putExpiredRole(record);
        break;
      default:
        break;
    }
    item.key = "0";
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
          display: showDropdown ? "block" : "none",
        }}
      >
        <Menu.Item key="1">
          <FileSearchOutlined />
          Переглянути профіль
        </Menu.Item>
        <Menu.Item key="2">
          <DeleteOutlined />
          Видалити
        </Menu.Item>
        <Menu.Item key="3">
          <EditOutlined />
          Змінити права доступу
        </Menu.Item>
        <SubMenu icon={<EditOutlined />} title="Змінити права доступу" >
          <Menu.Item>Провід станиці</Menu.Item>
          <Menu.Item>Провід округу</Menu.Item>
          <Menu.Item>Провід куреня</Menu.Item>
          <Menu.Item>Адміністрація подій</Menu.Item>
          <Menu.Item>Поточний стан користувача</Menu.Item>
        </SubMenu>
        <Menu.Item key="4">
          <ScissorOutlined />
          Заархівувати користувача
        </Menu.Item>
        <ChangeUserRoleModal
          record={record}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          onChange={onChange}
        />
      </Menu>
    </>
  );
};

export default DropDown;
