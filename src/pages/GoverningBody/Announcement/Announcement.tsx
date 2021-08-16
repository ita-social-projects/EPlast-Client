import { Button, Layout, List } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { getAllAnnouncements } from "../../../api/governingBodiesApi";
import { Announcement } from "../../../models/GoverningBody/Announcement/Announcement";
import AddAnnouncementModal from "./AddAnnouncementModal";
import Spinner from "../../Spinner/Spinner";
import { AnnouncementForAdd } from "../../../models/GoverningBody/Announcement/AnnouncementForAdd";
import DropDown from "./DropDownAnnouncement";
import ClickAwayListener from "react-click-away-listener";

const { Content } = Layout;

const Announcements = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState<Array<Announcement>>([]);
  const [newData, setNewData] = useState<Array<Announcement>>([]);
  const [recordObj, setRecordObj] = useState<any>(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [visibleModal, setVisibleModal] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string>("");
  const classes = require("./Announcement.module.css");

  const getAnnouncements = () => {
    setLoading(true);
    getAllAnnouncements().then((res) => {
      var announcements: Announcement[] = [];
      for (var value of res.data) {
        var ann: Announcement = {
          id: value.id,
          text: value.text,
          date: value.date.substring(0, 10),
          firstName: value.user.firstName,
          lastName: value.user.lastName,
          userId: value.user.userId,
        };
        announcements.push(ann);
      }
      setData(announcements);
      setLoading(false);
    });
  };

  useEffect(() => {
    getAnnouncements();
  }, [newData]);

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const showModal = () => {
    setVisibleModal(true);
  };

  const handleAdd = async () => {
    setVisibleModal(false);
    setLoading(true);
    await getAllAnnouncements().then((res) => {
      var announcements: Announcement[] = [];
      for (var value of res.data) {
        var ann: Announcement = {
          id: value.id,
          text: value.text,
          date: value.date.substring(0, 10),
          firstName: value.user.firstName,
          lastName: value.user.lastName,
          userId: value.user.userId,
        };
        announcements.push(ann);
      }
      setNewData(announcements);
      setLoading(false);
    });
  };

  const handleDelete = (id: number) => {
    const filteredData = data.filter((d) => d.id !== id);
    setData([...filteredData]);
  };

  return (
    <Layout>
      <Content
        onClick={() => {
          setShowDropdown(false);
        }}
      >
        <h1> Оголошення </h1>
        <div className={classes.antbtn}>
          <Button type="primary" onClick={showModal}>
            Додати оголошення
          </Button>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item) => (
              <List.Item
                className={classes.listItem}
                onClick={() => {
                  setShowDropdown(false);
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  setShowDropdown(true);
                  setRecordObj(item.id);
                  setX(event.pageX);
                  setY(event.pageY);
                }}
              >
                <List.Item.Meta
                  title={item.firstName + " " + item.lastName}
                  description={item.date}
                />
                {item.text}
              </List.Item>
            )}
            pagination={{
              showLessItems: true,
              responsive: true,
              showSizeChanger: true,
            }}
          />
        )}
        <ClickAwayListener onClickAway={handleClickAway}>
          <DropDown
            showDropdown={showDropdown}
            record={recordObj}
            pageX={x}
            pageY={y}
            onDelete={handleDelete}
          />
        </ClickAwayListener>
        <AddAnnouncementModal
          setVisibleModal={setVisibleModal}
          visibleModal={visibleModal}
          onAdd={handleAdd}
        />
      </Content>
    </Layout>
  );
};

export default Announcements;
