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
        canManage,
        onView,
        onEdit,
        onConfirm,
        onRemove,
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
                onEdit(
                    regionRecord.id,
                    new Date(regionRecord.date).getFullYear()
                );
                break;
            case "3":
                if (canManage) {
                    onConfirm(regionRecord.id);
                }
                break;
            case "4":
                if (canManage) {
                    onRemove(regionRecord.id);
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
                {regionRecord.canManage ? (
                    <Menu.Item key="2">
                        <FileSyncOutlined />
                        Редагувати
                    </Menu.Item>
                ) : null}
                {canManage ? (
                    <Menu.Item key="3">
                        <FileDoneOutlined />
                        Підтвердити
                    </Menu.Item>
                ) : null}
                {canManage ? (
                    <Menu.Item key="4">
                        <DeleteOutlined />
                        Видалити
                    </Menu.Item>
                ) : null}
            </Menu>
        </>
    );
};

export default UnconfirmedRegionDropdown;
