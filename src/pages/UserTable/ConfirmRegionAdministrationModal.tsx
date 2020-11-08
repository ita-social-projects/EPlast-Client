import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "antd";
import { getAdminTypeIdByName, AddAdmin } from "../../api/regionsApi";
import notificationLogic from "../../components/Notifications/Notification";

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: any) => void;
  onChange: (id: string, userRoles: string) => void;
  userId: string;
  regionId: number;
  adminType: any;
  startDate: any;
  endDate: any;
  endDayOld: any;
  oldAdminFirstName: string | undefined;
  oldAdminLastName: string | undefined;
}
const ConfirmRegionAdminModal = ({
  visibleModal,
  setVisibleModal,
  onChange,
  userId,
  regionId,
  adminType,
  startDate,
  endDate,
  endDayOld,
  oldAdminFirstName,
  oldAdminLastName,
}: Props) => {
  const handleCancel = () => {
    setVisibleModal(false);
  };

  const handleSubmit = async (values: any) => {
    const newAdmin: any = {
      id: 0,
      userId: userId,
      AdminTypeId: await (await getAdminTypeIdByName(adminType)).data,
      startDate: startDate,
      endDate: endDate,
      regionId: regionId,
    };
    await AddAdmin(newAdmin);
    notificationLogic("success", "Користувач успішно доданий в провід");
    onChange(userId, values.AdminType);
    setVisibleModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);

  return (
    <Modal
      title="Увага!"
      visible={visibleModal}
      centered
      footer={null}
      onCancel={() => setVisibleModal(false)}
      onOk={handleSubmit}
    >
      <div>
        <Form>
          <div style={{ margin: 10 }}>
            {oldAdminFirstName} {oldAdminLastName} є {adminType}, термін дії
            посади закінчується{" "}
            {endDayOld === "Invalid date" ? "ще не скоро" : endDayOld}.
            Призначити даного користувача на цю посаду?
          </div>
          <Form.Item className="cancelConfirmButtons">
            <Row justify="end">
              <Col xs={11} sm={5}>
                <Button key="back" onClick={handleCancel}>
                  Відмінити
                </Button>
              </Col>
              <Col
                className="publishButton"
                xs={{ span: 11, offset: 2 }}
                sm={{ span: 6, offset: 1 }}
              >
                <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                  Призначити
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ConfirmRegionAdminModal;
