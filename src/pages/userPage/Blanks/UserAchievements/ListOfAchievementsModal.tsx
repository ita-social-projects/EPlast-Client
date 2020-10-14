import { FileTextOutlined } from "@ant-design/icons";
import { List, Modal } from "antd";
import React from "react";
import BlankDocument from "../../../../models/Blank/BlankDocument";
import classes from "./ListOfAchievements.module.css"

interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    achievementDoc: BlankDocument[];
}

const ListOfAchievementsModal = (props: Props) => {

    const handleCancel = () => {
        props.setVisibleModal(false);
    }

    return (
        <Modal
            visible={props.visibleModal}
            footer={null}
            onCancel={handleCancel}
        >
            <List
                dataSource={props.achievementDoc}
                renderItem={item => (
                    <List.Item>
                        <FileTextOutlined 
                        className={classes.fileIcon}/>
                        <List.Item.Meta
                        title={item.fileName}
                        />
                    </List.Item>
                )}
            />

        </Modal>
    );
}
export default ListOfAchievementsModal;