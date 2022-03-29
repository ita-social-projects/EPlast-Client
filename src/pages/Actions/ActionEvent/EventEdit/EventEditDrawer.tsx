import React from "react";
import { Drawer, Button } from "antd";
import EventEdit from "./EventEdit";
import ButtonCollapse from "../../../../components/ButtonCollapse/ButtonCollapse";

interface Props {
  visibleEventEditDrawer: boolean;
  setShowEventEditDrawer: (visibleEventEditDrawer: boolean) => void;
  id: number;
  statusId: number;
  onEdit: () => void;
}

const EventEditDrawer = ({
  visibleEventEditDrawer,
  setShowEventEditDrawer,
  id,
  statusId,
  onEdit,
}: Props) => {
  const handleCancel = () => setShowEventEditDrawer(false);
  return (
    <Drawer
      closable={false}
      title="Редагувати подію"
      width="auto"
      onClose={handleCancel}
      visible={visibleEventEditDrawer}
      footer={null}
      forceRender={true}
    >
      <EventEdit
        id={id}
        statusId={statusId}
        onEdit={onEdit}
        setShowEventEditDrawer={handleCancel}
      />
    </Drawer>
  );
};

export default EventEditDrawer;
