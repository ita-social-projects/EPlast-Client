import React from "react";
import { Menu } from "antd";
import {
  FileSearchOutlined,
  FileSyncOutlined,
  FileDoneOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Props from "./UnconfirmedRegionDropdownProps";
import styles from "../Dropdown.module.css";

const UnconfirmedRegionDropdown = (props: Props) => {
  const {
    regionRecord,
    pageX,
    pageY,
    showDropdown,
    userAnnualReportAccess,
    onView,
    onEdit,
    onConfirm,
    onRemove,
  } = props;

  const handleClick = (item: any) => {
    switch (item.key) {
      case "1":
        if (
          userAnnualReportAccess?.CanViewRegionReportsTable &&
          userAnnualReportAccess?.CanViewReportDetails
        ) {
          onView(regionRecord.id, new Date(regionRecord.date).getFullYear());
        }
        break;
      case "2":
        if (userAnnualReportAccess?.CanEditReport) {
          onEdit(regionRecord.id, new Date(regionRecord.date).getFullYear());
        }
        break;
      case "3":
        if (userAnnualReportAccess?.CanChangeReportStatus) {
          onConfirm(regionRecord.id);
        }
        break;
      case "4":
        if (userAnnualReportAccess?.CanDeleteReport) {
          onRemove(regionRecord.id);
        }
        break;
      default:
        break;
    }
  };

  return (
    <>
      {userAnnualReportAccess?.CanViewRegionReportsTable &&
      userAnnualReportAccess?.CanViewReportDetails ? (
        <Menu
          theme="dark"
          onClick={handleClick}
          selectedKeys={[]}
          className={showDropdown ? styles.menu : styles.menuHidden}
          style={{
            top: pageY - 185,
            left: pageX - 36,
          }}
        >
          <Menu.Item key="1">
            <FileSearchOutlined />
            Переглянути
          </Menu.Item>
          {userAnnualReportAccess?.CanEditReport ? (
            <Menu.Item key="2">
              <FileSyncOutlined />
              Редагувати
            </Menu.Item>
          ) : null}
          {userAnnualReportAccess?.CanChangeReportStatus ? (
            <Menu.Item key="3">
              <FileDoneOutlined />
              Підтвердити
            </Menu.Item>
          ) : null}
          {userAnnualReportAccess?.CanDeleteReport ? (
            <Menu.Item key="4">
              <DeleteOutlined />
              Видалити
            </Menu.Item>
          ) : null}
        </Menu>
      ) : null}
    </>
  );
};

export default UnconfirmedRegionDropdown;
