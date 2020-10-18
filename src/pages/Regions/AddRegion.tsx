import { Form, Input, DatePicker, AutoComplete, Select, Button, Layout, Card, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import RegionsApi from '../../api/regionsApi'
import classes from './Form.module.css'
import "./CreateRegion.less"
import CityDefaultLogo from "../../assets/images/default_city_image.jpg"
import notificationLogic from '../../components/Notifications/Notification';
import { RcCustomRequestOptions } from 'antd/es/upload/interface';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const AddNewRegionFormPage = () => {

    const [form] = Form.useForm();


    const [logo, setLogo]=useState<any>();

    const handleSubmit = async (values: any) => {
        const newRegion: any = {
            regionName: values.regionName,
            description: values.description,
            phoneNumber: values.phoneNumber,
            email: values.email,
            link: values.link,
            logo: logo,
            street: values.street, 
            houseNumber: values.houseNumber,
            officeNumber: values.officeNumber,
            postIndex: values.postIndex
        }
        await RegionsApi.createRegion(newRegion)
        form.resetFields();

        notificationLogic('success', "Успішно додано округ");
    }


    const checkFile = (size: number, fileName: string) => {
        const extension = fileName.split(".").reverse()[0];
        const isCorrectExtension =
          extension.indexOf("jpeg") !== -1 ||
          extension.indexOf("jpg") !== -1 ||
          extension.indexOf("png") !== -1;
        if (!isCorrectExtension) {
          notificationLogic("error", "Можливі розширення фото: png, jpg, jpeg");
        }
    
        const isSmaller2mb = size <= 3145728;
        if (!isSmaller2mb) {
          notificationLogic("error", "Розмір файлу перевищує 3 Мб");
        }
    
        return isCorrectExtension && isSmaller2mb;
      };

  const getBase64 = (img: Blob, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

    const handleUpload = (info: RcCustomRequestOptions) => {
        if (info !== null) {
          if (checkFile(info.file.size, info.file.name)) {
            getBase64(info.file, (base64: string) => {
              setLogo( base64 );
            });
            notificationLogic("success", "Фото завантажено");
          }
        } else {
          notificationLogic("error", "Проблема з завантаженням фото");
        }
      };



    return <Layout.Content className="createCity">
        <Card hoverable className="createCityCard">
    <Form
        name="basic"
        onFinish={handleSubmit}
        form={form}
    >
         <Form.Item name="logo">
            <Upload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              accept=".jpeg,.jpg,.png"
              customRequest={handleUpload}
            >
               
              
                <PlusOutlined />
              <img
                src={logo ? logo : CityDefaultLogo}
                alt="Region"
                className="cityLogo"
              />
            </Upload>
          </Form.Item>
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