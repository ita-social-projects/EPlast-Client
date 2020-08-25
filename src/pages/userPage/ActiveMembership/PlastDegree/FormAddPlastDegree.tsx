import React,{useState, useEffect} from 'react';
import { Form, Select, Button,DatePicker } from 'antd';
import { type } from 'os';
import { PlastDegree } from '../../../../api/activeMembershipApi';
type FormAddPlastDegreeProps = {
    availablePlastDegree:  Array<PlastDegree>;
    setVisibleModal: (visibleModal: boolean) => void;
}

const FormAddPlastDegree = ({setVisibleModal, availablePlastDegree}: FormAddPlastDegreeProps)=>{
    const [form] = Form.useForm();
    const handleFinish = (info: any) =>{

    }
    return <Form
    name="basic"
    onFinish ={handleFinish}
    form = {form}>
        <Form.Item>
<Select>{availablePlastDegree.map( apd => (<Select.Option key={apd.id} value={JSON.stringify(apd)}>{apd.name}</Select.Option>))}</Select>
        </Form.Item>
        <Form.Item 
     //className={formclasses.formField}
       name="datepicker"
       label="Дата початку надання ступеню"
       rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
        <DatePicker format = "YYYY-MM-DD"
       // className={formclasses.selectField}
        />
      </Form.Item>
      <Form.Item 
     // className={formclasses.formField}
       name="datepicker"
       label="Дата кінця ступеню">
        <DatePicker format = "YYYY-MM-DD"
        //className={formclasses.selectField}
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