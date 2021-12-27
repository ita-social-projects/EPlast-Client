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
        userAnnualReportAccess,
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
                if (userAnnualReportAccess?.CanChangeReportStatus) {
                    onCancel(regionRecord.id);
                }
                break;
            default:
                break;
        }
    };

    return (
        <>
            {userAnnualReportAccess?.CanViewReportDetails && 
                userAnnualReportAccess?.CanViewRegionReportsTable ? (
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
                    {userAnnualReportAccess?.CanChangeReportStatus ? (
                        <Menu.Item key="2">
                            <FileExcelOutlined />
                            Скасувати
                        </Menu.Item>
                    ) : null}
                </Menu>
            ) : null}
        </>
    );
};

export default ConfirmedRegionDropdown;
