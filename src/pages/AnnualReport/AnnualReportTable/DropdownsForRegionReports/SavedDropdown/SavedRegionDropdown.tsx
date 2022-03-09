import React from "react";
import { Menu } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import Props from "./SavedRegionDropdownProps";
import styles from "../Dropdown.module.css";

const SavedRegionDropdown = (props: Props) => {
  const {
    regionRecord,
    pageX,
    pageY,
    userAnnualReportAccess,
    showDropdown,
    onView,
  } = props;

  const handleClick = (item: any) => {
    switch (item.key) {
      case "1":
        onView(regionRecord.id, new Date(regionRecord.date).getFullYear());
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
          className={showDropdown ? styles.menu : styles.menuHidden}
          style={{
            position: "absolute",
            top: pageY - 185,
            left: pageX - 36,
          }}
        >
          <Menu.Item key="1">
            <FileSearchOutlined />
            Переглянути
          </Menu.Item>
        </Menu>
      ) : null}
    </>
  );
};

export default SavedRegionDropdown;
