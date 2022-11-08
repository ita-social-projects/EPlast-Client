import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { List, Modal, Tooltip, Typography } from "antd";
import React, { useState } from "react";
import eventsApi from "../../../../api/eventsApi";
import EventCategories from "../../../../models/EventCreate/EventCategories";
import { EventCategoryEditForm } from "./EventCategoryEditForm";
import notificationLogic from "../../../../components/Notifications/Notification";

import classes from "../EventCreate/EventCreate.module.css";
import { failDeleteAction } from "../../../../components/Notifications/Messages";

interface EventCategoriesEditProps {
    categories: EventCategories[];
    setCategories: (categories: EventCategories[]) => void
}

export const EventCategoriesEdit: React.FC<EventCategoriesEditProps> = ({
    categories,
    setCategories
}) => {
    const [categoryToEdit, setCategoryToEdit] = useState(new EventCategories());

    const editCategory = (category: EventCategories) => {
        console.log(category);
        setCategoryToEdit(category);
    }

    const deleteCategory = async (id: number) => {
        Modal.confirm({
            title: "Ви справді хочете видалити цю категорію? Це спричинить видалення всіх створенних подій за цією категорією.",
            icon: <ExclamationCircleOutlined style={{ color: "#FF0000" }}/>,
            okText: "Так",
            cancelText: "Ні",
            onOk() {
                eventsApi
                    .deleteEventCategory(id)
                    .then(() => {
                        const resultCategories = categories
                            .filter(category => category.eventCategoryId !== id);
                        setCategories(resultCategories);
                        notificationLogic("success", "Категорію видалено!");
                    })
                    .catch(() => {
                        notificationLogic("error", failDeleteAction("категорію"));
                    });
            }
        });
        
    }

    return (
        <>
            <List
                className={classes.eventCategoriesList}
                dataSource={categories}
                renderItem={(category) => (
                    <List.Item
                        actions={[
                            <Tooltip title="Редагувати категорію">
                                <EditOutlined
                                    className={classes.editIcon}
                                    onClick={() => editCategory(category)}
                                />
                            </Tooltip>,
                            <Tooltip title="Видалити категорію" placement="left">
                                <DeleteOutlined
                                    className={classes.deleteIcon}
                                    onClick={() => deleteCategory(category.eventCategoryId)}
                                />
                            </Tooltip>
                        ]}
                    >
                        <Tooltip title={category.eventCategoryName}>
                            <Typography.Text ellipsis>
                                {category.eventCategoryName}
                            </Typography.Text>
                        </Tooltip>
                    </List.Item>
                )}
            />
            <br />
            <EventCategoryEditForm 
                categoryToEdit={categoryToEdit}
                setCategoryToEdit={setCategoryToEdit}
                categories={categories}
                setCategories={setCategories}
            />
        </>
    );
}