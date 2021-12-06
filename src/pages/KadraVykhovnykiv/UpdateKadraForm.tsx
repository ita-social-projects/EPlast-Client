import React, { useEffect } from "react";
import classes from "./Form.module.css";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Row,
  Col,
} from "antd";
import kadrasApi from "../../api/KadraVykhovnykivApi";
import notificationLogic from "../../components/Notifications/Notification";
import moment from "moment";
import KadraVykhovnykivApi from "../../api/KadraVykhovnykivApi";
import{
  emptyInput,
  maxNumber,
  minNumber,
  successfulEditAction
} from "../../components/Notifications/Messages"

type FormUpdateKadraProps = {
  showModal: (visibleModal: boolean) => void;
  onAdd: () => void;
  record: any;
  onEdit: () => void;
};

const UpdateKadraForm: React.FC<FormUpdateKadraProps> = (props: any) => {
  const { onAdd, record, onEdit, showModal } = props;
  const [form] = Form.useForm();
  const dateFormat = "DD.MM.YYYY";

  const handleSubmit = async (values: any) => {
    const newKadra: any = {
      id: record.id,

      dateOfGranting: values.dateOfGranting,

      numberInRegister: values.numberInRegister,

      basisOfGranting: record.basisOfGranting,

      link: record.link,
    };

    await kadrasApi
      .doesRegisterNumberExistEdit(newKadra.numberInRegister, newKadra.id)
      .then(async (responce) => {
        if (responce.data == false) {
          await kadrasApi.putUpdateKadra(newKadra);
          form.resetFields();
          onAdd();
          onEdit();
          notificationLogic("success", successfulEditAction("Відзнаку"));
        } else {
          notificationLogic("error", "Номер реєстру вже зайнятий");
          form.resetFields();
          onAdd();
        }
      });
  };

  useEffect(() => {
    form.resetFields();
  }, [record]);

  const handleCancel = () => {
    form.resetFields();
    showModal(false);
  };

  const getOnlyNums = (text: string) => {
    return text.replace(/\D/g, "");
  };

  return (
    <div>
        <Form name="basic" onFinish={handleSubmit} form={form}>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Дата вручення"
                labelCol={{ span: 24 }}
                name="dateOfGranting"
                initialValue={moment.utc(record.dateOfGranting).local()}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <DatePicker 
                  className={classes.selectField} 
                  format={dateFormat}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                className={classes.formField}
                label="Номер в реєстрі"
                labelCol={{ span: 24 }}
                name="numberInRegister"
                initialValue={record.numberInRegister}
                rules={[
                    {
                      required: true,
                      message: emptyInput(),
                    },
                    {
                      max: 5,
                      message: maxNumber(99999),
                    },
                    {
                      validator: async (_ : object, value: any) =>
                      value ?
                        !isNaN(value) ?
                          value < 1
                              ? Promise.reject(minNumber(1)) 
                              : await KadraVykhovnykivApi
                                  .doesRegisterNumberExist(value)
                                  .then(response => response.data === false)
                                  ? Promise.resolve()
                                  : Promise.reject('Цей номер уже зайнятий')
                                  : Promise.reject()
                                  : Promise.reject()
                    }
                  ]}
              >
                <Input
                  onChange={(e) => {
                    form.setFieldsValue({
                      numberInRegister: getOnlyNums(e.target.value),
                    });
                  }}
                  autoComplete = "off"
                  min={1}
                  max={99999}
                  className={classes.inputField}
                  maxLength = {7}
                />
              </Form.Item>
            </Col>
          </Row>          
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item>
                <div className={classes.cardButton}>
                  <Button key="back" onClick={handleCancel} className={classes.buttons}>
                    Відмінити
                  </Button>
                  <Button type="primary" htmlType="submit" className={classes.buttons}>
                    Опублікувати
                  </Button>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
    </div>
  );
};

export default UpdateKadraForm;
