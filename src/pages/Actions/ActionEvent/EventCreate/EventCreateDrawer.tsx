import React from "react";
import { Drawer, Button } from "antd";
import EventCreate from "./EventCreate";
import ButtonCollapse from "../../../../components/ButtonCollapse/ButtonCollapse";

interface Props {
  visibleEventCreateDrawer: boolean;
  setShowEventCreateDrawer: (visibleEventCreateDrawer: boolean) => void;
  onCreate?: () => void;
}

const EventCreateDrawer = ({
  visibleEventCreateDrawer,
  setShowEventCreateDrawer,
  onCreate,
}: Props) => {
  const handleCancel = () => setShowEventCreateDrawer(false);

  return (
      <Drawer
        closable={false}
        title="Створити нову подію"
        width="auto"
        onClose={handleCancel}
        visible={visibleEventCreateDrawer}
        footer={null}
        forceRender={true}
      >
        <EventCreate
          onCreate={onCreate}
          setShowEventCreateDrawer={handleCancel}
        />
      </Drawer>
  );
};

export default EventCreateDrawer;
