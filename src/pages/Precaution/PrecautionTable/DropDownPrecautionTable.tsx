import React, { useEffect } from "react";
import { Menu } from "antd";
import {
  FileSearchOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import classes from "../../DecisionTable/Table.module.css";
import PrecautionStore from "../../../stores/StorePrecaution";
import EditPrecautionModal from "./EditPrecautionModal";
import { createHook } from "react-sweet-state";

const DropDown = () => {
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();

  useEffect(() => {
    if (state.showEditModal) {      
      actions.dropDownFetchData();      
    }
  }, [state.showEditModal]);

  return (
    <>
      <Menu
        onClick={(item: any) => actions.dropDownHandleItemClick(item, actions.handleDeletePrecautionTable)}
        theme="dark"
        selectable={false}
        className={classes.menu}
        style={{
          top: state.pageY,
          left:
            window.innerWidth - (state.pageX + 194) < 0
              ? window.innerWidth - 237
              : state.pageX,
          display: state.showDropdown ? "block" : "none",
        }}
      >
        <Menu.Item key="1">
          <FileSearchOutlined />
          Переглянути профіль
        </Menu.Item>
        {state.recordObj.isActive && state.userAccess["EditActivePrecaution"] && (
          <Menu.Item key="3">
            <EditOutlined />
            Редагувати
          </Menu.Item>
        )}
        {!state.recordObj.isActive && state.userAccess["EditInactivePrecaution"] && (
          <Menu.Item key="3">
            <EditOutlined />
            Редагувати
          </Menu.Item>
        )}
        {state.recordObj.isActive && state.userAccess["DeleteActivePrecaution"] && (
          <Menu.Item key="2">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        )}
        {!state.recordObj.isActive && state.userAccess["DeleteInactivePrecaution"] && (
          <Menu.Item key="2">
            <DeleteOutlined />
            Видалити
          </Menu.Item>
        )}
      </Menu>
      <EditPrecautionModal/>
    </>
  );
};

export default DropDown;
