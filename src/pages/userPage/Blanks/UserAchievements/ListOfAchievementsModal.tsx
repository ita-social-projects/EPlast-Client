import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { List, Modal, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import {
  getAchievementFile,
  openAchievemetFile,
  removeAchievementDocument,
  getAchievementsByPage,
} from "../../../../api/blankApi";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import classes from "./ListOfAchievements.module.css";
import notificationLogic from "../../../../components/Notifications/Notification";
import InfiniteScroll from "react-infinite-scroller";
import { useParams } from "react-router-dom";
import { failDeleteAction, successfulDeleteAction } from "../../../../components/Notifications/Messages";
import extendedTitleTooltip from "../../../../components/Tooltip";
const fileNameMaxLength = 47;

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  hasAccessToSee?: boolean;
  hasAccessToDownload?: boolean;
  hasAccessToDelete?: boolean;
  userToken: {nameid: string};
  courseId?: number; 
}

const ListOfAchievementsModal = (props: Props) => {
  const { userId } = useParams();
  const [loadingMore, setLoadingMore] = useState({
    loading: false,
    hasMore: true,
  });
  const [achievements, setAchievements] = useState<BlankDocument[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(7);
  const [isEmpty, setIsEmpty] = useState(false);
  
  const handleCancel = () => {
    props.setVisibleModal(false);
    setLoadingMore({ loading: false, hasMore: true });
    setIsEmpty(false);
    setPageNumber(0);
    setAchievements([]);
  };

  const deleteFIle = async (documentId: number,  userId: string, fileName: string) => {
    try {
      await removeAchievementDocument(documentId, userId);
      notificationLogic("success", successfulDeleteAction(`Файл ${fileName}`));
      const achievementsWithoutDeleted = achievements.filter((d) => d.id !== documentId);
      setAchievements(achievementsWithoutDeleted);
    } catch (error) {
      notificationLogic("error", failDeleteAction(`Файл ${fileName}`));
    }
  };

  const downloadFile = async (fileBlob: string, fileName: string) => {
    await getAchievementFile(fileBlob, fileName);
  };

  const reviewFile = async (blobName: string, fileName: string) => {
    await openAchievemetFile(blobName, fileName);
  };

  const getAchievements = async () => {
    const response = await getAchievementsByPage(pageNumber, pageSize, userId, props.courseId);
    if (response.data.length === 0) {
      setIsEmpty(true);
    }
    var concatedAchievements = achievements.concat(response.data);
    setAchievements(concatedAchievements);
    setLoadingMore({ loading: false, hasMore: true });
  };

  const handleInfiniteOfLoad = () => {
    setLoadingMore({ loading: true, hasMore: true });
    if (isEmpty) {
      setLoadingMore({ loading: false, hasMore: false });
      return;
    }
    getAchievements();
    setPageNumber(prev => prev + 1);
  };

  const getActions = (blackDocumentItem: BlankDocument, isNotDocx = true) => {
    const actions: JSX.Element[] = [];
    if (props.hasAccessToDownload && isNotDocx) {
        actions.push(
          <EyeOutlined
            className={classes.reviewIcon}
            onClick={() =>
              reviewFile(blackDocumentItem.blobName, blackDocumentItem.fileName)
            }
          />
        );
    }
    if (props.hasAccessToSee) {
      actions.push(
        <DownloadOutlined
          className={classes.downloadIcon}
          onClick={() =>
            downloadFile(blackDocumentItem.blobName, blackDocumentItem.fileName)
          }
        />
      );
    }
    if (props.hasAccessToDelete) {
      actions.push(
        <Popconfirm
          title="Видалити цей документ?"
          placement="right"
          icon={false}
          onConfirm={() => deleteFIle(blackDocumentItem.id, blackDocumentItem.userId, blackDocumentItem.fileName)}
          okText="Так"
          cancelText="Ні"
        >
          <DeleteOutlined
            className={classes.deleteIcon}
          />
        </Popconfirm>
      );
    }
    return actions;
  }

  useEffect(() => {
    if (achievements.length === 0 && userId === props.userToken.nameid) {
      props.setVisibleModal(false);
      setLoadingMore({ loading: false, hasMore: true });
      setIsEmpty(false);
      setPageNumber(0);
    };
  }, [achievements]);

  return (
    <Modal
      title="Список досягнень"
      visible={props.visibleModal}
      footer={null}
      destroyOnClose={true}
      onCancel={handleCancel}
    >
      <div className={classes.demoInfiniteContainer}>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleInfiniteOfLoad}
          hasMore={!loadingMore.loading && loadingMore.hasMore}
          useWindow={false}
        >
          <List
            dataSource={achievements}
            renderItem={(item) => (
              <List.Item
                actions={
                  item.fileName.split(".").pop()! !== "doc" &&
                  item.fileName.split(".").pop()! !== "docx"
                    ? getActions(item)
                    : getActions(item, false)
                }
              >
                {item.blobName.split(".").pop()! === "pdf" ? (
                  <FilePdfOutlined className={classes.fileIcon} />
                ) : (
                  <FileImageOutlined className={classes.fileIcon} />
                )}
                <List.Item.Meta
                  className={classes.text}
                  title={extendedTitleTooltip(fileNameMaxLength, item.fileName)}
                />
              </List.Item>
            )}
          >
            {loadingMore.loading && loadingMore.hasMore && (
              <div className={classes.demoLoadingContainer}>
                <LoadingOutlined />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    </Modal>
  );
};
export default ListOfAchievementsModal;
