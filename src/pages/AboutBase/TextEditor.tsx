import React, { useState } from "react";
import SubsectionModel from '../../models/AboutBase/SubsectionModel';
import SectionModel from '../../models/AboutBase/SectionModel';
import formclasses from './TextEditor.css';
import {
    Form,
    DatePicker,
    Select,
    Input,
    Button,
    notification,
    Row,
    Col,
  } from "antd";
import TextArea from "antd/lib/input/TextArea";

  
const TextEditor = () => {
    const [form] = Form.useForm();
    const [value, setValue] = useState('');
    const [sectionData, setSectionData] = useState<any[]>([
        {
            id: 0,
            title:"",
            subsection:{
              id:0,
              sectionId:0,
              title:"",
              descroption:"",
              imagePath:""
          }
        }
      ]);
    const[subsectionData, setSubsectionData] = useState<SubsectionModel[]>(Array<SubsectionModel>());
    const handleCancel = () => {
        form.resetFields();
      };
    const handleSubmit = async (values: any) => {
        const newSubsection: SubsectionModel = {
          id:0,
          title:values.title,
          sectionId:JSON.parse(values.section).id,
          descroption:values.description,
          imagePath:values.description
        };
    }
    return (
         <Form className="form" name="basic" onFinish={handleSubmit} form={form}>
             <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Заголовок"
            labelCol={{ span: 24 }}
            rules={[
              {
                required: true
              }
            ]}>
            <Input
              type="string"
              className={formclasses.inputField}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item
            className={formclasses.formField}
            label="Опис"
            labelCol={{ span: 24 }}
            rules={[{ required: true}]}
          >
            <TextArea
              className={formclasses.text}
            ></TextArea>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item>
            <div className={formclasses.cardButton}>
              <Button key="back" onClick={handleCancel} className={formclasses.buttons}>
                Відмінити
              </Button>
              <Button type="primary" htmlType="submit" className={formclasses.buttons}>
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
         </Form>
    )
};
        
export default TextEditor