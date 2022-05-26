/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import {
  Button,
  Avatar,
  Layout,
  List,
  Modal,
  Tooltip,
  Row,
  Popconfirm,
  Menu,
  Dropdown,
} from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import jwt from "jwt-decode";
import { Markup } from "interweave";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Meta from "antd/lib/card/Meta";
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
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import EditAnnouncementModal from "./EditAnnouncementModal";
import { getUserAccess } from "../../../api/regionsBoardApi";
import { Roles } from "../../../models/Roles/Roles";
import AuthStore from "../../../stores/AuthStore";
import ShortUserInfo from "../../../models/UserTable/ShortUserInfo";
import UserApi from "../../../api/UserApi";
import PicturesWall, { AnnouncementGallery } from "./PicturesWallModal";
import { addSectorAnnouncement } from "../../../api/governingBodySectorsApi";
import { pinAnnouncement } from "../../../api/announcementsApi";

const classes = require("./Announcement.module.css");

const { Content } = Layout;

const Announcements = () => {
  const path: string = "governingBodies/announcements";
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<Announcement>>([]);
  const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false);
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);
  const [userAccesses, setUserAccesses] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { id, p }: any = useParams();
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(+p);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [selectedObjectId, setSelectedObjectId] = useState<number>(0);

  const getAnnouncements = async () => {
    setLoading(true);
    await getAnnouncementsByPage(+p, pageSize, +id).then(async (res) => {
      setTotalSize(res.data.item2);
      const announcements: Announcement[] = [];
      for (const value of res.data.item1) {
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
            imagesPresent: value.imagesPresent,
            isPined: value.isPined,
          };
          announcements.push(ann);
        });
      }
      setData(announcements);
      setLoading(false);
    });
  };

  const handleChange = async (selectedPage: number) => {
    history.push(`${selectedPage}`);
  };

  const handleSizeChange = (selectedPageSize: number = 10) => {
    setPageSize(selectedPageSize);
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

  const newNotification = async () => {
    const usersId = ((await getUsers()).data as ShortUserInfo[]).map(
      (user) => user.id
    );
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
    const pics: AnnouncementGallery[] = [];
    await getAnnouncementsById(annId).then((response) => {
      response.data.images.map((image: any) => {
        pics.push({
          announcementId: image.id,
          fileName: image.imageBase64,
        });
        return image;
      });
      return Modal.info({
        title: (
          <div className={classes.announcementDate}>
            {response.data.user.firstName} {response.data.user.lastName}
            <div>
              {moment(response.data.date.toString()).format("YYYY-MM-DD HH:mm")}
            </div>
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
    announcementId: number,
    newTitle: string,
    newText: string,
    newImages: string[],
    isPined: boolean
  ) => {
    setVisibleAddModal(false);
    setLoading(true);
    await editAnnouncement(
      announcementId,
      newTitle,
      newText,
      newImages,
      isPined
    );
    await getAnnouncements();
    setLoading(false);
  };

  const handleAdd = async (
    title: string,
    text: string,
    images: string[],
    isPined: boolean,
    gvbId: number,
    sectorId: number
  ) => {
    setVisibleAddModal(false);
    setLoading(true);
    newNotification();
    if (sectorId) {
      await addSectorAnnouncement(
        title,
        text,
        images,
        isPined,
        gvbId,
        +sectorId
      );
    } else {
      await addAnnouncement(title, text, images, isPined, +gvbId);
    }
    await getAnnouncements();
    setLoading(false);
    notificationLogic("success", "Оголошення опубліковано");
  };
  const handleDelete = (announcementId: number) => {
    const filteredData = data.filter((d) => d.id !== announcementId);
    setData([...filteredData]);
  };

  const handlePin = async (item: Announcement) => {
    setLoading(true);
    await pinAnnouncement(item.id);
    await getAnnouncements();
    setLoading(false);
  };

  useEffect(() => {
    getAnnouncements();
    getUserAccesses();
    setPage(+p);
  }, [p, pageSize]);

  const moreMenu = (
    <Menu theme="dark" className={classes.menu}>
      {userAccesses.DeleteAnnouncement ? (
        <Menu.Item
          key="1"
          onClick={() => {
            if (selectedObjectId) handleDelete(selectedObjectId);
          }}
        >
          <DeleteOutlined />
          Видалити
        </Menu.Item>
      ) : null}
      {userAccesses.EditAnnouncement ? (
        <Menu.Item
          key="2"
          onClick={() => {
            setVisibleEditModal(true);
          }}
        >
          <EditOutlined />
          Редагувати
        </Menu.Item>
      ) : null}
    </Menu>
  );

  return (
    <Layout>
      <Content>
        <h1> Оголошення </h1>
        {userAccesses.AddAnnouncement ? (
          <Row justify="end">
            <Button
              type="primary"
              className={classes.addAnnouncementButton}
              onClick={showModal}
            >
              Додати оголошення
            </Button>
          </Row>
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
                <List.Item key={item.id} className={classes.listItem}>
                  <div className={classes.metaWrapper}>
                    <div>
                      <Tooltip
                        title="Натисніть щоб показати більше дій"
                        placement="topRight"
                      >
                        <Dropdown
                          overlay={moreMenu}
                          placement="bottomCenter"
                          trigger={["click"]}
                        >
                          <EllipsisOutlined
                            className={classes.titleButtonIcon}
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedObjectId(item.id);
                            }}
                          />
                        </Dropdown>
                      </Tooltip>
                    </div>
                    {item.isPined ? (
                      <div>
                        <Tooltip
                          title="Натисніть щоб відкріпити оголошення"
                          placement="topRight"
                        >
                          <Popconfirm
                            placement="bottom"
                            title="Відкріпити оголоення"
                            icon={null}
                            onConfirm={() => handlePin(item)}
                            okText="Так"
                            cancelText="Ні"
                          >
                            <PushpinFilled
                              className={classes.titleButtonIcon}
                            />
                          </Popconfirm>
                        </Tooltip>
                      </div>
                    ) : (
                      <div>
                        <Tooltip
                          title="Натисніть щоб закріпити оголошення"
                          placement="topRight"
                        >
                          <PushpinOutlined
                            className={classes.titleButtonIcon}
                            onClick={() => handlePin(item)}
                          />
                        </Tooltip>
                      </div>
                    )}
                    <List.Item.Meta
                      className={classes.listItemMeta}
                      title={`${item.firstName} ${item.lastName}`}
                      description={moment(item.date).format("YYYY-MM-DD HH:mm")}
                      avatar={
                        <Avatar
                          size={40}
                          className={classes.avatar}
                          src={item.profileImage}
                        />
                      }
                    />
                  </div>
                  <div
                    className={classes.listItemContent}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      showFullAnnouncement(item.id);
                    }}
                  >
                    <Markup
                      content={item.title}
                      className={classes.truncateText}
                    />
                    <Markup
                      content={item.text}
                      className={classes.truncateText}
                    />
                    {item.imagesPresent ? (
                      <Row justify="center">
                        <Meta
                          className={classes.moreButton}
                          title="Переглянути вкладення"
                        />
                      </Row>
                    ) : null}
                  </div>
                </List.Item>
              );
            }}
            pagination={{
              current: +page,
              pageSize,
              responsive: true,
              total: totalSize,
              pageSizeOptions: ["12", "24", "36", "48"],
              onChange: (selectedPage) => handleChange(selectedPage),
              onShowSizeChange: (_selectedPage, size) => handleSizeChange(size),
            }}
          />
        )}
        <AddAnnouncementModal
          governingBodyId={+id}
          setVisibleModal={setVisibleAddModal}
          visibleModal={visibleAddModal}
          onAdd={handleAdd}
        />
        <EditAnnouncementModal
          setVisibleModal={setVisibleEditModal}
          visibleModal={visibleEditModal}
          onEdit={handleEdit}
          id={selectedObjectId}
        />
      </Content>
    </Layout>
  );
};

export default Announcements;
