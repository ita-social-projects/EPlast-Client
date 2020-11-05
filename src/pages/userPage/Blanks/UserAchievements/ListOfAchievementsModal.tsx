import { DeleteOutlined, DownloadOutlined, EyeOutlined, FileImageOutlined, FilePdfOutlined, LoadingOutlined } from "@ant-design/icons";
import { List, message, Modal, Popconfirm } from "antd";
import React, { useEffect, useState } from "react";
import { getAchievementFile, openAchievemetFile, removeAchievementDocument, getAchievementsByPage } from "../../../../api/blankApi";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import classes from "./ListOfAchievements.module.css"
import notificationLogic from '../../../../components/Notifications/Notification';
import InfiniteScroll from 'react-infinite-scroller';
import { useParams } from "react-router-dom";



interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    achievementDoc: BlankDocument[];
    setAchievementDoc: (document: BlankDocument[]) => void;
    userToken: any;
}

const ListOfAchievementsModal = (props: Props) => {
    const { userId } = useParams();
    const [currentUser, setCuurrentUser] = useState(false);
    const [loadingMore, setLoadingMore] = useState({
        loading: false,
        hasMore: true
    });
    const [achievements, setAchievements] = useState<BlankDocument[]>([]);
    let [pageNumber, setPageNumber] = useState(0);
    const [pageSize] = useState(7);
    const [isEmpty, setIsEmpty] = useState(false);

    const handleCancel = () => {
        setLoadingMore({ loading: false, hasMore: true });
        setIsEmpty(false);
        setPageNumber(0);
        props.setVisibleModal(false);
        setAchievements([]);
    }

    const deleteFIle = async (documentId: number, fileName: string) => {
        await removeAchievementDocument(documentId);
        notificationLogic('success', `Файл "${fileName}" успішно видалено`);
        setAchievements(achievements.filter((d) => d.id !== documentId));
        props.setAchievementDoc(props.achievementDoc.filter((d) => d.id !== documentId));
    }

    const downloadFile = async (fileBlob: string, fileName: string) => {
        await getAchievementFile(fileBlob, fileName);
    }

    const hideDelete = () => {
        if (props.userToken.nameid === userId) {
            setCuurrentUser(false);
        } else {
            setCuurrentUser(true);
        }
    }

    const reviewFile = async (blobName: string, fileName: string) => {
        await openAchievemetFile(blobName, fileName);
    }

    const getAchievements = async () => {
        const response = await getAchievementsByPage(pageNumber, pageSize, userId);
        console.log(response);
        if (response.data.length == 0) {
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
        setPageNumber(++pageNumber);
    }

    useEffect(() => {
        hideDelete();
    }, []);

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
                    useWindow={false}>
                    <List
                        dataSource={achievements}
                        renderItem={item => (
                            <List.Item
                                actions={[
                                    <DownloadOutlined
                                        className={classes.downloadIcon}
                                        onClick={() => downloadFile(item.blobName, item.fileName)}
                                    />,
                                    <EyeOutlined
                                        className={classes.reviewIcon}
                                        onClick={() => reviewFile(item.blobName, item.fileName)} />,
                                    <Popconfirm
                                        title="Видалити цей документ?"
                                        placement="right"
                                        icon={false}
                                        onConfirm={() => deleteFIle(item.id, item.fileName)}
                                        okText="Так"
                                        cancelText="Ні">
                                        <DeleteOutlined
                                            hidden={currentUser}
                                            className={classes.deleteIcon}
                                        />
                                    </Popconfirm>
                                ]}>
                                {item.blobName.split(".")[1] === "pdf"
                                    ?
                                    <FilePdfOutlined
                                        className={classes.fileIcon} />
                                    :
                                    <FileImageOutlined
                                        className={classes.fileIcon}
                                    />
                                }
                                <List.Item.Meta
                                    className={classes.text}
                                    title={item.fileName}
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
}
export default ListOfAchievementsModal;