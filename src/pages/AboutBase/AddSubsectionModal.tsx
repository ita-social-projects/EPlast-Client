import React from "react";
import { Drawer } from "antd";
import FormAddSubsection from "./FormAddSubsection";

interface Props {
    visibleModal: boolean;
    setVisibleModal: (visibleModal: boolean) => void;
    sectId: number;
    fetchSubData: Function
    //onAdd: () => void;
}

const AddSubsectionModal = ({
    visibleModal,
    setVisibleModal,
    sectId,
    fetchSubData
    //onAdd,
}: Props) => {
    const handleCancel = () => {
        setVisibleModal(false);
    }
    return (
        <Drawer
            width="auto"
            title="Додати підрозділ"
            visible={visibleModal}
            onClose={handleCancel}
            footer={null}
        >
            <FormAddSubsection setVisibleModal={setVisibleModal} sectId={sectId} fetchSubData={fetchSubData} /*onAdd={onAdd}*/ />
        </Drawer>
    );
};

export default AddSubsectionModal;
