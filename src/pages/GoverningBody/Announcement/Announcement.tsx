import { Button, Avatar, Layout, List, Modal, Carousel, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  addAnnouncement,
  editAnnouncement,
  getAnnouncementsById,
  getAnnouncementsByPage,
} from "../../../api/governingBodiesApi";
import { getUsersByAllRoles } from "../../../api/adminApi";
import { Announcement } from "../../../models/GoverningBody/Announcement/Announcement";
import AddAnnouncementModal from "./AddAnnouncementModal";
import Spinner from "../../Spinner/Spinner";
import notificationLogic from "../../../components/Notifications/Notification";
import DropDown from "./DropDownAnnouncement";
import ClickAwayListener from "react-click-away-listener";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import EditAnnouncementModal from "./EditAnnouncementModal";
import { getUserAccess } from "../../../api/regionsBoardApi";
import { Roles } from "../../../models/Roles/Roles";
import jwt from "jwt-decode";
import AuthStore from "../../../stores/AuthStore";
import ShortUserInfo from "../../../models/UserTable/ShortUserInfo";
import UserApi from "../../../api/UserApi";
import { Markup } from "interweave";
import Title from "antd/lib/typography/Title";
import {
  FileImageOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Content } = Layout;

const Announcements = () => {
  const path: string = "/announcements";
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [data, setData] = useState<Array<Announcement>>([]);
  const [recordObj, setRecordObj] = useState<number>(0);
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false);
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);
  const classes = require("./Announcement.module.css");
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { p } = useParams();
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(+p);
  const [totalSize, setTotalSize] = useState<number>(0);

  const maxTextLength = 50;

  const getAnnouncements = async () => {
    setLoading(true);
    await getAnnouncementsByPage(p, pageSize).then(async (res) => {
      setTotalSize(res.data.item2);
      var announcements: Announcement[] = [];
      for (var value of res.data.item1) {
        await UserApi.getImage(value.user.imagePath).then((image) => {
          var ann: Announcement = {
            id: value.id,
            text: value.text,
            date: value.date,
            firstName: value.user.firstName,
            lastName: value.user.lastName,
            userId: value.userId,
            profileImage: image.data,
            strippedString: value.text.replace(/<[^>]+>/g, ""),
            imagesPresent: value.imagesPresent,
          };
          announcements.push(ann);
        });
      }
      setData(announcements);
      setLoading(false);
    });
  };

  const handleChange = async (page: number) => {
    history.push(`${path}/page/${page}`);
  };

  const handleSizeChange = (pageSize: number = 10) => {
    setPageSize(pageSize);
  };

  useEffect(() => {
    setPage(+p);
    getAnnouncements();
    getUserAccesses();
  }, [p, pageSize]);

  const getUserAccesses = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    let result: any;
    await getUserAccess(user.nameid).then((response) => {
      result = response;
      setUserAccesses(response.data);
    });
    return result;
  };

  const getUsers = async () => {
    let result: any;
    await getUsersByAllRoles([[Roles.RegisteredUser]], false).then(
      (response) => {
        result = response;
      }
    );
    return result;
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const newNotification = async () => {
    let usersId = ((await getUsers()).data as ShortUserInfo[]).map((x) => x.id);
    await NotificationBoxApi.createNotifications(
      usersId,
      "Додане нове оголошення.",
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `${path}/page/1`,
      `Переглянути`
    );
  };

  const showModal = () => {
    setVisibleAddModal(true);
  };

  const showFullAnnouncement = async (annId: number) => {
    setLoading(true);
    let current = data.find((a) => a.id === annId)!;
    await getAnnouncementsById(annId).then((response) => {
      return Modal.info({
        title: (
          <div>
            {current.firstName} {current.lastName}
            <div className={classes.announcementDate}>
              {response.data.date.toString().substring(0, 10)}
            </div>
          </div>
        ),
        content: (
          <div>
            <Markup content={response.data.text} />
            <Carousel
              className={classes.homeSlider}
              arrows
              prevArrow={<LeftOutlined />}
              nextArrow={<RightOutlined />}
            >
              {response.data.images.map((image: any) => (
                <div>
                  <Avatar shape="square" size={350} src={image.imageBase64} />
                </div>
              ))}
            </Carousel>
          </div>
        ),
        icon: <Avatar src={current.profileImage} />,
        maskClosable: true,
      });
    });
    setLoading(false);
  };

  const handleEdit = async (
    id: number,
    newText: string,
    newImages: string[]
  ) => {
    setVisibleAddModal(false);
    setLoading(true);
    await editAnnouncement(id, newText, newImages);
    setData(data.map((x) => (x.id === id ? { ...x, text: newText } : x)));

    await getAnnouncements();
    setLoading(false);
  };

  const handleAdd = async (text: string, images: string[]) => {
    setVisibleAddModal(false);
    setLoading(true);
    newNotification();
    await addAnnouncement(text, images);
    await getAnnouncements();
    setLoading(false);
    notificationLogic("success", "Оголошення опубліковано");
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
        {userAccesses["AddAnnouncement"] ? (
          <div className={classes.antbtn}>
            <Button type="primary" onClick={showModal}>
              Додати оголошення
            </Button>
          </div>
        ) : null}
        {loading ? (
          <Spinner />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={data}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 3,
              xxl: 4,
            }}
            renderItem={(item) => {
              return (
                <List.Item
                  style={{ overflow: "hidden", wordBreak: "break-word" }}
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
                  <div className={classes.metaWrapper}>
                    {item.imagesPresent ? (
                      <div>
                        <Tooltip title='Натисніть "Показати більше" щоб побачити вкладені фото'>
                          <FileImageOutlined
                            className={classes.isImagePresentIcon}
                          />
                        </Tooltip>
                      </div>
                    ) : null}
                    <List.Item.Meta
                      className={classes.listItemMeta}
                      title={item.firstName + " " + item.lastName}
                      description={item.date.toString().substring(0, 10)}
                      avatar={
                        <Avatar
                          size={40}
                          className={classes.avatar}
                          src={item.profileImage}
                        />
                      }
                    />
                  </div>
                  <Markup
                    content={
                      item.strippedString.length < maxTextLength
                        ? item.text
                        : `${item.text
                            .toString()
                            .substring(
                              0,
                              maxTextLength +
                                (item.text.length -
                                  item.strippedString.length) /
                                  2
                            )}...`
                    }
                  />

                  {item.strippedString.length >= maxTextLength ||
                  item.imagesPresent ? (
                    <Title>
                      <Button
                        type="text"
                        onClick={() => showFullAnnouncement(item.id)}
                      >
                        Показати більше
                      </Button>
                    </Title>
                  ) : null}
                </List.Item>
              );
            }}
            pagination={{
              current: page,
              pageSize: pageSize,
              responsive: true,
              total: totalSize,
              pageSizeOptions: ["12", "24", "36", "48"],
              onChange: async (page) => await handleChange(page),
              onShowSizeChange: (page, size) => handleSizeChange(size),
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
            onEdit={() => {
              setVisibleEditModal(true);
            }}
            userAccess={userAccesses}
          />
        </ClickAwayListener>
        <AddAnnouncementModal
          setVisibleModal={setVisibleAddModal}
          visibleModal={visibleAddModal}
          onAdd={handleAdd}
        />
        <EditAnnouncementModal
          setVisibleModal={setVisibleEditModal}
          visibleModal={visibleEditModal}
          onEdit={handleEdit}
          id={recordObj}
        />
      </Content>
    </Layout>
  );
};

export default Announcements;
