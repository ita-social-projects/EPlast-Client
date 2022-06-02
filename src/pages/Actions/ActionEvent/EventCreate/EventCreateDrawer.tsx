import React, { useEffect, useState } from "react";
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
  const [validationStartDate, setValidationStartDate] = useState<Date>(
    new Date()
  );

  useEffect(() => {
    if (visibleEventCreateDrawer === true) {
      setValidationStartDate(new Date());
    }
  }, [visibleEventCreateDrawer]);

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
        validationStartDate={validationStartDate}
      />
    </Drawer>
  );
};

export default EventCreateDrawer;
