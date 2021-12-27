import React from "react";
import { Menu } from "antd";
import { FilePdfOutlined, FileSearchOutlined } from "@ant-design/icons";
import Props from "./SavedDropdownProps";
import styles from "../Dropdown.module.css";

const ConfirmedDropdown = (props: Props) => {
    const {
        record,
        pageX,
        pageY,
        userAnnualReportAccess,
        showDropdown,
        onViewPDF,
        onView,
    } = props;

    const handleClick = (item: any) => {
        switch (item.key) {
            case "1":
                onView(record.id);
                break;
            case "2":
                onViewPDF(record.id);
                break;
            default:
                break;
        }
    };

    return (
        <>
            {userAnnualReportAccess?.CanViewCityReportsTable && 
                userAnnualReportAccess?.CanViewReportDetails ? (
                <Menu
                    theme="dark"
                    onClick={handleClick}
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
                    <Menu.Item key="2">
                        <FilePdfOutlined />
                        Переглянути у форматі PDF
                    </Menu.Item>
                </Menu>
            ) : null}
        </>
    );
};

export default ConfirmedDropdown;
