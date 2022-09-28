import React, { useEffect, useState } from "react";
import classes from "./Form.module.css";
import { Form, Input, DatePicker, Button, Row, Col } from "antd";
import kadrasApi from "../../api/KadraVykhovnykivApi";
import notificationLogic from "../../components/Notifications/Notification";
import moment, { Moment } from "moment";
import KadraVykhovnykivApi from "../../api/KadraVykhovnykivApi";
import { getOnlyNums } from "../../models/GllobalValidations/DescriptionValidation";
import {
  emptyInput,
  maxNumber,
  minNumber,
  successfulEditAction,
} from "../../components/Notifications/Messages";
import { minAvailableDate } from "../../constants/TimeConstants";

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

      dateOfGranting: moment(values.dateOfGranting).format(
        "YYYY-MM-DD HH:mm:ss"
      ),

      numberInRegister: values.numberInRegister,

      basisOfGranting: record.basisOfGranting,

      link: record.link,
    };

    await kadrasApi.putUpdateKadra(newKadra);
    form.resetFields();
    onAdd();
    onEdit();
    notificationLogic("success", successfulEditAction("Відзнаку"));
  };

  const disabledDate = (current: any) => {
    return current && !current.isAfter(minAvailableDate);
  };

  useEffect(() => {
    form.resetFields();
  }, [record]);

  const handleCancel = () => {
    form.resetFields();
    showModal(false);
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
              initialValue={moment(record.dateOfGranting)}
              rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
              ]}
            >
              <DatePicker disabledDate={disabledDate} className={classes.selectField} format={dateFormat} />
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
                  validator: (_: object, value: number) =>
                    value > 99999
                      ? Promise.reject(maxNumber(99999))
                      : Promise.resolve(),
                },
                {
                  validator: async (_: object, value: number) =>
                    value && !isNaN(value)
                      ? value == record.numberInRegister ||
                        (await KadraVykhovnykivApi.doesRegisterNumberExist(
                          value
                        ).then((response) => response.data === false))
                        ? Promise.resolve()
                        : Promise.reject("Цей номер уже зайнятий")
                      : Promise.reject(),
                },
              ]}
            >
              <Input
                onChange={(e) => {
                  form.setFieldsValue({
                    numberInRegister: getOnlyNums(e.target.value),
                  });
                }}
                autoComplete="off"
                min={1}
                max={99999}
                className={classes.inputField}
                maxLength={7}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item>
              <div className={classes.cardButton}>
                <Button
                  key="back"
                  onClick={handleCancel}
                  className={classes.buttons}
                >
                  Відмінити
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={classes.buttons}
                >
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
