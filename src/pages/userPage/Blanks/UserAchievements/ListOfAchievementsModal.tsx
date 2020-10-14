import { DeleteOutlined, DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import { List, Modal } from "antd";
import React, { useEffect } from "react";
import { getAchievementFile, removeAchievementDocument } from "../../../../api/blankApi";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import classes from "./ListOfAchievements.module.css"
import notificationLogic from '../../../../components/Notifications/Notification';


interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    achievementDoc: BlankDocument[];
    setAchievementDoc: (document: BlankDocument[]) => void;
}

const ListOfAchievementsModal = (props: Props) => {

    const handleCancel = () => {
        props.setVisibleModal(false);
    }

    const deleteFIle = async (documentId: number, fileName:string) => {
        await removeAchievementDocument(documentId);
        notificationLogic('success', `Файл "${fileName}" успішно видалено`);
        props.setAchievementDoc(props.achievementDoc.filter((d) => d.id !== documentId));
    }

    const downloadFile = async (fileBlob: string, fileName: string) => {
        await getAchievementFile(fileBlob,fileName);
    }

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
                                onClick={()=>downloadFile(item.blobName,item.fileName)}
                            />,
                            <DeleteOutlined
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