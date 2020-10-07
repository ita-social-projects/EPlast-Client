import { Form, Input, DatePicker, AutoComplete, Select, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import RegionsApi from '../../api/regionsApi'
import classes from './Form.module.css'

import notificationLogic from '../../components/Notifications/Notification';
import { useParams } from 'react-router-dom';
import regionsApi from '../../api/regionsApi';

const RegionEditFormPage = () => {


    let currentRegion = Number(window.location.hash.substring(1)|| window.location.pathname.split('/').pop());
    const [form] = Form.useForm();


    const [chosenRegion, setCurrentRegion]= useState<any>({
        regionName: '',
        description: '',
        phoneNumber: '',
        email: '',
        link: '',
        street: '', 
        houseNumber: '',
        officeNumber: '',
        postIndex: ''
    })


    useEffect(() => {
        getRegion();
      }, [currentRegion]);

     const getRegion=async()=>{
       const response= await RegionsApi.getRegionById(currentRegion)
       setCurrentRegion(response.data);
     }


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
            postIndex: values.postIndex,

        }
        await RegionsApi.EditRegion(currentRegion, newRegion)

        form.resetFields();

        notificationLogic('success', "Успішно змінено дані округу");
    }

    return <Form
        name="basic"
        onFinish={handleSubmit}
        form={form}
    >
        <h1>Редагування даних округу</h1>
        <Form.Item
            className={classes.formField}
            label="Назва регіону"
            name="regionName"
            initialValue={chosenRegion.regionName}
            rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                },
            ]}
        >
             <Input
                className={classes.inputField} 
                placeholder={chosenRegion.regionName}
                />

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
                placeholder={chosenRegion.description}
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
           placeholder={chosenRegion.phoneNumber}
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
           placeholder={chosenRegion.email}
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
           placeholder={chosenRegion.link}
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
           placeholder={chosenRegion.street}
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
           placeholder={chosenRegion.houseNumber}
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
           placeholder={chosenRegion.officeNumber}
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
           placeholder={chosenRegion.postIndex}
                className={classes.inputField} />
        </Form.Item>


        <Form.Item style = {{ textAlign: "right"}}>
      
        <Button
         type="primary" htmlType="submit" 
        >
         Змінити
        </Button>

      </Form.Item> 

    </Form>;
}





export default RegionEditFormPage;