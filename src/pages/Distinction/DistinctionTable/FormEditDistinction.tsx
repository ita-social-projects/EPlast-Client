import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import moment from "moment";
import "moment/locale/uk";
import React, { useEffect } from "react";
import { batch } from "react-sweet-state";
import distinctionApi from "../../../api/distinctionApi";
import {
  emptyInput,
  maxNumber,
} from "../../../components/Notifications/Messages";
import {
  descriptionValidation,
  getOnlyNums,
} from "../../../models/GllobalValidations/DescriptionValidation";
import { useDistinctions } from "../../../stores/DistinctionsStore";
import UserDistinctionEdit from "../Interfaces/UserDistinctionEdit";
import formclasses from "./Form.module.css";
moment.locale("uk-ua");

const FormEditDistinction = () => {
  const [form] = Form.useForm();

  const dateFormat = "DD.MM.YYYY";

  const [state, actions] = useDistinctions();

  useEffect(() => {
    if (state.editUserDistinctionFormIsVisible) {
      form.setFieldsValue({
        number: state.editedUserDistinction.number,
        distinction: state.editedUserDistinction.distinction.id,
        user: state.editedUserDistinction.user.id,
        reporter: state.editedUserDistinction.reporter,
        date: moment.utc(state.editedUserDistinction.date).local(),
        reason: state.editedUserDistinction.reason,
      });

      batch(() => {
        actions.setEditModalSelectedDistinction(
          state.editedUserDistinction.distinction
        );
        actions.fetchDistinctions();
        actions.getUsersWithoutPrecautions();
      });
    }
  }, [state.editUserDistinctionFormIsVisible]);

  const backgroundColor = (user: any) => {
    return user.isInLowerRole
      ? { backgroundColor: "#D3D3D3" }
      : { backgroundColor: "white" };
  };

  const handleCancel = () => {
    actions.closeUserDistinctionEditModal();
    form.resetFields();
  };

  function disabledDate(currentDate: any) {
    return currentDate && currentDate < moment("01-01-1900", "DD-MM-YYYY");
  }

  const handleFinish = async (values: any) => {
    const newUserDistinction: UserDistinctionEdit = {
      id: state.editedUserDistinction.id,
      distinctionId: values.distinction,
      date: values?.date,
      userId: values.user,
      reason: values?.reason,
      reporter: values?.reporter,
      number: values?.number,
    };
    batch(() => {
      actions.editUserDistinction(newUserDistinction);
      actions.closeUserDistinctionEditModal();
    });
  };

  return (
    <div>
      <Form
        name="basic"
        onFinish={handleFinish}
        form={form}
        id="editArea"
        style={{ position: "relative" }}
      >
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              className={formclasses.formField}
              label="Номер в реєстрі"
              labelCol={{ span: 24 }}
              name="number"
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
                    value == 0 && value && !isNaN(value)
                      ? Promise.reject("Номер не може бути 0")
                      : Promise.resolve(),
                },
                {
                  validator: async (_: object, value: number) => {
                    if (value !== state.editedUserDistinction.number) {
                      if (
                        await distinctionApi
                          .checkNumberExisting(value)
                          .then((response) => response.data === false)
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject("Цей номер уже зайнятий");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                onChange={(e) => {
                  form.setFieldsValue({
                    number: getOnlyNums(e.target.value),
                  });
                }}
                autoComplete="off"
                min={1}
                className={formclasses.inputField}
                max={99999}
                maxLength={7}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              className={formclasses.formField}
              label="Відзначення"
              labelCol={{ span: 24 }}
              name="distinction"
              rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
              ]}
            >
              <Select
                loading={state.isLoadingDistinctionTypes}
                className={formclasses.selectField}
                showSearch
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {state.distinctionTypes?.map((o) => (
                  <Select.Option key={o.id} value={o.id}>
                    {o.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              className={formclasses.formField}
              label="Ім'я"
              labelCol={{ span: 24 }}
              name="user"
              rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
              ]}
            >
              <Select
                className={formclasses.selectField}
                showSearch
                loading={state.isLoadingUsersWithoutPrecautions}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {state.usersWithoutPrecautions?.map((o) => (
                  <Select.Option
                    key={o.id}
                    value={o.id}
                    style={backgroundColor(o)}
                    disabled={o.isInLowerRole}
                  >
                    {o.firstName + " " + o.lastName + " (" + o.email + ")"}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              className={formclasses.formField}
              label="Подання від"
              labelCol={{ span: 24 }}
              name="reporter"
              rules={descriptionValidation.Reporter}
            >
              <Input
                allowClear
                className={formclasses.inputField}
                maxLength={101}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              className={formclasses.formField}
              name="date"
              label="Дата затвердження"
              labelCol={{ span: 24 }}
              rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
              ]}
            >
              <DatePicker
                disabledDate={disabledDate}
                format={dateFormat}
                className={formclasses.selectField}
                getPopupContainer={() =>
                  document.getElementById("editArea")! as HTMLElement
                }
                popupStyle={{ position: "absolute" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              className={formclasses.formField}
              label="Обгрунтування"
              labelCol={{ span: 24 }}
              name="reason"
              rules={descriptionValidation.Description}
            >
              <Input.TextArea
                allowClear
                autoSize={{
                  minRows: 2,
                  maxRows: 6,
                }}
                className={formclasses.inputField}
                maxLength={1001}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <div className={formclasses.cardButton}>
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
              Зберегти
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormEditDistinction;
