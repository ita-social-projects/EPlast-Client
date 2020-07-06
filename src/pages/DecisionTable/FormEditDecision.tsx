import React from 'react';
import { Form, Input } from 'antd';

interface Props {
  record: {
    completed: boolean;
    title: string;
  };
}

const FormEditDecision = ({ record }: Props) => {
  const { completed, title } = record;

  console.log(title);
  return (
    <Form
      name="basic"
      //   initialValues={{
      //     remember: true,
      //   }}
    >
      <Form.Item
        label="Назва рішення"
        name="decisionname"
        initialValue={completed}
        rules={[
          {
            message: 'Це поле має бути заповненим',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Текст рішення">
        <Input.TextArea allowClear defaultValue={title} />
      </Form.Item>
      {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Опублікувати
          </Button>
        </Form.Item> */}
    </Form>
  );
};

export default FormEditDecision;
