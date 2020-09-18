import React, {useState, useEffect} from 'react';
import { Form, Input,Button, Select, DatePicker } from 'antd';
import distinctionApi from '../../../api/distinctionApi';
import UserDistinction from '../Interfaces/UserDistinction';
import userEvent from '@testing-library/user-event';
import formclasses from './Form.module.css';
import adminApi from '../../../api/adminApi';
import Distinction from '../Interfaces/Distinction';
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

interface Props {
  record: number;
  distinction: UserDistinction;
  setShowModal: (showModal: boolean) => void;
  onEdit :(id: number, distinction: Distinction, date: Date, reason: string, reporter: string, user: any, userId: string) => void;
}

const FormEditDistinction = ({ record,  setShowModal, onEdit, distinction}: Props) => {
  const [loading, setLoading] = useState(false);
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
  const dateFormat = 'DD-MM-YYYY';;

  useEffect(() => {
    setLoading(true);
    form.resetFields();
    const fetchData = async () => {
        setDistData([]);
        setUserData([]);
        await distinctionApi.getDistinctions().then(response =>{
          setDistData(response.data)
        })
        await adminApi.getUsersForTable().then(response => { 
          setUserData(response.data)
        })
    };
    fetchData();
     setLoading(false);
  },[distinction]);


  const handleCancel = () => {
    setShowModal(false);
  }
  const handleFinish = async (dist : any) => {
    const newDistinction : any = {
    id : record,
    distinctionId: JSON.parse(dist?.distinction).id,
    date: dist?.date,
    distinction: JSON.parse(dist?.distinction),
    user: JSON.parse(dist?.user),
    userId: JSON.parse(dist?.user).id,
    reason: dist?.reason,
    reporter: dist?.reporter
  };
    await distinctionApi.editUserDistinction(newDistinction);
    setShowModal(false);
    form.resetFields();
    onEdit(newDistinction.id, newDistinction.distinction, 
        newDistinction.date, newDistinction.reason, 
        newDistinction.reporter, newDistinction.user,
        newDistinction.user.id);
    
    };

  return (
   <div>
    {!loading && (
      <Form
      name="basic"
     onFinish ={handleFinish}
     form ={form}
    >
      <Form.Item
              className={formclasses.formField}
                label="Відзначення"
                name="distinction"
                initialValue = {distinction.distinction.name}
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
               initialValue = {distinction.user.firstName + " " + distinction.user.lastName}
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
               initialValue = {distinction.reporter}
               rules = {[ { max: 100, 
                        message: 'Поле подання не має перевищувати 100 символів!' }]} >
        
              <Input allowClear 
                 className={formclasses.inputField}
                  maxLength = {101}/>
                
              </Form.Item>
        
        
              <Form.Item 
              className={formclasses.formField}
               name="date"
               label="Дата затвердження"
               initialValue = {moment(distinction.date)}
               rules={[ { required: true,  message: 'Це поле має бути заповненим'}]}>
                <DatePicker format={dateFormat} 
                className={formclasses.selectField}
                />
              </Form.Item>

              <Form.Item 
              className={formclasses.formField}
               label="Обгрунтування"
               name = "reason"
               initialValue = {distinction.reason}
               rules = {[ { max: 250, 
                message: 'Поле обгрунтування не має перевищувати 250 символів!' }]}
                >
                <Input.TextArea allowClear 
                 className={formclasses.inputField}
                 maxLength = {251}/>
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
    </Form>)}
    </div>
  );
};

export default FormEditDistinction;
