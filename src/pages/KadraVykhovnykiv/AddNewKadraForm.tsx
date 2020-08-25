import React from 'react';
import classes from './Form.module.css'
import { Form, Input, DatePicker } from 'antd';

 const AddNewKadraForm : React.FC = ()=>{

    return <Form
         name="basic"
     >
         <Form.Item
             className={classes.formField}
             label="Користувач"
             name="name"

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
             label="Тип кадри"
             name="kvTypesID"

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

     </Form>;


}

export default AddNewKadraForm;