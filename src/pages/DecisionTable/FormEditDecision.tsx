import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import decisionsApi, { DecisionPost } from "../../api/decisionsApi";
import formclasses from "./FormEditDecision.module.css";
import{
  emptyInput,
  maxLength,
} from "../../components/Notifications/Messages"

interface Props {
  record: number;
  decision: DecisionPost;
  setShowModal: (showModal: boolean) => void;
  onEdit: (id: number, name: string, description: string) => void;
}

const FormEditDecision = ({
  record,
  setShowModal,
  onEdit,
  decision,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const id = record;
  const [form] = Form.useForm();
  useEffect(() => {
    setLoading(true);
    form.setFieldsValue({
      name: decision.name,
      description: decision.description,
    });
    setLoading(false);
  }, [decision]);
  const handleCancel = () => {
    setShowModal(false);
  };
  const handleFinish = async (dec: any) => {
    const newDecision: DecisionPost = {
      id: decision?.id,
      name: dec.name,
      decisionStatusType: decision?.decisionStatusType,
      organization: decision?.organization,
      decisionTarget: decision?.decisionTarget,
      description: dec.description,
      date: decision?.date,
      fileName: decision?.fileName,
    };
    await decisionsApi.put(id, newDecision);
    onEdit(newDecision.id, newDecision.name, newDecision.description);
    setShowModal(false);
  };

  return (
    <div>
      {!loading && (
        <Form name="basic" onFinish={handleFinish} form={form}>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                label="Назва рішення"
                labelCol={{ span: 24 }}
                name="name"
                className={formclasses.inputWidth}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                  { 
                    max: 60,
                    message: maxLength(60) 
                  },
                ]}
              >
                <Input className={formclasses.input} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                label="Текст рішення"
                labelCol={{ span: 24 }}
                name="description"
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <Input.TextArea className={formclasses.input} allowClear />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item style={{ textAlign: "right" }}>
                <Button
                  key="back"
                  onClick={handleCancel}
                  className={formclasses.buttons}
                >
                  Відмінити
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={formclasses.buttons}
                >
                  Змінити
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default FormEditDecision;
