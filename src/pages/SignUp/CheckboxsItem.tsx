import { Checkbox, Form, Space } from "antd";
import React from "react";
import { emptyInput } from "../../components/Notifications/Messages";

interface RadioOrInputProps {
    checkboxList: string[]
    title: string
    name: string
}

const CheckboxsItem: React.FC<RadioOrInputProps> = ({ checkboxList, title, name }) => {
    return (
        <Form.Item
            label={<span style={
                {
                    fontSize: "16px",
                    fontWeight: 500
                }
            }>{title}</span>}
            name={name}
            rules={[{ required: true, message: emptyInput() }]}
        >
            <Checkbox.Group style={{ width: '100%' }}>
                <Space direction="vertical">
                    {checkboxList.map(c =>
                        <Checkbox key={c} value={c}>{c}</Checkbox>
                    )}
                </Space>
            </Checkbox.Group>
        </Form.Item>
    );
}

export default CheckboxsItem;