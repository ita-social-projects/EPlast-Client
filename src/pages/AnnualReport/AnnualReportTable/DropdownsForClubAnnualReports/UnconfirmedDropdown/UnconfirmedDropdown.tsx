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
        userAnnualReportAccess,
        onView,
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
                break;
            case "3":
                if (userAnnualReportAccess?.CanEditReport) {
                    onEdit(record.id);
                }
                break;
            case "4":
                if (userAnnualReportAccess?.CanChangeReportStatus) {
                    onConfirm(record.id);
                }
                break;
            case "5":
                if (userAnnualReportAccess?.CanDeleteReport) {
                    onRemove(record.id);
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            {userAnnualReportAccess?.CanViewReportDetails &&
                userAnnualReportAccess?.CanViewClubReportsTable ? (
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
                    <Menu.Item key="2">
                        <FilePdfOutlined />
                        Переглянути у форматі PDF
                    </Menu.Item>
                    {userAnnualReportAccess?.CanEditReport ? (
                        <Menu.Item key="3">
                            <FileSyncOutlined />
                            Редагувати
                        </Menu.Item>
                    ) : null}
                    {userAnnualReportAccess?.CanChangeReportStatus ? (
                        <Menu.Item key="4">
                            <FileDoneOutlined />
                            Підтвердити
                        </Menu.Item>
                    ) : null}
                    {userAnnualReportAccess?.CanDeleteReport ? (
                        <Menu.Item key="5">
                            <DeleteOutlined />
                            Видалити
                        </Menu.Item>
                    ) : null}
                </Menu>
            ) : null}
        </>
    );
};

export default UnconfirmedDropdown;
