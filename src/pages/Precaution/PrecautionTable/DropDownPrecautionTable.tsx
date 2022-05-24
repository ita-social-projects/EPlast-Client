import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import deleteConfirm from "./DeleteConfirm";
import classes from "../../DecisionTable/Table.module.css";
import UserPrecaution from "../Interfaces/UserPrecaution";
import User from "../../../models/UserTable/User";
import precautionApi from "../../../api/precautionApi";
import DropDownProps from "../Interfaces/DropDownPrecautionTableProps";
import EditPrecautionModal from "./EditPrecautionModal";

const DropDown = (props: DropDownProps) => {
  const {
    record,
    userId,
    isRecordActive,
    pageX,
    pageY,
    showDropdown,
    canEditActive,
    canEditInactive,
    canDeleteActive,
    canDeleteInactive,
    onDelete,
    onEdit,
  } = props;
  const [showEditModal, setShowEditModal] = useState(false);
  const [UserPrecautions, setData] = useState<UserPrecaution>({
    id: 0,
    precaution: {
      id: 0,
      name: "",
    },
    precautionId: 0,
    status: "",
    userId: "",
    reporter: "",
    reason: "",
    number: 0,
    date: new Date(),
    endDate: new Date(),
    isActive: true,
    user: new User(),
  });

  useEffect(() => {
    if (showEditModal) {
      const fetchData = async () => {
        await precautionApi
          .getUserPrecautionById(record)
          .then((res) => setData(res.data));
      };
      fetchData();
    }
  }, [showEditModal]);

  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        window.open(`/userpage/main/${userId}`);
        break;
      case "2":
        deleteConfirm(record, onDelete);
        break;
      case "3":
        await setShowEditModal(true);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Menu
        onClick={handleItemClick}
        theme="dark"
        selectable={false}
        className={classes.menu}
        style={{
          top: pageY,
          left:
            window.innerWidth - (pageX + 194) < 0
              ? window.innerWidth - 237
              : pageX,
          display: showDropdown ? "block" : "none",
        }}
      >
        <Menu.Item key="1">
          <FileSearchOutlined />
          Переглянути профіль
        </Menu.Item>
        {isRecordActive && canEditActive && (
          <Menu.Item key="3">
            <EditOutlined />
            Редагувати
          </Menu.Item>
        )}
        {!isRecordActive && canEditInactive &&(
          <Menu.Item key="3">
            <EditOutlined />
            Редагувати
          </Menu.Item>
        )}
        {isRecordActive && canDeleteActive && (
          <Menu.Item key="2">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        )}
        {!isRecordActive && canDeleteInactive && (
          <Menu.Item key="2">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        )}
        
      </Menu>
      <EditPrecautionModal
        record={record}
        Precaution={UserPrecautions}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        onEdit={onEdit}
      />
    </>
  );
};

export default DropDown;
