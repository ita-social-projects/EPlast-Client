import React, {useState} from 'react';
import { Form, Select, Button, DatePicker, Checkbox } from 'antd';
import activeMembershipApi,{ PlastDegree, UserPlastDegreePost, UserPlastDegree } from '../../../../api/activeMembershipApi';
import classes from "./FormAddPlastDegree.module.css"
type FormAddPlastDegreeProps = {
    availablePlastDegree:  Array<PlastDegree>;
    setVisibleModal: (visibleModal: boolean) => void;
    handleDeleteUserPlastDegree : (plastDegreeId : number) => void;
    handleAddDegree : () => void;
    resetAvailablePlastDegree :() => Promise<void>;
    userId : string;
};

const FormAddPlastDegree = ({
    setVisibleModal,
    userId,
    availablePlastDegree,
    handleDeleteUserPlastDegree,
    handleAddDegree,
    resetAvailablePlastDegree}: FormAddPlastDegreeProps)=>{ 
    const [form] = Form.useForm();
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const handleFinish = async (info: any) =>{
       const userPlastDegreePost :UserPlastDegreePost ={
        plastDegreeId : info.plastDegree,
        dateStart : info.datepickerStart._d,
        dateFinish: null,
        isCurrent : isChecked,
        userId : userId
       };
       await activeMembershipApi.postUserPlastDegree(userPlastDegreePost);
       setVisibleModal(false);
       handleAddDegree();
       form.resetFields();
       resetAvailablePlastDegree();
    }
    const onChange = (e: any)=> {
        setIsChecked(e.target.checked);
    }  
    return <Form
    name="basic"
    onFinish ={handleFinish}
    form = {form}>
        <Form.Item
        name ="plastDegree"
         rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
        <Select
        placeholder={"Оберіть ступінь"}
        >{availablePlastDegree.map( apd => (<Select.Option key={apd.id} value={apd.id}>{apd.name}</Select.Option>))}</Select>
        </Form.Item>
        <Form.Item 
        className={classes.formField}
       name="datepickerStart"
       rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
        <DatePicker format = "YYYY-MM-DD"
        className={classes.selectField}
        placeholder="Дата надання ступеню"
        
        />
      </Form.Item>
     

      <Form.Item
      name ="isCurrent">
          <Checkbox onChange ={onChange} value = "">Обрати поточним</Checkbox></Form.Item>
           <Form.Item>
        <Button
        className={classes.cardButton}
         type="primary" htmlType="submit"
        >
         Додати
        </Button>
        </Form.Item>
    </Form>
}
export default FormAddPlastDegree;