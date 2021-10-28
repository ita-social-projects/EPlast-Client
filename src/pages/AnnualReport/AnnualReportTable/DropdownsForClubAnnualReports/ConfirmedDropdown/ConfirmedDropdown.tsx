import React from "react";
import { Menu } from "antd";
import {
    FileSearchOutlined,
    FileExcelOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";
import Props from "./ConfirmedDropdownProps";
import styles from "../Dropdown.module.css";

const ConfirmedDropdown = (props: Props) => {
    const {
        record,
        pageX,
        pageY,
        showDropdown,
        canManage,
        onView,
        onCancel,
    } = props;

    const handleClick = (item: any) => {
        switch (item.key) {
            case "1":
                onView(record.id);
                break;
            case "2":
                break;
            case "3":
                if (canManage) {
                    onCancel(record.id);
                }
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
                    top: pageY,
                    left:
                        window.innerWidth - (pageX + 170) < 0
                            ? window.innerWidth - 220
                            : pageX,
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
                {canManage ? (
                    <Menu.Item key="3">
                        <FileExcelOutlined />
                        Скасувати
                    </Menu.Item>
                ) : null}
            </Menu>
        </>
    );
};

export default ConfirmedDropdown;
