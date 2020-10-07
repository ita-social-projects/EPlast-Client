import { Form, Input, DatePicker, AutoComplete, Select, Button, Layout, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import RegionsApi from '../../api/regionsApi'
import classes from './Form.module.css'
import "./CreateRegion.less"

import notificationLogic from '../../components/Notifications/Notification';

const AddNewRegionFormPage = () => {

    const [form] = Form.useForm();

    const handleSubmit = async (values: any) => {
        const newRegion: any = {
            regionName: values.regionName,
            description: values.description,
            phoneNumber: values.phoneNumber,
            email: values.email,
            link: values.link,
            street: values.street, 
            houseNumber: values.houseNumber,
            officeNumber: values.officeNumber,
            postIndex: values.postIndex
        }
        await RegionsApi.createRegion(newRegion)
        form.resetFields();

        notificationLogic('success', "Успішно додано округ");
    }

    return <Layout.Content className="createCity">
        <Card hoverable className="createCityCard">
    <Form
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

        <Form.Item
            className={classes.formField}
            label="Номер телефону"
            name="phoneNumber"

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
            label="Email"
            name="email"

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
            label="Link"
            name="link"

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
            label="Вулиця"
            name="street"

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
            label="Номер будинку"
            name="houseNumber"

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
            label="Номер офісу/квартири"
            name="officeNumber"

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
            label="Поштовий індекс"
            name="postIndex"

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
    </Card>
    </Layout.Content>
}





export default AddNewRegionFormPage;