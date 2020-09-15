import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import { Form, Input, DatePicker, AutoComplete, Select, Button } from 'antd';
import kadrasApi from "../../api/KadraVykhovnykivApi";
import notificationLogic from '../../components/Notifications/Notification';


type FormUpdateKadraProps = {
    onAdd: () => void;
    record:number;
    onEdit:()=>void;
}



 const UpdateKadraForm: React.FC<FormUpdateKadraProps> = (props: any)=>{
    const  { onAdd, record , onEdit } = props;
    const [form] = Form.useForm();
   

    const [types, setTypes] = useState<any[]>([{
        id: '',
        name: '',
      }])
     

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
           
           


        
      useEffect(() => {
        const fetchData = async () => {
            await kadrasApi.getAllKVTypes().then(response => {
                setTypes(response.data);
            })
           
        }
        fetchData();
      }, [])



    return <Form
         name="basic"
         onFinish={handleSubmit}
         form = {form}
     >
       
        

         <Form.Item
             className={classes.formField}
             label="Дата вручення"
             name="dateOfGranting"
         >
             <DatePicker className={classes.inputField}/>
         </Form.Item>



         <Form.Item
             className={classes.formField}
             label="Номер в реєстрі"
             name="numberInRegister"

             rules={[
                 {
                     required: true,
                     message: 'Це поле має бути заповненим'
                 },
             ]}
         >
             <Input
                 className={classes.inputField} />
         </Form.Item>


         <Form.Item
             className={classes.formField}
             label="Причина надання"
             name="basisOfGranting"
             rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                },
                { max: 100, message: 'Причина надання не може перевищувати 100 символів' }
            ]}  
         >
             <Input
                 className={classes.inputField} />
         </Form.Item>

         <Form.Item
             className={classes.formField}
             label="Лінк"
             name="link"
         >
             <Input
                 className={classes.inputField} />
         </Form.Item>
         <Form.Item style = {{ textAlign: "right"}}>
      
        <Button
         type="primary" htmlType="submit" 
        >
         Опублікувати
        </Button>

      </Form.Item> 
        
     </Form>;


}

export default UpdateKadraForm;