import React from 'react';
import { Form, DatePicker, Select, Input, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const FormAddDecision = () => {
  const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  return (
    <Form
      name="basic"
      initialValues={{
        remember: true,
      }}
    >
      <Form.Item
        label="Назва рішення"
        name="username"
        rules={[
          {
            message: 'Це поле має бути заповненим',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Рішення органу">
        <Select>
          <Select.Option value="1">Demo 1</Select.Option>
          <Select.Option value="2">Demo 2</Select.Option>
          <Select.Option value="3">Demo 3</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item label="Тематика рішення">
        <Select>
          <Select.Option value="1">Demo 1</Select.Option>
          <Select.Option value="2">Demo 2</Select.Option>
          <Select.Option value="3">Demo 3</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item name="date-picker" label="Дата рішення">
        <DatePicker />
      </Form.Item>
      <Form.Item label="Текст рішення">
        <Input.TextArea allowClear />
      </Form.Item>
      <Form.Item label="Прикріпити">
        <Form.Item
          name="dragger"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          noStyle
        >
          <Upload.Dragger name="files" action="/upload.do">
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: '#3c5438' }} />
            </p>
            <p className="ant-upload-hint">
              Клікніть або перетягніть файл для завантаження
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form.Item>

      {/* <Form.Item>
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
      </Form.Item> */}
    </Form>
  );
};

export default FormAddDecision;
