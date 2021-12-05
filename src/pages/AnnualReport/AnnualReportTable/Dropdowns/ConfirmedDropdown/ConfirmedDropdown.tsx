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
        userAnnualReportAccess,
        onView,
        onViewPDF,
        onCancel,
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
                if (userAnnualReportAccess.CanChangeReportStatus) {
                    onCancel(record.id);
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            {userAnnualReportAccess?.CanViewEveryAnnualReport ||
                userAnnualReportAccess?.CanSubmitCityReport ? (
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
                    {userAnnualReportAccess.CanChangeReportStatus ? (
                        <Menu.Item key="3">
                            <FileExcelOutlined />
                            Скасувати
                        </Menu.Item>
                    ) : null}
                </Menu>
            ) : null}
        </>
    );
};

export default ConfirmedDropdown;
