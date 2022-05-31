import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import {
  DeleteOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import AuthStore from "../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import classes from "./Table.module.css";
import deleteConfirm from "./DeleteConfirm";
import documentsApi from "../../api/documentsApi";
import { Roles } from "../../models/Roles/Roles";

interface DropDownProps {
  record: number;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete: (id: number) => void;
}

const DropDown: React.FC<DropDownProps> = ({ record, pageX, pageY, showDropdown, onDelete }) => {
  const token = AuthStore.getToken() as string;
  const decodedJwt = jwt_decode(token) as any;
  const roles = decodedJwt[
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  ] as string[];

  const accesser = {
    canEdit: roles.includes(Roles.Admin)
      || roles.includes(Roles.GoverningBodyAdmin),
  }

  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        deleteConfirm(record, onDelete);
        break;
      case "2": {
        const pdf = await documentsApi.getPdf(record);
        window.open(pdf);
        break;
      }
    }
    item.key = "0";
  };

  return (
    <Menu
      theme="dark"
      onClick={handleItemClick}
      className={classes.menu}
      style={{
        top: pageY,
        left:
          window.innerWidth - (pageX + 184) < 0
            ? window.innerWidth - 227
            : pageX,
        display: showDropdown ? "block" : "none",
      }}
    >
      {accesser.canEdit == true ? (
        <Menu.Item key="1">
          <DeleteOutlined />
          Видалити
        </Menu.Item>
      ) : (
        <> </>
      )}

      <Menu.Item key="2">
        <FilePdfOutlined />
        Переглянути в PDF
      </Menu.Item>
    </Menu>
  );
};

export default DropDown;
