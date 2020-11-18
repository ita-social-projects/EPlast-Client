import React, { useState, useEffect } from 'react';
import classes from './Form.module.css'
import { Form, AutoComplete, Select, Button, Modal } from 'antd';
import regionsApi from '../../../api/regionsApi';
import notificationLogic from "../../../components/Notifications/Notification";
import { useHistory } from 'react-router-dom';
import {successfulCreateAction, tryAgain, emptyInput} from "../../../components/Notifications/Messages"

interface Props {
  visibleModal: boolean,
  handleOk: () => void,
}


 const AddNewRegionReport = (props: Props)=>{
    const { visibleModal, handleOk } = props;
    const history = useHistory();
    const [form] = Form.useForm();
    const [regions, setRegions] = useState<any[]>([{
        id:'',
        regionName:''
      }])

      const handleSubmit = async (values : any)=>{
          regionsApi.createRegionAnnualReport(JSON.parse(values.region).id, values.year) 
          .then(() => {
            notificationLogic("success", successfulCreateAction("Річний звіт"));
            window.location.reload();
          })
          .catch(() => {
            notificationLogic("error", tryAgain);
          });    
          form.resetFields(); 
        }

      useEffect(() => {
        const fetchData = async () => {
            await regionsApi.GetAllRegions().then(response => {
                setRegions(response.data);
            })
        }
        fetchData();
      }, [])

    return (<Modal
    title='Оберіть округ та рік для створення річного звіту'
    onCancel={handleOk}
    visible={visibleModal}
    footer={null} >
    <Form
         name="basic"
         onFinish={handleSubmit}
         form = {form}
     >
         <Form.Item
             className={classes.formField}
             label="Округ"
             name="region"

             rules={[
                 {
                     required: true,
                     message: emptyInput
                 },
             ]}
         >
            <Select
        showSearch
        className={classes.inputField}
        >
           
        {regions?.map((o) => ( <Select.Option key={o.id} value={JSON.stringify(o)}>{o.regionName}</Select.Option>))}
        </Select>
             
         </Form.Item>
        
         <Form.Item
             className={classes.formField}
             label="Рік подання"
             name="year"
             rules={[
                {
                    required: true,
                    message: emptyInput
                },
            ]}
         >
             <AutoComplete
            className={classes.inputField}
            options={[
              { value: 2019 },
              { value: 2020 },
              { value: 2021 },
              { value: 2022 },
              { value: 2023 },
              { value: 2024 },
              { value: 2025 },
              { value: 2026 }
            ]}
           
          placeholder={"Оберіть рік"}
          ></AutoComplete>
         </Form.Item>

         <Form.Item style = {{ textAlign: "right"}}>
         <Button
          type="primary" className={classes.clearButton}  onClick={()=> {form.resetFields()}}
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
     </Modal>)
}

export default AddNewRegionReport;