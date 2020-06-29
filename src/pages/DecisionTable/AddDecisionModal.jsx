import React from 'react';
import { Modal, Button } from 'antd';
import FormAddDecision from './FormAddDecision';
import classes from './Table.module.css';


// eslint-disable-next-line react/prop-types
const AddDecisionModal = ({ visibleModal, setVisibleModal }) => {

    const handleOk = () => { console.log("handleOk")};

    const handleCancel = () => setVisibleModal(false);

    return (
        <Modal
            title="Додати рішення пластового проводу"
            visible={visibleModal}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Відміна
            </Button>,
                <Button key="submit" className={classes.addDecision} onClick={handleOk}>
                    Опублікувати
            </Button>,
            ]}
        >
            <FormAddDecision />
        </Modal>
    )
}

export default AddDecisionModal;