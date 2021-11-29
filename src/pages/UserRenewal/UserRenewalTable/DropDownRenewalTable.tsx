import { Menu } from "antd";
import { Roles } from "../../../models/Roles/Roles";
import { showRenewalConfirm } from "../UserRenewalModals";
import {FileSearchOutlined, EditOutlined} from "@ant-design/icons";
import classes from "./Table.module.css";
import DropDownProps from "../Types/DropDownProps";
import React from "react";
import UserRenewal from "../Types/UserRenewal";

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

const DropDown = (props: DropDownProps) => {
    const {
        id,
        userId,
        cityId,
        isRecordActive,
        pageX,
        pageY,
        showDropdown,
        roles,
        currentCity,
        onConfirm,
    } = props;

    const renewal: UserRenewal = {
        id: id,
        userId: userId,
        cityId: cityId,
        requestDate: today,
        approved: true
    };

    const handleItemClick = async (item: any) => {
        switch (item.key) {
            case "1":
                window.open(`/userpage/main/${userId}`);
                break;
            case "2":
                showRenewalConfirm(renewal, onConfirm);
                break;
            default:
                break;
        }
    };

    const handleView = () => {
        if (roles.includes(Roles.Admin)&&!isRecordActive) 
            return true;

        if ((roles.includes(Roles.CityHead) || roles.includes(Roles.CityHeadDeputy))
            && !isRecordActive
            && cityId === currentCity) 
            return true;
            
        return false;
    };

    return (
        <>
            <Menu
                onClick={handleItemClick}
                theme="dark"
                selectable={false}
                className={classes.menu}
                style={{
                    top: pageY,
                    left: (window.innerWidth - (pageX + 194)) < 0 ? window.innerWidth - 237 : pageX,
                    display: showDropdown ? "block" : "none",
                }}
            >
                <Menu.Item key="1">
                    <FileSearchOutlined />
                    Переглянути профіль
                </Menu.Item>
                {handleView() ? (
                    <Menu.Item key="2">
                        <EditOutlined />
                        Відновити статус
                    </Menu.Item>
                ) : (
                    <></>
                )}
            </Menu>
        </>
    );
};
export default DropDown;
