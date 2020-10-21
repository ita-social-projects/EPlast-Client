import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import { Form, Input, DatePicker, AutoComplete, Select, Button } from 'antd';
import kadrasApi from "../../api/KadraVykhovnykivApi";
import adminApi from "../../api/adminApi";
import notificationLogic from '../../components/Notifications/Notification';

type FormAddKadraProps = {
    onAdd: () => void;
}



 const AddNewKadraForm: React.FC<FormAddKadraProps> = (props: any)=>{
    const  { onAdd } = props;
    const [form] = Form.useForm();
    const [users, setUsers] = useState<any[]>([{
        user:{
            id: '',
            firstName: '',
            lastName:'',
            birthday:''
        },
        regionName:'',
        cityName:'',
        clubName:'',
        userPlastDegreeName:'',
        userRoles:''
        
      }])


    const [types, setTypes] = useState<any[]>([{
        id: '',
        name: '',
      }])

     

      const handleSubmit = async (values : any)=>{
        const newKadra  : any= {
            id: 0,

            userId: JSON.parse(values.userId).user.id,

            KadraVykhovnykivTypeId:JSON.parse(values.KadraVykhovnykivType).id,

            dateOfGranting: values.dateOfGranting,

            numberInRegister: values.numberInRegister,

            basisOfGranting:values.basisOfGranting,

            link: values.link,
  
        }


         kadrasApi.doesRegisterNumberExist(newKadra.numberInRegister).then(responce=>{
            if (responce.data==false){
                 kadrasApi.doesUserHaveStaff(newKadra.userId,newKadra.KadraVykhovnykivTypeId).then(  async response=>{

                    if(response.data==false){
                      await kadrasApi.createKadra(newKadra)
                      form.resetFields();
                      onAdd();
                        
                      notificationLogic('success', "Користувач успішно отримав відзнаку");
                     }
                     else{
                      notificationLogic('error', "Користувач вже отримував цю відзнаку");
                      form.resetFields();
                      onAdd();
                     }
          
                 })
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
            await adminApi.getUsersForTable().then(response =>{
                setUsers(response.data);
            } )
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
             label="Користувач"
             name="userId"

             rules={[
                 {
                     required: true,
                     message: 'Це поле має бути заповненим'
                 },
             ]}
         >
            <Select
        showSearch
        className={classes.inputField}
        >
           
        {users?.map((o) => ( <Select.Option key={o.user.id} value={JSON.stringify(o)}>{o.user.firstName +" "+ o.user.lastName}</Select.Option>))}
        </Select>
             
         </Form.Item>

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
             rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                },
                { max: 100, message: 'Причина надання не може перевищувати 100 символів' }
            ]}
         >
             <Input
                 className={classes.inputField}  />
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

export default AddNewKadraForm;