import React from "react";
import { Menu } from "antd";
import { FilePdfOutlined, FileSearchOutlined } from "@ant-design/icons";
import Props from "./SavedDropdownProps";
import styles from "../Dropdown.module.css";

const ConfirmedDropdown = (props: Props) => {
    const { record, pageX, pageY, showDropdown, onView } = props;

    const handleClick = (item: any) => {
        switch (item.key) {
            case "1":
                onView(record.id);
                break;
            case "2":
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Menu
                theme="dark"
                onClick={handleClick}
                className={showDropdown ? styles.menu : styles.menuHidden}
                style={{
                    position: "absolute",
                    top: pageY,
                    left: pageX,
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
        </>
    );
};

export default ConfirmedDropdown;
