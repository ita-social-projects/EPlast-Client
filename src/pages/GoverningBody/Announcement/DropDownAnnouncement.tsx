import React, { useEffect } from "react";
import { Menu } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import classes from "./Announcement.module.css";
import "../../../api/governingBodiesApi";
import DeleteConfirm from "./DeleteConfirm";

interface Props {
  record: number;
  pageX: number;
  pageY: number;
  showDropdown: boolean;
  onEdit: () => void;
  onDelete: (id: number) => void;
  userAccess: { [key: string]: boolean };
}

const DropDown = (props: Props) => {
  const {
    record,
    pageX,
    pageY,
    showDropdown,
    onDelete,
    onEdit,
    userAccess,
  } = props;

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
      {userAccess["DeleteAnnouncement"] || userAccess["EditAnnouncement"] ? (
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
          {userAccess["DeleteAnnouncement"] ? (
            <Menu.Item key="1">
              <DeleteOutlined />
              Видалити
            </Menu.Item>
          ) : null}
          {userAccess["EditAnnouncement"] ? (
            <Menu.Item key="2">
              <EditOutlined />
              Редагувати
            </Menu.Item>
          ) : null}
        </Menu>
      ) : null}
    </>
  );
};

export default DropDown;
