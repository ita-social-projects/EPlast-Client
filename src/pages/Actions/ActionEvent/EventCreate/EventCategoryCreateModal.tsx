import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Modal, Select } from "antd";
import React, { useState } from "react";
import EventSections from "../../../../models/EventCreate/EventSections";
import notificationLogic from "../../../../components/Notifications/Notification";

interface EventCategoryCreateModalProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  newCategoryName: string | undefined;
  setNewCategoryName: (name: string) => void;
  eventSection: string | undefined;
  setEventSection: (section: string) => void;
  eventSections: EventSections[],
  eventType: string | undefined,
  addCategory: () => Promise<void>;
}

export const EventCategoryCreateModal: React.FC<EventCategoryCreateModalProps> = ({
  isVisible,
  setIsVisible,
  newCategoryName,
  setNewCategoryName,
  eventSection,
  setEventSection,
  eventSections,
  eventType,
  addCategory
}) => {
  const showWarning = () => {
    notificationLogic("warning", "Спочатку оберіть тип події.");
  }

  const handleOpenModal = () => {
    setIsVisible(true);
  }

  const handleCancelModal = () => {
    setIsVisible(false);
    setNewCategoryName('');
    setEventSection('');
  }

  return (
    <>
      <div>
        <a
          style={{
            flex: "none",
            padding: "8px",
            display: "block",
            cursor: "pointer",
          }}
          onClick={eventType ? handleOpenModal : showWarning}
        >
          <PlusOutlined /> Додати нову категорію
        </a>
        <Modal
          visible={isVisible}
          title="Додати нову категорію"
          onOk={addCategory}
          onCancel={handleCancelModal}
          footer={[
            <Button key="back" onClick={handleCancelModal}>
              Відмінити
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={addCategory}
              disabled={!newCategoryName || !eventSection}
            >
              Додати
            </Button>,
          ]}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              padding: 8,
            }}
          >
            <Input
              style={{ flex: "auto" }}
              placeholder="Назва категорії"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Select
              placeholder="Секція"
              value={eventSection}
              onChange={(e) => setEventSection(e)}
              style={{ paddingLeft: 9 }}
            >
              {eventSections.map((item: any) => (
                <Select.Option
                  key={item.eventSectionId}
                  value={item.eventSectionId}
                >
                  {item.eventSectionName}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Modal>
      </div>
    </>
  );
}