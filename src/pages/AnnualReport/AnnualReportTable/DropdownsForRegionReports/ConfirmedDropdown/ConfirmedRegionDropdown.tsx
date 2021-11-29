import React from "react";
import { Menu } from "antd";
import { FileExcelOutlined, FileSearchOutlined } from "@ant-design/icons";
import Props from "./ConfirmedRegionDropdownProps";
import styles from "../Dropdown.module.css";

const ConfirmedRegionDropdown = (props: Props) => {
    const {
        regionRecord,
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
                onView(
                    regionRecord.id,
                    new Date(regionRecord.date).getFullYear()
                );
                break;
            case "2":
                if (canManage) {
                    onCancel(regionRecord.id);
                }
                break;
            default:
                break;
        }
    };

    return (
        <Menu
            theme="dark"
            onClick={handleClick}
            selectedKeys={[]}
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
            {canManage ? (
                <Menu.Item key="2">
                    <FileExcelOutlined />
                    Скасувати
                </Menu.Item>
            ) : null}
        </Menu>
    );
};

export default ConfirmedRegionDropdown;
