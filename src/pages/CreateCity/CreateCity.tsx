import React, {useState} from 'react';
import {Button, Form, Input, Layout, Select, Upload, message, Row, Col} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons/lib";
import City from '../../assets/images/city.jpg';

const classes = require('./CreateCity.module.css');

const dummyRequest = ({ onSuccess }:any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const getBase64 = (img: any, callback: any) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: any) => {
  console.log(file.type);
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


const CreateCity = () => {
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState();
  const handleChange = (info: any) => {
    console.log(info.file.status, 'status');
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl: React.SetStateAction<boolean>) => {
        setLoading(false);
        setImgSrc(imageUrl);
      });
    }
  };

  const uploadButton = (
      <div>
        {loading ? <LoadingOutlined/> : <PlusOutlined/>}
        <img src={City} alt="City" style={{width: '300px'}}/>
      </div>
  );


  const validateMessages = {
    required: 'Це поле є обов`язковим!',
    types: {
      email: 'Невалідний email!',
    }
  };
  const prefixSelector = (
      <Form.Item name="prefix" noStyle>
        <Select style={{width: 90}}>
          <Select.Option value="+380">+380</Select.Option>
        </Select>
      </Form.Item>
  );

  return (
      <Layout.Content className={classes.createCity}>
        <h1 className={classes.mainTitle}>Створення станиці</h1>
        <Row justify="space-around" style={{overflow: 'hidden'}}>
          <Col>
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
              {imgSrc ? <img src={imgSrc} alt="City" style={{width: '300px'}}/> : uploadButton}
            </Upload>
          </Col>
        </Row>
        <Row justify="space-around" gutter={[0, 20]} style={{overflow: 'hidden'}}>
          <Col>
            <Form
                className={classes.cityForm}
                initialValues={{prefix: '+380'}}
                validateMessages={validateMessages}
                layout="inline"
            >
              <Col span={9}>
                <Form.Item name={['city', 'name']} label="Назва" rules={[{required: true}]}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name={['city', 'description']} label="Опис">
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name={['city', 'website']} label="Посилання">
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name={['city', 'phone']} label="Номер телефону">
                  <Input addonBefore={prefixSelector} style={{width: '100%'}}/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name={['city', 'email']} label="Електронна пошта" rules={[{type: 'email'}]}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name={['city', 'street']} label="Вулиця" rules={[{required: true}]}>
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name={['city', 'houseNumber']} label="Номер будинку" rules={[{required: true}]}>
                  <Input type="number"/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name={['user', 'flatNumber']} label="Номер офісу/квартири">
                  <Input type="number"/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item name={['user', 'zipCode']} label="Поштовий індекс">
                  <Input type="number"/>
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item>
                  <Button htmlType="submit" type="primary" className={classes.createButton}>
                    Створити
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </Col>
        </Row>
      </Layout.Content>
  )
};

export default CreateCity;

