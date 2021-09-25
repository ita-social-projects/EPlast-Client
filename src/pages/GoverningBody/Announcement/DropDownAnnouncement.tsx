import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { Announcement } from "../../../models/GoverningBody/Announcement/Announcement";
import classes from "./Announcement.module.css";
import "../../../api/governingBodiesApi";
import { getAllAnnouncements, getUserAccess } from "../../../api/governingBodiesApi";
import DeleteConfirm from "./DeleteConfirm";
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
interface Props {
  record: number;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onEdit: () => void;
  onDelete: (id: number) => void;
  userAccesses : {[key: string] : boolean};
}



const DropDown = (props: Props) => {
  const { record, pageX, pageY, showDropdown, onDelete, userAccesses  } = props;



  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);

  /* eslint no-param-reassign: "error" */
  const handleItemClick = async (item: any) => {
    switch (item.key) {
      case "1":
        DeleteConfirm(record, onDelete);
        break;
      case "2":
        onEdit();
        break;
    }
    item.key = "0";
  };

  return (
    <>
      {userAccesses["DeleteAnnouncement"]?
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
        <Menu.Item key="1">
          <DeleteOutlined />
          Видалити
        </Menu.Item>
      </Menu>
      : null}
    </>
  );
};

export default DropDown;
