import { CheckSquareFilled, DeleteFilled, EditFilled, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Input, Modal, Tooltip } from "antd";
import React, { useState } from "react";
import UserApi from "../../api/UserApi";

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
        }
        catch (error) {
            showError(error.message);
        }
        finally {
            setEditing(false);
            setLoading(false);
            setText("");
        }
    }

    return (
        isLoading
            ? <LoadingOutlined/>
            : isEditing
                ?   <>
                        <Input value={text} onChange={evt => setText(evt.target.value)}/>
                        <CheckSquareFilled onClick={handleEdit}/>
                    </>
                : text 
                    ?   <div className="commentContainer">
                            {text}
                            <EditFilled onClick={() => setEditing(true)}/>
                            <DeleteFilled onClick={handleDelete}/>
                        </div>
                    :   <Tooltip title="Додати коментар">
                            <PlusOutlined onClick={() => setEditing(true)}/>
                        </Tooltip>
    )
}

export default UserComment;