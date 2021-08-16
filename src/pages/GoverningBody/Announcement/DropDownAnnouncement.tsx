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
import { getAllAnnouncements } from "../../../api/governingBodiesApi";
import DeleteConfirm from "./DeleteConfirm";

interface Props {
  record: number;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onDelete: (id: number) => void;
}

const DropDown = (props: Props) => {
  const { record, pageX, pageY, showDropdown, onDelete } = props;

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
      <Menu.Item key="1">
        <DeleteOutlined />
        Видалити
      </Menu.Item>
    </Menu>
  );
};

export default DropDown;
