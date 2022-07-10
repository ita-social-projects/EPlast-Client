import { CheckOutlined, CheckSquareFilled, DeleteFilled, EditFilled, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Modal, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState } from "react";
import UserApi from "../../api/UserApi";
import "./UserComment.less";
interface CommentProperties {
    userId: string;
    text: string;
    canEdit: boolean;
}

const UserComment = (props: CommentProperties) => {
    const [text, setText] = useState(props.text);
    const [isLoading, setLoading] = useState(false);
    const [isEditing, setEditing] = useState(false);

    const showError = (message: string) => {
        Modal.error({
          title: "Помилка!",
          content: message,
        });
    };

    const handleEdit = async () => {
        if (props.text === text) {
            setEditing(false);
            return;
        }

        setLoading(true);
        try {
            await UserApi.putComment(props.userId, text);
        }
        catch (error) {
            showError(error.message);
        }
        finally {
            setEditing(false);
            setLoading(false);
        }
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            await UserApi.deleteComment(props.userId);
            setText("");
        }
        catch (error) {
            showError(error.message);
        }
        finally {
            setEditing(false);
            setLoading(false);
        }
    }

    return (
        isLoading
            ? <LoadingOutlined/>
            : isEditing
                ?   <div className="commentContainer">
                        <TextArea value={text} onChange={evt => setText(evt.target.value)} autoSize={{minRows: 2, maxRows: 10}} maxLength={256}/>
                        <Tooltip title="Зберегти коментар">
                            <CheckOutlined className="commentIcon" onClick={handleEdit}/>
                        </Tooltip>
                    </div>
                : text 
                    ?   <div className="commentContainer">
                            <Tooltip title={text}>
                                <span className="commentText">
                                    {text}
                                </span>
                            </Tooltip>
                            {props.canEdit ? 
                            <>
                                <Tooltip title="Редагувати коментар">
                                    <EditFilled className="commentIcon" onClick={() => setEditing(true)}/>
                                </Tooltip>
                                <Tooltip title="Видалити коментар">
                                    <DeleteFilled className="commentIcon" onClick={handleDelete}/>
                                </Tooltip>
                            </>
                            : null}
                        </div>
                    :   props.canEdit
                            ?   <Tooltip title="Додати коментар">
                                    <PlusOutlined onClick={() => setEditing(true)}/>
                                </Tooltip>
                            : null
    )
}

export default UserComment;