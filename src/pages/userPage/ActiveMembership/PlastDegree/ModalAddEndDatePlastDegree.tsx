import React from 'react';
import { Modal, Form,DatePicker, Button } from 'antd';
import classes from "./FormAddPlastDegree.module.css"
import activeMembershipApi,{ UserPlastDegreePut } from '../../../../api/activeMembershipApi';
import moment from 'moment';
import{ emptyInput } from "../../../../components/Notifications/Messages"
type props = {
    userId : string;
    plastDegreeId : number;
    dateOfStart : string;
    endDateVisibleModal : boolean;
    setEndDateVisibleModal: (visibleModal: boolean) => void;
    handleAddEndDate :() => void;
}
const ModalAddEndDatePlastDegree = ({
    userId,
    plastDegreeId,
    dateOfStart,
    endDateVisibleModal,
    setEndDateVisibleModal,
    handleAddEndDate
    }: props) =>{
    const [form] = Form.useForm();
    const handleCancel = () => setEndDateVisibleModal(false);
    const handleFinish = async (info : any)=>{
        const userPlastDegreePut : UserPlastDegreePut = {
            userId : userId,
            plastDegreeId : plastDegreeId,
            endDate: info.datepickerEnd._d
        };
        await activeMembershipApi.addEndDateForUserPlastDegree(userPlastDegreePut);
        handleAddEndDate();
        form.resetFields();
        setEndDateVisibleModal(false);
        };

        function disabledDate(current: any, date: string) 
        {
            return current && current < moment(date).endOf('day')
        }

    return <Modal
        visible={endDateVisibleModal}
        onCancel = {handleCancel}
        title = "Надання дати завершення для пластового ступеня"
        footer = {null}>
    <Form
     name="basic"
     onFinish ={handleFinish}
     form = {form}>
          <Form.Item 
        className={classes.formField}
       name="datepickerEnd"
       rules={[ { required: true,  message: emptyInput()}]}>
        <DatePicker format = "DD.MM.YYYY"
        disabledDate={(cur) => disabledDate(cur , dateOfStart)}
        className={classes.selectField}
        placeholder="Дата закінчення ступеню"
        
        />
      </Form.Item>
      <Form.Item>
        <Button
        className={classes.cardButton}
         type="primary" htmlType="submit"
        >
         Додати
        </Button>
        </Form.Item>
    </Form>
</Modal>
}
export default ModalAddEndDatePlastDegree;
