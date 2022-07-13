import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PushpinFilled,
  PushpinOutlined,
} from "@ant-design/icons";
import {
  Layout,
  List,
  Tooltip,
  Avatar,
  Modal,
  Button,
  Menu,
  Dropdown,
  Row,
  Popconfirm,
} from "antd";
import { Markup } from "interweave";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Meta from "antd/lib/card/Meta";
import moment from "moment";
import Spinner from "../Spinner/Spinner";
import notificationLogic from "../../components/Notifications/Notification";
import PicturesWall, {
  AnnouncementGallery,
} from "../GoverningBody/Announcement/PicturesWallModal";
import { getAnnouncementsById } from "../../api/announcementsApi";
import { Announcement } from "../../models/GoverningBody/Announcement/Announcement";
import DeleteConfirm from "../GoverningBody/Announcement/DeleteConfirm";
import AddAnnouncementModal from "./Modals/AddAnnouncementModal";
import { AnnouncementsTableStore } from "../../stores/AnnouncementsStore/store";
import EditAnnouncementModal from "./Modals/EditAnnouncementModal";

const classes = require("./Announcement.module.css");

const { Content } = Layout;

const AnnouncementsTable = () => {
  const history = useHistory();
  const { page }: any = useParams();
  const [state, actions] = AnnouncementsTableStore();

  const [loading, setLoading] = useState<boolean>(false);

  const [visibleAddModal, setVisibleAddModal] = useState<boolean>(false);
  const [visibleEditModal, setVisibleEditModal] = useState<boolean>(false);
  const [visibleAnnouncementModal, setVisibleAnnouncemnetModal] = useState<
    boolean
  >(false);

  const showModal = () => {
    setVisibleAddModal(true);
  };

  const handleSizeChange = (pageSize: number = 10) => {
    actions.setPageSize(pageSize);
  };

  const handleDelete = (id: number) => {
    DeleteConfirm(id, actions.deleteAnnouncement);
  };

  const getUserAccesses = async () => {
    await actions.getUserAccesses();
  };

  const getAnnouncements = async () => {
    setLoading(true);
    try {
      await actions.getAnnouncements();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (selectedPage: number) => {
    await actions.setCurrentPage(selectedPage);
    await getAnnouncements();
    history.push(`${selectedPage}`);
  };

  const handlePin = async (item: Announcement) => {
    await actions.pinAnnouncement(item.id);
    await actions.getAnnouncements();
    if (!item.isPined) {
      notificationLogic("success", "Оголошення відкріплено");
    } else {
      notificationLogic("success", "Оголошення закріплене");
    }
  };

  const showFullAnnouncement = async (annId: number) => {
    setVisibleAnnouncemnetModal(true);
    const pics: AnnouncementGallery[] = [];
    await getAnnouncementsById(annId).then((response) => {
      response.data.images.map((image: any) => {
        pics.push({
          announcementId: image.id,
          fileName: image.imageBase64,
        });
        return image;
      });
      if (!visibleAnnouncementModal) {
        return Modal.info({
          style: { top: 20 },
          centered: true,
          width: "500px",
          onCancel: () => setVisibleAnnouncemnetModal(false),
          onOk: () => setVisibleAnnouncemnetModal(false),
          title: (
            <div className={classes.announcementDate}>
              {response.data.user.firstName} {response.data.user.lastName}
              <div>{moment(response.data.date).format("DD.MM.YYYY")}</div>
            </div>
          ),
          content: (
            <div>
              <Markup content={response.data.title} />
              <Markup content={response.data.text} />

              <PicturesWall pictures={pics} key="removePictures" />
            </div>
          ),
          maskClosable: true,
          icon: null,
        });
      }
      return null;
    });
  };

  const setSelectedAnnouncement = (id: number) => {
    actions.setSelectedObject(id);
  };

  useEffect(() => {
    actions.setCurrentPage(page);
    actions.getUsersToSendMessadge();
    getAnnouncements();
  }, []);

  useEffect(() => {
    getUserAccesses();
  }, [page, state.pageSize]);

  const moreMenu = (
    <Menu theme="dark" className={classes.menu}>
      {state.userAccesses.DeleteAnnouncement ? (
        <Menu.Item
          key="1"
          onClick={() => {
            if (state.selectedObjectId) handleDelete(state.selectedObjectId);
          }}
        >
          <DeleteOutlined />
          Видалити
        </Menu.Item>
      ) : null}
      {state.userAccesses.DeleteAnnouncement ? (
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
        <h1> Дошка оголошень </h1>
        {state.userAccesses.AddAnnouncement ? (
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
            dataSource={state.announcements}
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
                              setSelectedAnnouncement(item.id);
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
                            title="Відкріпити оголошення"
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
                      description={moment(item.date).format("DD.MM.YYYY")}
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
              current: +state.pageNumber,
              pageSize: state.pageSize,
              responsive: true,
              total: state.announcementsCount,
              pageSizeOptions: ["12", "24", "36", "48"],
              onChange: (selectedPage) => handleChange(selectedPage),
              onShowSizeChange: (_selectedPage, size) => handleSizeChange(size),
            }}
          />
        )}
        <AddAnnouncementModal
          setVisibleModal={setVisibleAddModal}
          visibleModal={visibleAddModal}
        />
        {state.selectedObjectId ? (
          <>
            <EditAnnouncementModal
              setVisibleModal={setVisibleEditModal}
              visibleModal={visibleEditModal}
            />
          </>
        ) : null}
      </Content>
    </Layout>
  );
};

export default AnnouncementsTable;
