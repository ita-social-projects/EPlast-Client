import React, { useEffect, useState } from "react";
import { Button, Form, Input, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import eventsApi from "../../../../api/eventsApi";
import EventCategories from "../../../../models/EventCreate/EventCategories";
import { eventCategoryInputValidator } from "./EventCategoriesEditFormValidators";
import notificationLogic from "../../../../components/Notifications/Notification";
import { failEditAction } from "../../../../components/Notifications/Messages";

interface EventCategoryEditFormProps {
    categoryToEdit: EventCategories;
    setCategoryToEdit: (category: EventCategories) => void;
    categories: EventCategories[];
    setCategories: (categories: EventCategories[]) => void
}

export const EventCategoryEditForm: React.FC<EventCategoryEditFormProps> = ({
    categoryToEdit,
    setCategoryToEdit,
    categories,
    setCategories
}) => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        const editedCategory: EventCategories = {
            eventCategoryId: categoryToEdit.eventCategoryId,
            eventCategoryName: values.categoryName,
            eventSectionId: categoryToEdit.eventSectionId
        }
        
        eventsApi.updateEventCategory(editedCategory)
            .then(() => {
                const categoryToUpdateIdx = categories
                    .findIndex(c => c.eventCategoryId === editedCategory.eventCategoryId);
                categories[categoryToUpdateIdx] = editedCategory;
                setCategories([...categories]);
                form.resetFields();
                notificationLogic("success", "Категорію змінено!");
            })
            .catch(() => {
                notificationLogic("error", failEditAction("категорію."));
            });
    }

    useEffect(() => {
        form.setFieldsValue({
            categoryName: categoryToEdit.eventCategoryName
        });
    }, [categoryToEdit]);

    return (
        <Form form={form} onFinish={onFinish} layout="inline" size="large">
            <Input.Group compact>
                <Form.Item
                    style={{ width: "calc(100% - 80px)" }}
                    name="categoryName"
                    rules={eventCategoryInputValidator}
                >
                    <Input 
                        placeholder="Редагувати категорію"
                    />
                </Form.Item>
                <Form.Item noStyle>
                    <Tooltip title="Змінити">
                        <Button
                            htmlType="submit"
                            type="primary"
                            icon={<CheckOutlined />}
                        ></Button>
                    </Tooltip>
                </Form.Item>
                <Form.Item noStyle>
                    <Tooltip title="Скасувати">
                        <Button
                            htmlType="button"
                            icon={<CloseOutlined />}
                            onClick={() => {
                                setCategoryToEdit(new EventCategories());
                                form.resetFields();
                            }}
                        >
                        </Button>
                    </Tooltip>
                </Form.Item>
            </Input.Group>
        </Form>
    );
}