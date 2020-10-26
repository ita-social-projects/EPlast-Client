import { Form, Input, DatePicker, AutoComplete, Select, Button, Layout, Card, Upload, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
import RegionsApi from '../../api/regionsApi'
import classes from './Form.module.css'
import "./CreateRegion.less"
import notificationLogic from '../../components/Notifications/Notification';
import regionsApi from '../../api/regionsApi';
import { PlusOutlined } from '@ant-design/icons';
import CityDefaultLogo from "../../assets/images/default_city_image.jpg"
import { RcCustomRequestOptions } from 'antd/es/upload/interface';
import { useHistory } from 'react-router-dom';

const RegionEditFormPage = () => {


    let currentRegion = Number(window.location.hash.substring(1)|| window.location.pathname.split('/').pop());
    const [form] = Form.useForm();
    const history = useHistory();

    const [logo, setLogo] = useState<any>();

    const [chosenRegion, setCurrentRegion]= useState<any>({
        regionName: '',
        description: '',
        phoneNumber: '',
        email: '',
        link: '',
        street: '', 
        houseNumber: '',
        officeNumber: '',
        postIndex: '',
        logo:''
    })


    useEffect(() => {
        getRegion();
       
      }, [currentRegion]);

     const getRegion=async()=>{
       const response= await RegionsApi.getRegionById(currentRegion)
       setCurrentRegion(response.data);
       setLogo(response.data.logo);
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
            logo: logo

        }
        await RegionsApi.EditRegion(currentRegion, newRegion)

        form.resetFields();

        notificationLogic('success', "Успішно змінено дані округу");
        history.push(`/regions/${currentRegion}`);
    }

    return  <Layout.Content className="createCity">
    <Card hoverable className="createCityCard">
      
    <Form
        name="basic"
        onFinish={handleSubmit}
        form={form}
    >
        <h1>Редагування даних округу</h1>

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

          <Row justify="center">
            <Col md={11} xs={24}>
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
            
                  {
                    max: 50,
                    message: "Максимальна довжина - 50 символів!",
                  },
            ]}
        >
             <Input
                className={classes.inputField} 
                placeholder={chosenRegion.regionName}
                />

        </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Опис"
            name="description"

            rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                },
               {
                    max: 1000,
                    message: "Максимальна довжина - 1000 символів!",
                }
                  
            ]}
        >
           <Input
                placeholder={chosenRegion.description}
                className={classes.inputField} />
        </Form.Item>
</Col>

    <Col md={11} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Номер телефону"
            name="phoneNumber"

            rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                },
                {
                    max: 13,
                    message: "Максимальна довжина 13 цифр!",
                }
            ]}
        >
           <Input
           placeholder={chosenRegion.phoneNumber}
                className={classes.inputField} />
        </Form.Item>
</Col>

<Col  md={{ span: 11, offset: 2 }} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Email"
            name="email"

            rules={[
                
                    {
                      pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: "Неправильна пошта",
                    },
                    {
                      max: 50,
                      message: "Максимальна довжина - 50 символів!",
                    },
            ]}
        >
           <Input
           placeholder={chosenRegion.email}
                className={classes.inputField} />
        </Form.Item>
</Col>

<Col md={11} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Link"
            name="link"

            rules={[
                {
                    max: 256,
                    message: "Максимальна довжина - 256 символів!",
                  },
            ]}
        >
           <Input
           placeholder={chosenRegion.link}
                className={classes.inputField} />
        </Form.Item>
</Col>

<Col md={{ span: 11, offset: 2 }} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Місто"
            name="city"

            rules={[
                {
                    required: true,
                    message: 'Це поле має бути заповненим'
                },
            ]}
        >
           <Input
           placeholder={chosenRegion.city}
                className={classes.inputField} />
        </Form.Item>
</Col>


<Col md={11} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Вулиця"
            name="street"

            rules={[
                
                {
                  max: 50,
                  message: "Максимальна довжина - 50 символів!",
                }
            ]}
        >
           <Input
           placeholder={chosenRegion.street}
                className={classes.inputField} />
        </Form.Item>
</Col>
<Col md={{ span: 11, offset: 2 }} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Номер будинку"
            name="houseNumber"

            rules={[
                {
                    max: 5,
                    message: "Максимальна довжина - 5 символів!",
                  }
                
            ]}
        >
           <Input
           placeholder={chosenRegion.houseNumber}
                className={classes.inputField} />
        </Form.Item>
</Col>
<Col md={11} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Номер офісу/квартири"
            name="officeNumber"

            rules={[
                {
                    max: 5,
                    message: "Максимальна довжина - 5 символів!",
                  }
                
            ]}
        >
           <Input
           placeholder={chosenRegion.officeNumber}
                className={classes.inputField} />
        </Form.Item>
</Col>
<Col md={{ span: 11, offset: 2 }} xs={24}>
        <Form.Item
            className={classes.formField}
            label="Поштовий індекс"
            name="postIndex"

            rules={[
                {
                    max: 5,
                    message: "Максимальна довжина - 5 символів!",
                  },
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
</Col>

<Col>
        <Form.Item style = {{ textAlign: "right"}}>
      
        <Button
         type="primary" htmlType="submit" 
        >
         Змінити
        </Button>

      </Form.Item> 
      </Col>
   
    </Row>
    </Form>
    </Card>
    </Layout.Content>
}





export default RegionEditFormPage;