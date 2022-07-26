import React, { useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Row, Col } from "antd";
import precautionApi from "../../../api/precautionApi";
import formclasses from "./Form.module.css";
import {
  emptyInput,
  maxNumber,
} from "../../../components/Notifications/Messages";
import moment from "moment";
import "moment/locale/uk";
import {
  descriptionValidation,
  getOnlyNums,
} from "../../../models/GllobalValidations/DescriptionValidation";
import { createHook } from "react-sweet-state";
import PrecautionStore from "../../../stores/StorePrecaution";
import { userPrecautionStatuses } from "../Interfaces/UserPrecautionStatus";
moment.locale("uk-ua");

const FormEditPrecaution = () => {
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();

  const [form] = Form.useForm();
  const dateFormat = "DD.MM.YYYY";

  useEffect(() => {
    actions.setShowDropdown(false, -1);
    actions.setEditModalLoading(true);
    form.resetFields();
    actions.editModalFetchData();
    actions.setEditModalLoading(false);
    actions.setEditModalPrecaution(state.userPrecaution.precaution);
    actions.setEditModalUser(state.userPrecaution.user);
  }, [state.userPrecaution]);

  const backgroundColor = (user: any) => {
    return user.isInLowerRole
      ? { backgroundColor: "#D3D3D3" }
      : { backgroundColor: "white" };
  };

  const isDisabledStartDate = (current: any) => {
    return current && current > moment();
  };

  return (
    <div>
      {!state.editModalLoading && (
        <Form
          name="basic"
          onFinish={(editUserPrecaution) => actions.editModalHandleFinish(editUserPrecaution, form)}
          form={form}
          id="editArea"
          style={{ position: "relative" }}
        >
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                initialValue={state.userPrecaution.number}
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
                      value && !isNaN(value) && value > 0
                        ? value == state.userPrecaution.number ||
                          (await precautionApi
                            .checkNumberExisting(value)
                            .then((response) => response.data === false))
                          ? Promise.resolve()
                          : Promise.reject("Цей номер уже зайнятий")
                        : Promise.reject(),
                  },
                  {
                    validator: async (_: object, value: number) =>
                      value == 0 && value && !isNaN(value)
                        ? Promise.reject("Номер не може бути 0")
                        : Promise.resolve(),
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
                label="Пересторога"
                labelCol={{ span: 24 }}
                name="Precaution"
                initialValue={state.userPrecaution.precaution.name}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <Select
                  className={formclasses.selectField}
                  onSelect={actions.editModalSetPrecautionChange}
                  loading={state.editModalLoadingPrecautionStatus}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {state.editModalDistData?.map((o) => (
                    <Select.Option key={o.id} value={JSON.stringify(o)}>
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
                initialValue={`${state.userPrecaution.user.firstName} ${state.userPrecaution.user.lastName}`}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <Select
                  className={formclasses.selectField}
                  onSelect={actions.editModalSetUserChange}
                  showSearch
                  loading={state.editModalLoadingUserStatus}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {state.editModalUserData?.map((user) => (
                    <Select.Option
                      key={user.id}
                      value={JSON.stringify(user)}
                      style={backgroundColor(user)}
                      disabled={!user.isAvailable}
                    >
                      {user.firstName + " " + user.lastName + " (" + user.email + ")"}
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
                initialValue={state.userPrecaution.reporter}
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
                initialValue={moment.utc(state.userPrecaution.date).local()}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <DatePicker
                  format={dateFormat}
                  className={formclasses.selectField}
                  disabledDate={isDisabledStartDate}
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
                initialValue={state.userPrecaution.reason}
                rules={descriptionValidation.Reason}
              >
                <Input.TextArea
                  allowClear
                  autoSize={{
                    minRows: 2,
                    maxRows: 6,
                  }}
                  className={formclasses.inputField}
                  maxLength={501}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                className={formclasses.formField}
                label="Статус"
                labelCol={{ span: 24 }}
                name="status"
                initialValue={state.userPrecaution.status}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <Select
                  className={formclasses.selectField}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {
                    userPrecautionStatuses.map(([id, text]) => (
                      <Select.Option key={id} value={id}>
                        {text}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <div className={formclasses.cardButton}>
              <Button
                key="back"
                onClick={() => actions.editModalHandleCancel(form)}
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
      )}
    </div>
  );
};

export default FormEditPrecaution;
