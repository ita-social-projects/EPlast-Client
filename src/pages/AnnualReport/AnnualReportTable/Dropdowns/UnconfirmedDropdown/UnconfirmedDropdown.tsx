import React from "react";
import { Menu } from "antd";
import {
    FileSearchOutlined,
    FileSyncOutlined,
    FileDoneOutlined,
    DeleteOutlined,
    FilePdfOutlined,
} from "@ant-design/icons";
import Props from "./UnconfirmedDropdownProps";
import styles from "../Dropdown.module.css";

const UnconfirmedDropdown = (props: Props) => {
    const {
        record,
        pageX,
        pageY,
        showDropdown,
        canManage,
        onView,
        onViewPDF,
        onEdit,
        onConfirm,
        onRemove,
    } = props;
    const handleClick = (item: any) => {
        switch (item.key) {
            case "1":
                onView(record.id);
                break;
            case "2":
                onViewPDF(record.id);
                break;
            case "3":
                if (record.canManage) {
                    onEdit(record.id);
                }
                break;
            case "4":
                if (canManage) {
                    onConfirm(record.id);
                }
                break;
            case "5":
                if (canManage) {
                    onRemove(record.id);
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
                <Menu.Item key="2">
                    <FilePdfOutlined />
                    Переглянути у форматі PDF
                </Menu.Item>
                {record.canManage ? (
                    <Menu.Item key="3">
                        <FileSyncOutlined />
                        Редагувати
                    </Menu.Item>
                ) : null}
                {canManage ? (
                    <Menu.Item key="4">
                        <FileDoneOutlined />
                        Підтвердити
                    </Menu.Item>
                ) : null}
                {canManage ? (
                    <Menu.Item key="5">
                        <DeleteOutlined />
                        Видалити
                    </Menu.Item>
                ) : null}
            </Menu>
        </>
    );
};

export default UnconfirmedDropdown;
