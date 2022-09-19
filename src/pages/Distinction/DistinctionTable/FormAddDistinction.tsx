import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
} from "antd";
import React, { useEffect } from "react";
import distinctionApi from "../../../api/distinctionApi";
import {
  emptyInput,
  maxNumber,
} from "../../../components/Notifications/Messages";
import UserDistinction from "../../../models/Distinction/UserDistinction";
import EditDistinctionTypesModal from "./EditDistinctionTypesModal";
import formclasses from "./Form.module.css";
import classes from "./FormEdit.module.css";

import moment from "moment";
import { batch } from "react-sweet-state";
import {
  descriptionValidation,
  getOnlyNums,
} from "../../../models/GllobalValidations/DescriptionValidation";
import { useDistinctions } from "../../../stores/DistinctionsStore";

const FormAddUserDistinction: React.FC = () => {
  const [form] = Form.useForm();
  const dateFormat = "DD.MM.YYYY";

  const [state, actions] = useDistinctions();
  useEffect(() => {
    if (state.addUserDistinctionModalIsVisible) {
      actions.fetchDistinctions();
      actions.getUsersWithoutPrecautions();
    }
  }, [state.addUserDistinctionModalIsVisible]);

  const handleCancel = () => {
    form.resetFields();
    actions.closeUserDistinctionAddModal();
  };

  const backgroundColor = (user: any) => {
    return user.isInLowerRole
      ? { backgroundColor: "#D3D3D3" }
      : { backgroundColor: "white" };
  };

  const handleSubmit = async (values: any) => {
    const newDistinction: UserDistinction = {
      id: 0,
      distinctionId: JSON.parse(values.distinction).id,
      distinction: JSON.parse(values.distinction),
      user: JSON.parse(values.user),
      userId: JSON.parse(values.user).id,
      date: values.date,
      reporter: values.reporter,
      reason: values.reason,
      number: values.number,
    };
    batch(() => {
      actions.addUserDistinction(newDistinction);
      actions.closeUserDistinctionAddModal();
    });
    form.resetFields();
  };

  function disabledDate(currentDate: any) {
    return currentDate && currentDate < moment("01-01-1900", "DD-MM-YYYY");
  }

  return (
    <Form
      name="basic"
      onFinish={handleSubmit}
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
                    ? (await distinctionApi
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
          <Row>
            <Col span={21}>
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
                  className={formclasses.selectTypeDistField}
                  showSearch
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {state.distinctionTypes?.map((o) => (
                    <Select.Option key={o.id} value={JSON.stringify(o)}>
                      {o.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Tooltip
                title="Редагувати відзначення"
                className={formclasses.editTypeDistPosition}
              >
                <EditOutlined
                  className={classes.editIcon}
                  onClick={actions.openEditDistinctionTypesModal}
                />
              </Tooltip>
            </Col>
          </Row>
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
              loading={state.isLoadingUsersWithoutPrecautions}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {state.usersWithoutPrecautions?.map((o) => (
                <Select.Option
                  key={o.id}
                  value={JSON.stringify(o)}
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
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
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
                Опублікувати
              </Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
      <EditDistinctionTypesModal />
    </Form>
  );
};

export default FormAddUserDistinction;
