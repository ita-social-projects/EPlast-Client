import React, {useEffect, useState} from 'react';
import { Form, DatePicker, Select, Input, Button, AutoComplete } from 'antd';
import Distinction from '../Interfaces/Distinction';
import UserDistinction from '../Interfaces/UserDistinction';
import distinctionApi from '../../../api/distinctionApi';
import adminApi from '../../../api/adminApi';


import formclasses from '../../KadraVykhovnykiv/Form.module.css';
import moment from 'moment';


type FormAddDistinctionProps = {
    setVisibleModal: (visibleModal: boolean) => void;
    onAdd: () => void;
}


const FormAddDistinction : React.FC<FormAddDistinctionProps> = (props: any) => {
 
    const  { setVisibleModal, onAdd } = props;
    const [form] = Form.useForm();
    const [userData, setUserData] = useState<any[]>([{
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
      
    }]);
    const [distData, setDistData] = useState<Distinction[]>(Array<Distinction>());
    const dateFormat = 'DD-MM-YYYY';

    useEffect( () => {
        const fetchData = async () => {
            await distinctionApi.getDistinctions().then(response =>{
              setDistData(response.data)
            })
            await adminApi.getUsersForTable().then(response => { 
              setUserData(response.data)
            })
        };
        fetchData();
      }, []);

    const handleCancel = () => {
        setVisibleModal(false);
      };

    const handleSubmit = async (values : any) => {
        const newDistinction: any = {
                id: 0,
                distinctionId: JSON.parse(values.distinction).id,
                distinction: JSON.parse(values.distinction),
                userId: JSON.parse(values.user).id,
                date: moment(values.date).format("DD-MM-YYYY"),
                reporter: values.reporter,
                reason: values.reason,
            }
            await distinctionApi.addUserDistinction(newDistinction);
            setVisibleModal(false);
            form.resetFields();
            onAdd();
            
        }
        return (
            <Form
              name="basic"
              onFinish ={handleSubmit}
              form = {form}
            >
              <Form.Item
              className={formclasses.formField}
                label="Відзначення"
                name="distinction"
               
                rules={[
                  {
                    required: true,
                    message: 'Це поле має бути заповненим' 
                  },
                ]}
              >
                   <Select
                 className={formclasses.selectField}
                 >
                    {distData?.map((o) => ( <Select.Option key={o.id} value={JSON.stringify(o)}>{ o.name }</Select.Option>))}
                </Select>
              </Form.Item>
        
              <Form.Item
              className={formclasses.formField}
               label="Ім'я"
               name = "user"
               rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
                <Select
                 className={formclasses.selectField}
                 >
                {userData?.map((o) => ( <Select.Option key={o.user.id} value={JSON.stringify(o.user)}>{ o.user.firstName + " " + o.user.lastName }</Select.Option>))}
                </Select>
              </Form.Item>
            
              <Form.Item
              className={formclasses.formField}
               label="Подання від"
               name ="reporter" 
               rules = {[ { max: 250, 
                        message: 'Поле подання не має перевищувати 250 символів!' }]}
                >
        
                 <Input allowClear 
                 className={formclasses.inputField}/>
                
              </Form.Item>
        
        
              <Form.Item 
              className={formclasses.formField}
               name="date"
               label="Дата затвердження"
               rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
                <DatePicker format={dateFormat} 
                className={formclasses.selectField}
                />
              </Form.Item>

              <Form.Item 
              className={formclasses.formField}
               label="Обгрунтування"
               name = "reason"
               rules = {[ { max: 500, 
                message: 'Поле обгрунтування не має перевищувати 500 символів!' }]}
              >

                <Input.TextArea allowClear 
                 className={formclasses.inputField}/>
              </Form.Item>
        
              <Form.Item style = {{ textAlign: "right"}}>
              <Button 
                key="back"
                onClick = {handleCancel}
                >
                  Відмінити
                </Button>
                <Button
                 type="primary" htmlType="submit"
                >
                 Опублікувати
                </Button>
        
              </Form.Item> 
            </Form>
          );
        };
        
        export default FormAddDistinction ;
        

