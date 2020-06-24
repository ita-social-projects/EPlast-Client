import React from 'react';
import { Form, Input } from 'antd';

// eslint-disable-next-line react/prop-types
const FormEditDecision = ({ record }) => {
    // eslint-disable-next-line react/prop-types
    const { completed, title } = record

    return (
        <Form
            name="basic"
            initialValues={{
                remember: true,
            }}
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

            <Form.Item label="Текст рішення" >
                <Input.TextArea allowClear value={title} />
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
