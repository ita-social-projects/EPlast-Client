import React from "react";
import { Drawer, Button } from "antd";
import EventEdit from "./EventEdit";

interface Props {
    visibleEventEditDrawer: boolean;
    setShowEventEditDrawer: (visibleEventEditDrawer: boolean) => void;
    id: number;
    onEdit: () => void;
}

const EventEditDrawer = ({ visibleEventEditDrawer, setShowEventEditDrawer, id, onEdit }: Props) => {

    const handleCancel = () => setShowEventEditDrawer(false);
    return (
        <Drawer
            title="Редагувати подію"
            width="auto"
            onClose={handleCancel}
            visible={visibleEventEditDrawer}
            footer={null}
            forceRender={true}
        >
            <EventEdit
                id={id}
                onEdit={onEdit}
                setShowEventEditDrawer={handleCancel}
            />
        </Drawer>
    );
}

export default EventEditDrawer;