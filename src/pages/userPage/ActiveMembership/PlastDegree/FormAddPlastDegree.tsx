import React,{useState, useEffect} from 'react';
import { Form, Select, Button,DatePicker } from 'antd';
import { type } from 'os';
import { PlastDegree, UserPlastDegreePost } from '../../../../api/activeMembershipApi';
import classes from "./FormAddPlastDegree.module.css"
type FormAddPlastDegreeProps = {
    availablePlastDegree:  Array<PlastDegree>;
    setVisibleModal: (visibleModal: boolean) => void;
}

const FormAddPlastDegree = ({setVisibleModal, availablePlastDegree}: FormAddPlastDegreeProps)=>{
    const [form] = Form.useForm();
    const handleFinish = (info: any) =>{
       const userPlastDegreePost :UserPlastDegreePost ={
        plastDegreeId : info.plastDegree,
        dateStart : info.datepickerStart._d,
        dateFinish: info.datepickerEnd._d,
        userId : "string"
       }
    }
    return <Form
    name="basic"
    onFinish ={handleFinish}
    form = {form}>
        <Form.Item
        name ="plastDegree"
         label="Назва ступеню"
         rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
<Select>{availablePlastDegree.map( apd => (<Select.Option key={apd.id} value={apd.id}>{apd.name}</Select.Option>))}</Select>
        </Form.Item>
        <Form.Item 
        className={classes.formField}
       name="datepickerStart"
       label="Дата  надання"
       rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
        <DatePicker format = "YYYY-MM-DD"
        className={classes.selectField}
        />
      </Form.Item>
      <Form.Item 
      className={classes.formField}
       name="datepickerEnd"
       label="Дата кінця">
        <DatePicker format = "YYYY-MM-DD"
        className={classes.selectField}
        />
      </Form.Item>
        <Button
         type="primary" htmlType="submit"
        >
         Додати
        </Button>
    </Form>
}
export default FormAddPlastDegree;