import { Form, Input, DatePicker, AutoComplete, Select, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import RegionsApi from '../../api/regionsApi'
import classes from './Form.module.css'

import notificationLogic from '../../components/Notifications/Notification';

const AddNewRegionFormPage = () => {

    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        const newRegion: any = {
            regionName: values.regionName,
            description: values.description,
        }
        await RegionsApi.createRegion(newRegion)
        form.resetFields();

        notificationLogic('success', "Успішно додано округ");
    }

    return <Form
        name="basic"
        onFinish={handleSubmit}
        form={form}
    >
        <Form.Item
            className={classes.formField}
            label="Назва регіону"
            name="regionName"

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
            label="Опис"
            name="description"

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

        <Form.Item style = {{ textAlign: "right"}}>
      
        <Button
         type="primary" htmlType="submit" 
        >
         Додати
        </Button>

      </Form.Item> 

    </Form>;
}





export default AddNewRegionFormPage;