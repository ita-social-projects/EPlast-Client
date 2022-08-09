import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useDistinctions } from "../../../../stores/DistinctionsStore";
import Distinction from "../../Interfaces/Distinction";
import DistinctionTypeInputValidator from "./DistinctionTypeInputValidator";

const FormEditDistinctionType = () => {
  const [state, actions] = useDistinctions();
  const [form] = Form.useForm();

  const editHandler = (values: any) => {
    const distinction: Distinction = {
      id: state.editedDistinction.id,
      name: values.distinctionName,
    };
    actions.editDistinction(distinction);
    form.resetFields();
  };

  useEffect(() => {
    form.setFieldsValue({
      distinctionName: state.editedDistinction.name,
    });
  });

  return (
    <Form form={form} onFinish={editHandler} layout="inline" size="large">
      <Input.Group compact>
        <Form.Item
          style={{ width: "calc(100% - 80px)" }}
          name="distinctionName"
          rules={DistinctionTypeInputValidator}
        >
          <Input placeholder="Редагувати відзначення" />
        </Form.Item>
        <Form.Item noStyle>
          <Tooltip title="Змінити">
            <Button
              htmlType="submit"
              type="primary"
              icon={<EditOutlined />}
            ></Button>
          </Tooltip>
        </Form.Item>
        <Form.Item noStyle>
          <Tooltip title="Скасувати">
            <Button
              danger
              htmlType="button"
              icon={<CloseOutlined />}
              onClick={actions.closeEditForm}
            ></Button>
          </Tooltip>
        </Form.Item>
      </Input.Group>
    </Form>
  );
};

export default FormEditDistinctionType;
