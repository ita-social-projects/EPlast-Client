import React, { useState, useEffect } from "react";
import { Drawer, Menu, Modal } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
  ScissorOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import classes from "./Table.module.css";
import deleteConfirm from "./DeleteConfirm";

import UpdateKadraForm from "./UpdateKadraForm";
import ClickAwayListener from "react-click-away-listener";
import jwt from "jwt-decode";
import kadrasApi from "../../api/KadraVykhovnykivApi";
import AuthStore from "../../stores/AuthStore";
import { Roles } from "../../models/Roles/Roles";

interface Props {
  record: any;
  pageX: number;
  pageY: number;
  setShowDropdown: (view: boolean) => void;
  onDelete: () => void;
  showDropdown: boolean;
  onEdit: () => void;
}

const DropDown = (props: Props) => {
  const history = useHistory();
  let user: any;
  let curToken = AuthStore.getToken() as string;
  let roles: string[] = [""];
  user = curToken !== null ? (jwt(curToken) as string) : "";
  roles =
    curToken !== null
      ? (user[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] as string[])
      : [""];

  const {
    record,
    pageX,
    pageY,
    showDropdown,
    onDelete,
    setShowDropdown,
    onEdit,
  } = props;
  const [canEdit] = useState(roles.includes(Roles.Admin));
  const [visibleEdit, setvisibleEdit] = useState<boolean>(false);

  const [selectUserId, SetselectUserId] = useState<string>();

  const handleOkEdit = () => {
    setvisibleEdit(false);
  };

  const handleCancelEdit = () => {
    setvisibleEdit(false);
  };

  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "2":
        setvisibleEdit(true);
        setShowDropdown(false);
        break;
      case "1":
        deleteConfirm(record.id, onDelete);
        setShowDropdown(false);
        break;
      case "3":
        await kadrasApi.findUserByEduStaff(record.id).then((response) => {
          window.open(`/userpage/main/${response.data}`);
        });

        break;
      default:
        break;
    }
    item.key = "0";
  };

  return (
    <>
      <Menu
        onClick={handleItemClick}
        className={classes.menu}
        theme="dark"
        style={{
          top: pageY,
          left:
            window.innerWidth - (pageX + 194) < 0
              ? window.innerWidth - 275
              : pageX,
          display: showDropdown ? "block" : "none",
        }}
      >
        <Menu.Item key="3">
          <FileSearchOutlined />
          Переглянути профіль
        </Menu.Item>
        {canEdit ? (
          <Menu.Item key="2">
            <EditOutlined />
            Редагувати
          </Menu.Item>
        ) : null}
        {canEdit ? (
          <Menu.Item key="1">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        ) : null}
      </Menu>

      <Drawer
        width="auto"
        title="Змінити кадру виховників"
        visible={visibleEdit}
        onClose={handleCancelEdit}
        footer={null}
      >
        <UpdateKadraForm
          record={record}
          onAdd={handleCancelEdit}
          onEdit={onEdit}
          showModal={setvisibleEdit}
        ></UpdateKadraForm>
      </Drawer>
    </>
  );
};

export default DropDown;
