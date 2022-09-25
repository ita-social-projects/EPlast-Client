import {
  DeleteOutlined,
  EditOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { useDistinctions } from "../../../stores/DistinctionsStore";
import classes from "../../DecisionTable/Table.module.css";
import deleteConfirm from "./DeleteConfirm";
import EditDistinctionModal from "./EditDistinctionModal";

interface Props {
  isDropdownShown: boolean;
  pageX: number;
  pageY: number;
}

const DropDown = ({ isDropdownShown, pageX, pageY }: Props) => {
  const [state, actions] = useDistinctions();

  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        window.open(`/userpage/main/${state.currentUserDistinction.userId}`);
        break;
      case "2":
        deleteConfirm(
          state.currentUserDistinction.id,
          actions.deleteUserDistinction
        );
        break;
      case "3":
        await actions.openUserDistinctionEditModal();
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
          top:
            window.innerHeight - (pageY + 144) < 0
              ? window.innerHeight - 154
              : pageY,
          left:
            window.innerWidth - (pageX + 194) < 0
              ? window.innerWidth - 237
              : pageX,
          display: isDropdownShown ? "block" : "none",
        }}
      >
        <Menu.Item key="1">
          <FileSearchOutlined />
          Переглянути профіль
        </Menu.Item>
        {state.userDistinctionsAccess["EditTypeDistinction"] ? (
          <Menu.Item key="3">
            <EditOutlined />
            Редагувати
          </Menu.Item>
        ) : (
          <></>
        )}
        {state.userDistinctionsAccess["EditTypeDistinction"] ? (
          <Menu.Item key="2">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        ) : (
          <></>
        )}
      </Menu>
      <EditDistinctionModal />
    </>
  );
};

export default DropDown;
