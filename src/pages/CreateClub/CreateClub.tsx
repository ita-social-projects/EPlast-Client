import React, {useState} from 'react';
import {Button, Form, Input, Layout, Upload, message, Row, Col} from "antd";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons/lib";
import City from '../../assets/images/city.jpg';

const classes = require('./CreateClub.module.css');

const dummyRequest = ({onSuccess}: any) => {
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


const CreateClub = () => {
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
        <img src={City} alt="Club" style={{width: '300px'}}/>
      </div>
  );


  const validateMessages = {
    required: 'Це поле є обов`язковим!'
  };

  return (
      <Layout.Content className={classes.createClub}>
        <h1 className={classes.mainTitle}>Створення куреня</h1>
        <Row justify="space-around" style={{overflow: 'hidden'}}>
          <Col flex="0 1 40%">
            <Form
                className={classes.clubForm}
                validateMessages={validateMessages}
                layout="vertical"
            >
              <Form.Item name={['club', 'name']} label="Назва" rules={[{required: true}]}>
                <Input/>
              </Form.Item>
              <Form.Item name={['club', 'website']} label="Посилання">
                <Input/>
              </Form.Item>
              <Form.Item name={['club', 'description']} label="Опис">
                <Input.TextArea rows={5}/>
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" type="primary" className={classes.createButton}>
                  Створити
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col flex="0 1 40%">
            <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={dummyRequest}
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
              {imgSrc ? <img src={imgSrc} alt="Club" style={{width: '300px'}}/> : uploadButton}
            </Upload>
          </Col>
        </Row>
      </Layout.Content>
  )
};

export default CreateClub;

