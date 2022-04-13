import { Button, Col, Form, Row } from "antd";
import React from "react";
import { removeMainAdministrator } from "../../api/governingBodiesApi";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import notificationLogic from "../../components/Notifications/Notification";
import { Roles } from "../../models/Roles/Roles";

interface Props {
    onChange: (id: string, userRoles: string) => void;
    setShowModal: (showModal: boolean) => void;
    user: any;
}


const DeleteGoverningBodyAdminForm = ({
    user,
    setShowModal,
    onChange,
}: Props) => {

    const [form] = Form.useForm();

    const handleFinish = async (
    ) => {
        await removeMainAdministrator(user.id);
        onChange(user.id, Roles.GoverningBodyAdmin);
        setShowModal(false);
        notificationLogic("success", "Роль користувача успішно зміненна");
        await NotificationBoxApi.createNotifications(
          [user.id],
          `У Вас більше немає адміністративної ролі: '${Roles.GoverningBodyAdmin}'`,
          NotificationBoxApi.NotificationTypes.UserNotifications
        );
    }

    return (
        <div>
            <Form name="basic" onFinish={handleFinish} form={form}>
                <Form.Item className="cancelConfirmButtons">
                    <Row justify="end">
                        <Col xs={11} sm={5}>
                            <Button key="back" onClick={() => setShowModal(false)}>
                                Повернутися
                            </Button>
                        </Col>
                        <Col
                            className="publishButton"
                            xs={{ span: 11, offset: 2 }}
                            sm={{ span: 6, offset: 1 }}
                        >
                            <Button type="primary" htmlType="submit">
                                Відмінити роль
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </div>
    );
}

export default DeleteGoverningBodyAdminForm;