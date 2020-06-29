import React from 'react';
import { Form, DatePicker, Select, Input, Upload, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
const FormAddDecision = () => {
  useEffect(() => {

  });
  const normFile = e => {
    // console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };
  const onFinish = values => {
    
    console.log(values);
  }
  return (
    <Form
      onFinish = {onFinish}
      name="basic"
      initialValues={{
        remember: true,
      }}
    >
      <Form.Item
        label="Назва рішення"
        name="name"
        rules={[
          {
            message: 'Це поле має бути заповненим',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Рішення органу"
        name = "organization">
        <Select>
          <Select.Option value="0">КПР</Select.Option>
          <Select.Option value="1">КРК</Select.Option>
          <Select.Option value="2">КБ УПС</Select.Option>
          <Select.Option value="3">КБ УСП</Select.Option>
          <Select.Option value="4">КБ УПЮ</Select.Option>
          <Select.Option value="5">КБ УПН</Select.Option>
          <Select.Option value="6">КБ УПП</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
       label="Тематика рішення"
       name = "target">
        <Select>
          <Select.Option value="1">Demo 1</Select.Option>
          <Select.Option value="2">Demo 2</Select.Option>
          <Select.Option value="3">Demo 3</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="date-picker" label="Дата рішення" >
        <DatePicker />
      </Form.Item>
      <Form.Item label="Текст рішення">
        <Input.TextArea allowClear />
      </Form.Item>
      <Form.Item label="Статус рішення">
        <Select>
          <Select.Option value="0">У розгляді</Select.Option>
          <Select.Option value="1">Підтверджено</Select.Option>
          <Select.Option value="2">Скасовано</Select.Option>
        </Select>
        </Form.Item>
      <Form.Item label="Прикріпити">
        <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
          <Upload.Dragger name="files" action="/upload.do">
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: '#3c5438' }} />
            </p>
            <p className="ant-upload-hint">Клікніть або перетягніть файл для завантаження</p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
    </Form>
  );
};

export default FormAddDecision;
