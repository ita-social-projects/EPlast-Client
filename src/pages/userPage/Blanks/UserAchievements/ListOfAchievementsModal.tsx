import { DeleteOutlined, DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import { List, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { getAchievementFile, removeAchievementDocument } from "../../../../api/blankApi";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import classes from "./ListOfAchievements.module.css"
import notificationLogic from '../../../../components/Notifications/Notification';
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
    const[currentUser,setCuurrentUser] = useState(false);

    const handleCancel = () => {
        props.setVisibleModal(false);
    }

    const deleteFIle = async (documentId: number, fileName: string) => {
        await removeAchievementDocument(documentId);
        notificationLogic('success', `Файл "${fileName}" успішно видалено`);
        props.setAchievementDoc(props.achievementDoc.filter((d) => d.id !== documentId));
    }

    const downloadFile = async (fileBlob: string, fileName: string) => {
        await getAchievementFile(fileBlob, fileName);
    }

    const hideDelete =  ()=> {
        if (props.userToken.nameid === userId) {
             setCuurrentUser(false);
        } else {
            setCuurrentUser(true);
        }
    }

    useEffect(() => {
        hideDelete();
    }, []);

    return (
        <Modal
            title="Список досягнень"
            visible={props.visibleModal}
            footer={null}
            onCancel={handleCancel}
        >
            <List
                dataSource={props.achievementDoc}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <DownloadOutlined
                                className={classes.downloadIcon}
                                onClick={() => downloadFile(item.blobName, item.fileName)}
                            />,
                            <DeleteOutlined
                                hidden={currentUser}
                                className={classes.deleteIcon}
                                onClick={() => deleteFIle(item.id, item.fileName)}
                            />
                        ]}>
                        <FileTextOutlined
                            className={classes.fileIcon} />
                        <List.Item.Meta
                            className={classes.text}
                            title={item.fileName}
                        />
                    </List.Item>
                )}
            />

        </Modal>
    );
}
export default ListOfAchievementsModal;