import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import { Form, Input, DatePicker, AutoComplete, Select, Button } from 'antd';
import kadrasApi from "../../api/KadraVykhovnykivApi";


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

            KadraVykhovnykivTypeId:JSON.parse(values.KadraVykhovnykivType).id,

            dateOfGranting: values.dateOfGranting,

            numberInRegister: values.numberInRegister,

            basisOfGranting:values.basisOfGranting,

            link: values.link,
  
        }
        await kadrasApi.putUpdateKadra(newKadra)
        form.resetFields();
        onAdd();
        onEdit();
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
             label="Тип кадри"
             name="KadraVykhovnykivType"

             rules={[
                 {
                     required: true,
                     message: 'Це поле має бути заповненим'
                 },
             ]}
         >
             <Select
        filterOption={false}
        className={classes.inputField}
        >
             {types?.map((o) => ( <Select.Option key={o.id} value={JSON.stringify(o)}>{ o.name }</Select.Option>))}
            
        
        </Select>
         </Form.Item>

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