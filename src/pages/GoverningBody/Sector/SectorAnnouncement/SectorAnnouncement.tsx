import { Button, Avatar, Layout, List, Modal, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import ClickAwayListener from "react-click-away-listener";
import jwt from "jwt-decode";
import { Markup } from "interweave";
import { FileImageOutlined } from "@ant-design/icons";
import {
  addSectorAnnouncement,
  editSectorAnnouncement,
  getSectorAnnouncementsById,
  getSectorAnnouncementsByPage,
} from "../../../../api/governingBodySectorsApi";
import { getUsersByAllRoles } from "../../../../api/adminApi";
import { Announcement } from "../../../../models/GoverningBody/Announcement/Announcement";
import AddAnnouncementModal from "./AddAnnouncementModal";
import Spinner from "../../../Spinner/Spinner";
import notificationLogic from "../../../../components/Notifications/Notification";
import DropDown from "./DropDownAnnouncement";
import NotificationBoxApi from "../../../../api/NotificationBoxApi";
import EditAnnouncementModal from "./EditAnnouncementModal";
import { getUserAccess } from "../../../../api/regionsBoardApi";
import { Roles } from "../../../../models/Roles/Roles";
import AuthStore from "../../../../stores/AuthStore";
import ShortUserInfo from "../../../../models/UserTable/ShortUserInfo";
import UserApi from "../../../../api/UserApi";
import { addAnnouncement } from "../../../../api/governingBodiesApi";
import PicturesWall, {
  AnnouncementGallery,
} from "../../Announcement/PicturesWallModal";

const classes = require("./Announcement.module.css");

const { Content } = Layout;

const Announcements = () => {
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [data, setData] = useState<Array<Announcement>>([]);
  const [recordObj, setRecordObj] = useState<number>();
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false);
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);

  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { governingBodyId, sectorId, p } = useParams();
  const [pageSize, setPageSize] = useState(12);
  const [page] = useState(+p);
  const [totalSize, setTotalSize] = useState<number>(0);
  const maxTextLength = 50;

  const getAnnouncements = async () => {
    setLoading(true);
    await getSectorAnnouncementsByPage(p, pageSize, +sectorId).then(
      async (res) => {
        setTotalSize(res.data.item2);
        const announcements: Announcement[] = [];
        for (var value of res.data.item1) {
          await UserApi.getImage(value.user.imagePath).then((image) => {
            const ann: Announcement = {
              id: value.id,
              text: value.text,
              title: value.title,
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
      }
    );
  };

  const handleChange = async (page: number) => {
    history.push(`${page}`);
  };

  const handleSizeChange = (pageSize: number = 10) => {
    setPageSize(pageSize);
  };

  const getUserAccesses = async () => {
    const user: any = jwt(AuthStore.getToken() as string);
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

  const showModal = () => {
    setVisibleAddModal(true);
  };

  const showFullAnnouncement = async (annId: number) => {
    const pics: AnnouncementGallery[] = [];
    await getSectorAnnouncementsById(annId).then((response) => {
      response.data.images.map((image: any) => {
        pics.push({
          announcementId: image.id,
          fileName: image.imageBase64,
        });
      });
      return Modal.info({
        title: (
          <div className={classes.announcementDate}>
            {response.data.user.firstName} {response.data.user.lastName}
            <div>{response.data.date.toString().substring(0, 10)}</div>
          </div>
        ),
        content: (
          <div>
            <Markup content={response.data.title} />
            <Markup content={response.data.text} />
            <div>
              <PicturesWall pictures={pics} key="removePictures" />
            </div>
          </div>
        ),
        maskClosable: true,
        icon: null,
      });
    });
  };

  const handleEdit = async (
    id: number,
    newTitle: string,
    newText: string,
    newImages: string[]
  ) => {
    try {
      setVisibleAddModal(false);
      await editSectorAnnouncement(id, newTitle, newText, newImages);
      await getAnnouncements();
      notificationLogic("success", "Оголошення змінено");
    } catch {
      setVisibleAddModal(false);
      notificationLogic("error", "Поля Тема і Текст оголошення обов'язкові");
    }
  };

  const newAnnouncementNotification = async (
    governigBodyId: number,
    sectorId?: number
  ) => {
    const usersId = ((await getUsers()).data as ShortUserInfo[]).map(
      (x) => x.id
    );
    if (sectorId) {
      await NotificationBoxApi.createNotifications(
        usersId,
        "Додане нове оголошення.",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/sector/announcements/${governigBodyId}/${sectorId}/1`,
        `Переглянути`
      );
    } else {
      await NotificationBoxApi.createNotifications(
        usersId,
        "Додане нове оголошення.",
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/governingBodies/announcements/${governigBodyId}/1`,
        `Переглянути`
      );
    }
  };

  const handleAdd = async (
    title: string,
    text: string,
    images: string[],
    gvbId: number,
    sectorId: number
  ) => {
    try {
      setVisibleAddModal(false);
      setLoading(true);
      if (sectorId) {
        await addSectorAnnouncement(title, text, images, +sectorId);
        newAnnouncementNotification(gvbId, sectorId);
      } else {
        await addAnnouncement(title, text, images, +gvbId);
        newAnnouncementNotification(gvbId);
      }
      getAnnouncements();
      notificationLogic("success", "Оголошення опубліковано");
      return true;
    } catch {
      notificationLogic("error", "Поля Тема і Текст оголошення обов'язкові");
      setVisibleAddModal(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    const filteredData = data.filter((d) => d.id !== id);
    setData([...filteredData]);
  };

  useEffect(() => {
    getAnnouncements();
    getUserAccesses();
  }, [p, pageSize]);

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
                    showFullAnnouncement(item.id);
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
                      title={`${item.firstName} ${item.lastName}`}
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
                  <Markup content={item.title} />
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
        <AddAnnouncementModal
          selectSectorId={+sectorId}
          selectGoverningBodyId={governingBodyId}
          setVisibleModal={setVisibleAddModal}
          visibleModal={visibleAddModal}
          onAdd={handleAdd}
        />
        {recordObj ? (
          <>
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
            <EditAnnouncementModal
              setVisibleModal={setVisibleEditModal}
              visibleModal={visibleEditModal}
              onEdit={handleEdit}
              id={recordObj}
            />
          </>
        ) : null}
      </Content>
    </Layout>
  );
};

export default Announcements;
