import React from 'react';
import { Modal, Form,DatePicker, Button } from 'antd';
import activeMembershipApi,{ UserDates } from '../../../../api/activeMembershipApi';
import classes from './ModalChangeUserDates.module.css';
import moment from 'moment';

type props = {
    userId : string;
    dates : any;
    datesVisibleModal : boolean;
    setDatesVisibleModal : (visibleModal: boolean) => void;
    handleChangeDates :() => void;
}
const ModalChangeUserDates = ({
    userId,
    dates,
    datesVisibleModal,
    setDatesVisibleModal,
    handleChangeDates
    }: props) =>{
    const [form] = Form.useForm();
    const handleCancel = () => setDatesVisibleModal(false);
    
    const SetDate  = (date: any, prevDate : string) : string =>
    {
        if (date === undefined) {
            if(prevDate === "")
                return "0001-01-01T00:00:00";
            else
                return prevDate;
        }
        else if(date === null){
            return "0001-01-01T00:00:00";
        }
        else{
            return moment(date._d).format();
        }
    }

    function disabledDate(current: any, date: string) {
        return current && current < moment(date).endOf('day');
      }

    const handleFinish = async (info : any)=>{
        const userDatesChange : UserDates = {
            userId : userId,
            dateEntry : dates.dateEntry,
            dateOath : SetDate(info.datepickerOath, dates.dateOath),
            dateEnd : SetDate(info.datepickerEnd, dates.dateEnd) 
        };

        
        setDatesVisibleModal(false);
        await activeMembershipApi.postUserDates(userDatesChange);
        handleChangeDates();
    };
    return <Modal
        visible={datesVisibleModal}
        onCancel = {handleCancel}
        title = "Зміна даних користувача"
        footer = {null}>
    <Form
     name="basic"
     onFinish ={handleFinish}
     form = {form}>
        <label htmlFor="datepickerOath" className={classes.formLabel}> Дата присяги </label>
        <Form.Item 
        className={classes.formField}
       name="datepickerOath">
        <DatePicker format = "YYYY-MM-DD" 
        disabledDate={(cur) => disabledDate(cur ,dates.dateEntry)}
        defaultValue = { dates.dateOath !== "" ? moment(dates.dateOath, 'YYYY-MM-DD') : undefined}
        className={classes.selectField}
        placeholder="Дата присяги"
        />
        </Form.Item>
        
        <label htmlFor="datepickerEnd" className={classes.formLabel}> Дата завершення </label>
        <Form.Item 
        className={classes.formField}
       name="datepickerEnd">
        <DatePicker format = "YYYY-MM-DD" 
        disabledDate={(cur) => disabledDate(cur ,dates.dateEntry)}
        defaultValue = { dates.dateEnd !== "" ? moment(dates.dateEnd, 'YYYY-MM-DD') : undefined}
        className={classes.selectField}
        placeholder="Дата завершення"
        />
      </Form.Item>
      <Form.Item>
        <Button
        className={classes.cardButton}
         type="primary" htmlType="submit"
        >
         Змінити
        </Button>
        </Form.Item>
    </Form>
</Modal>
}
export default ModalChangeUserDates;