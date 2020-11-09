import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import { Form, Input, DatePicker, AutoComplete, Select, Button, Layout } from 'antd';
import kadrasApi from "../../api/KadraVykhovnykivApi";
import notificationLogic from '../../components/Notifications/Notification';
import Spinner from '../Spinner/Spinner';
import moment from 'moment';


type FormUpdateKadraProps = {
    onAdd: () => void;
    record:number;
    onEdit:()=>void;
}


 const UpdateKadraForm: React.FC<FormUpdateKadraProps> = (props: any)=>{
    const  { onAdd, record , onEdit } = props;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(true);
   
    const [currentKadra, setCurrentKadra]=useState<any>({
        dateOfGranting: '',

        numberInRegister: '',

        basisOfGranting: '',

        link: ''
    })
     

      const handleSubmit = async (values : any)=>{
        const newKadra  : any= {

            id: record,

            dateOfGranting: values.dateOfGranting,

            numberInRegister: values.numberInRegister,

            basisOfGranting:values.basisOfGranting,

            link: values.link,
  
        }
        await kadrasApi.doesRegisterNumberExistEdit(newKadra.numberInRegister, newKadra.id).then(async responce=>{
          

                    if(responce.data==false){          
        await kadrasApi.putUpdateKadra(newKadra)
        form.resetFields();
        onAdd();
        onEdit();
        notificationLogic('success', "Відзнаку успішно змінено");
                     }
                     else{
                        notificationLogic('error', "Номер реєстру вже зайнятий");
                        form.resetFields();
                        onAdd();
                     }
          
                 })
            }
           
           
            const setCurrent=async ()=>{
                try{
            const response= await   kadrasApi.GetStaffById(record);
            setCurrentKadra( response.data)
                }
                finally{
                    setLoading(false)
                }
            }
        
      useEffect(() => {
          setCurrent();

      }, [])



    return <div>
    {currentKadra.numberInRegister === '' ? <Spinner/> :
    <Form
         name="basic"
         onFinish={handleSubmit}
         form = {form}
     >
       
        
         <Form.Item
             className={classes.formField}
             label="Дата вручення"
             name="dateOfGranting"
            initialValue={moment(currentKadra.dateOfGranting)}
             rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                },
            ]}
         >
             <DatePicker className={classes.inputField}/>
         </Form.Item>



         <Form.Item
             className={classes.formField}
             label="Номер в реєстрі"
             name="numberInRegister"
             initialValue={currentKadra.numberInRegister}
             rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                }
                
            ]}
         >
             <Input
              type="number"
              min={1}
              max={999999}
              value={currentKadra.numberInRegister}
              className={classes.inputField} />
         </Form.Item>


         <Form.Item
             className={classes.formField}
             label="Причина надання"
             name="basisOfGranting"
             initialValue={currentKadra.basisOfGranting}
             rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                },
                { max: 100, message: 'Поле не може перевищувати 100 символів' }
            ]}  
         >
             <Input
                value={currentKadra.basisOfGranting}
                 className={classes.inputField} />
         </Form.Item>

         <Form.Item
             className={classes.formField}
             label="Лінк"
             name="link"
             initialValue={currentKadra.link}
             rules={[
                { max: 500, message: 'Поле не може перевищувати 500 символів' }
            ]}
         >
             <Input
              value={currentKadra.link}
              className={classes.inputField} />
         </Form.Item>
         <Form.Item style = {{ textAlign: "right"}}>
      
        <Button
         type="primary" htmlType="submit" 
        >
         Опублікувати
        </Button>

      </Form.Item> 
        
     </Form>
 }
</div>
}

export default UpdateKadraForm;