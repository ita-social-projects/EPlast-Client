import React, {useEffect, useState} from 'react';
import { Form, DatePicker, Select, Input, Upload, Button, AutoComplete } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import decisionsApi from '../../../api/distinctionApi';
import notificationLogic from '../../../components/Notifications/Notification';
import Distinction from '../Interfaces/Distinction';
import UserDistinction from '../Interfaces/UserDistinction';
import distinctionApi from '../../../api/distinctionApi';
import { User } from '../../userPage/EditUserPage/Interface';
import adminApi from '../../../api/adminApi';
import UserApi from '../../../api/UserApi';

import formclasses from '../../KadraVykhovnykiv/Form.module.css';
import { string, number } from 'yup';


type FormAddDistinctionProps = {
    setVisibleModal: (visibleModal: boolean) => void;
    onAdd: () => void;
}


const FormAddDistinction : React.FC<FormAddDistinctionProps> = (props: any) => {
 
    const  { setVisibleModal, onAdd } = props;
    const [form] = Form.useForm();
    const [userData, setUserData] = useState<any[]>([{
        user: {
            id: '',
            firstName: '',
            lastName: ''
        }
    }]);
    const [distData, setDistData] = useState<Distinction[]>([{
        name: '',
        id: 0
    }])

    useEffect( () => {
        const fetchData = async () => {
            const userData = ((await adminApi.getUsersForTable()).data)
            setUserData(userData);
            const distData = (await distinctionApi.getDistinctions()).data
            setDistData(distData);
        };
        fetchData();
      }, []);

    const handleCancel = () => {
        setVisibleModal(false);
      };

    const handleSubmit = async (values : any) => {
        const newDistinction : UserDistinction = {
                id: 0,
                distinctionId: 0,
                distinction: JSON.parse(values.distinction),
                user: values.user,
                userId: '',
                date:/* eslint no-underscore-dangle: ["error", { "allow": ["_d"] }] */ values.datepicker._d,
                reporter: values.reporter,
                reason: values.reason,
            }
            await distinctionApi.addUserDistinction(newDistinction);
            setVisibleModal(false);

            onAdd();
            form.resetFields();
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
                {userData?.map((o) => ( <Select.Option key={o.user.id} value={JSON.stringify(o)}>{ o.user.firstName + " " + o.user.lastName }</Select.Option>))}
                </Select>
              </Form.Item>
            
              <Form.Item
              className={formclasses.formField}
               label="Подання від"
               name ="reporter" >
        
                <AutoComplete
                filterOption={true}
                className={formclasses.selectField}
                >
                </AutoComplete>
                
              </Form.Item>
        
        
              <Form.Item 
              className={formclasses.formField}
               name="date"
               label="Дата затвердження"
               rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
                <DatePicker format = "YYYY-MM-DD"
                className={formclasses.selectField}
                />
              </Form.Item>

              <Form.Item 
              className={formclasses.formField}
               label="Обгрунтування"
               name = "reason">
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
        

