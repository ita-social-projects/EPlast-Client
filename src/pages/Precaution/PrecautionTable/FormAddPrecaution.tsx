import React, { useEffect } from "react";
import { Form, DatePicker, Select, Input, Button, Row, Col } from "antd";
import precautionApi from "../../../api/precautionApi";
import formclasses from "./Form.module.css";
import { createHook } from "react-sweet-state";
import {
  emptyInput,
  maxNumber,
} from "../../../components/Notifications/Messages";
import moment from "moment";
import {
  descriptionValidation,
  getOnlyNums,
} from "../../../models/GllobalValidations/DescriptionValidation";
import PrecautionStore from "../../../stores/StorePrecaution";

const FormAddPrecaution = () => {
  const useStore = createHook(PrecautionStore);
  const [state, actions] = useStore();
  const [form] = Form.useForm();
  const dateFormat = "DD.MM.YYYY";

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  useEffect(() => {    
    actions.fetchDataFormAddPrecaution();
  }, []);

  const backgroundColor = (user: any) => {
    return user.isInLowerRole
      ? { backgroundColor: "#D3D3D3" }
      : { backgroundColor: "white" };
  };

  return (
    <Form
      name="basic"
      onFinish={(values: any ) => actions.addModalHandleSubmit(values, form)}
      form={form}
      id="addArea"
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
                max: 5,
                message: maxNumber(99999),
              },
              {
                validator: async (_: object, value: number) =>
                  value && !isNaN(value) && value > 0
                    ? (await precautionApi
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
              min={1}
              className={formclasses.inputField}
              max={99999}
              maxLength={7}
              autoComplete="off"
              onChange={(e) => {
                form.setFieldsValue({
                  number: getOnlyNums(e.target.value),
                });
              }}
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
              loading={state.loadingPrecautionStatus}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {state.addDistData?.map((user) => (
                <Select.Option key={user.id} value={JSON.stringify(user)}>
                  {user.name}
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
            name="user"
            labelCol={{ span: 24 }}
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
              loading={state.loadingUserStatus}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {state.userData?.map((user) => (
                <Select.Option
                  key={user.id}
                  value={JSON.stringify(user)}
                  style={backgroundColor(user)}
                  disabled={!user.isAvailable}
                >
                  {`${user.firstName} ${user.lastName} (${user.email})`}
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
              format={dateFormat}
              className={formclasses.selectField}
              disabledDate={disabledStartDate}
              getPopupContainer={() =>
                document.getElementById("addArea")! as HTMLElement
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
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option key="9" value="Прийнято">
                Прийнято
              </Select.Option>
              <Select.Option key="10" value="Потверджено">
                Потверджено
              </Select.Option>
              <Select.Option key="11" value="Скасовано">
                Скасовано
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item>
            <div className={formclasses.cardButton}>
              <Button
                key="back"
                onClick={() => actions.addModalhandleCancel(form)}
                className={formclasses.buttons}
              >
                Відмінити
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className={formclasses.buttons}
              >
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormAddPrecaution;
