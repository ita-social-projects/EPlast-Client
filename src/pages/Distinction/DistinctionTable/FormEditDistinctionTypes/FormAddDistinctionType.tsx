import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Tooltip } from "antd";
import React from "react";
import Distinction from "../../../../models/Distinction/Distinction";
import { useDistinctionsActions } from "../../../../stores/DistinctionsStore";
import DistinctionTypeInputValidator from "./DistinctionTypeInputValidator";

const FormAddDistinctionType = () => {
  const { addDistinction } = useDistinctionsActions();
  const [form] = Form.useForm();

  const addHandler = (values: any) => {
    const distinction: Distinction = {
      id: 0,
      name: values.distinctionName,
    };
    addDistinction(distinction);
    form.resetFields();
  };

  return (
    <Form form={form} onFinish={addHandler} layout="inline" size="large">
      <Input.Group compact>
        <Form.Item
          style={{ width: "calc(100% - 40px)" }}
          name="distinctionName"
          rules={DistinctionTypeInputValidator}
        >
          <Input placeholder="Додати відзначення" />
        </Form.Item>
        <Form.Item noStyle>
          <Tooltip title="Додати">
            <Button
              htmlType="submit"
              type="primary"
              icon={<PlusOutlined />}
            ></Button>
          </Tooltip>
        </Form.Item>
      </Input.Group>
    </Form>
  );
};

export default FormAddDistinctionType;
