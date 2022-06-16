import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, DatePicker, Row, Col } from "antd";
import precautionApi from "../../../api/precautionApi";
import UserPrecaution from "../Interfaces/UserPrecaution";
import formclasses from "./Form.module.css";
import adminApi from "../../../api/adminApi";
import Precaution from "../Interfaces/Precaution";
import {
  emptyInput,
  failEditAction,
  maxNumber,
  minNumber,
} from "../../../components/Notifications/Messages";
import moment from "moment";
import "moment/locale/uk";
import {
  descriptionValidation,
  getOnlyNums,
} from "../../../models/GllobalValidations/DescriptionValidation";
import SuggestedUser from "../Interfaces/SuggestedUser";
import notificationLogic from "../../../components/Notifications/Notification";
import { dataCantBeFetched } from "../../../components/Notifications/Messages";
import { Store } from "antd/lib/form/interface";
moment.locale("uk-ua");

interface Props {
  oldUserPrecaution: UserPrecaution;
  setShowModal: (showModal: boolean) => void;
  onEdit: (
    id: number,
    Precaution: Precaution,
    date: Date,
    endDate: Date,
    isActive: boolean,
    reason: string,
    status: string,
    reporter: string,
    number: number,
    user: any,
    userId: string
  ) => void;
}

const FormEditPrecaution = ({
  oldUserPrecaution,
  setShowModal,
  onEdit,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); 
  const [userData, setUserData] = useState<SuggestedUser[]>(
    Array<SuggestedUser>()
  );
  const [distData, setDistData] = useState<Precaution[]>(Array<Precaution>());
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const [loadingPrecautionStatus, setLoadingPrecautionStatus] = useState(false);
  const [precaution, setPrecaution] = useState<Precaution>(
    oldUserPrecaution.precaution
  );
  const [user, setUser] = useState<any>(oldUserPrecaution.user);
  const dateFormat = "DD.MM.YYYY";

  useEffect(() => {
    setLoading(true);
    form.resetFields();
    const fetchData = async () => {
      setDistData([]);
      setUserData([]);

      setLoadingPrecautionStatus(true);
      precautionApi
        .getPrecautions()
        .then((response) => {
          setDistData(response.data);
          setLoadingPrecautionStatus(false);
        })
        .catch(() => {
          notificationLogic(
            "error",
            dataCantBeFetched("пересторог. Спробуйте пізніше")
          );
        });

      setLoadingUserStatus(true);
      precautionApi
        .getUsersForPrecaution()
        .then((response) => {
          setUserData(response.data);
          setLoadingUserStatus(false);
        })
        .catch(() => {
          notificationLogic(
            "error",
            dataCantBeFetched("користувачів. Спробуйте пізніше")
          );
        });
    };
    fetchData();
    setLoading(false);
    setPrecaution(oldUserPrecaution.precaution);
    setUser(oldUserPrecaution.user);
  }, [oldUserPrecaution]);

  const backgroundColor = (user: any) => {
    return user.isInLowerRole
      ? { backgroundColor: "#D3D3D3" }
      : { backgroundColor: "white" };
  };

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  const precautionChange = (dist: any) => {
    dist = JSON.parse(dist);
    setPrecaution(dist);
  };
  const userChange = (user: any) => {
    user = JSON.parse(user);
    setUser(user);
  };

  const handleFinish = async (editedUserPrecaution: any) => {
    const newPrecaution: UserPrecaution = {
      id: oldUserPrecaution.id,
      precautionId: precaution.id,
      precaution: precaution,
      user: user,
      userId: user.id,
      status: editedUserPrecaution.status,
      date: editedUserPrecaution.date,
      endDate: oldUserPrecaution.endDate,
      isActive: editedUserPrecaution.status === "Скасовано" ? false : true,
      reporter: editedUserPrecaution.reporter,
      reason: editedUserPrecaution.reason,
      number: editedUserPrecaution.number,
    };

    await precautionApi.editUserPrecaution(newPrecaution);
    setShowModal(false);
    form.resetFields();
    onEdit(
      newPrecaution.id,
      newPrecaution.precaution,
      newPrecaution.date,
      newPrecaution.endDate,
      newPrecaution.isActive,
      newPrecaution.reason,
      newPrecaution.status,
      newPrecaution.reporter,
      newPrecaution.number,
      newPrecaution.user,
      newPrecaution.user.id
    );
  };

  const isDisabledStartDate = (current: any) => {
    return current && current > moment();
  };

  return (
    <div>
      {!loading && (
        <Form
          name="basic"
          onFinish={handleFinish}
          form={form}
          id="area"
          style={{ position: "relative" }}
        >
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                initialValue={oldUserPrecaution.number}
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
                        ? value == oldUserPrecaution.number ||
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
                initialValue={oldUserPrecaution.precaution.name}
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
                  onSelect={precautionChange}
                  loading={loadingPrecautionStatus}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {distData?.map((o) => (
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
                initialValue={`${oldUserPrecaution.user.firstName} ${oldUserPrecaution.user.lastName}`}
                rules={[
                  {
                    required: true,
                    message: emptyInput(),
                  },
                ]}
              >
                <Select
                  className={formclasses.selectField}
                  onSelect={userChange}
                  showSearch
                  loading={loadingUserStatus}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {userData?.map((o) => (
                    <Select.Option
                      key={o.id}
                      value={JSON.stringify(o)}
                      style={backgroundColor(o)}
                      disabled={!o.isAvailable}
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
                initialValue={oldUserPrecaution.reporter}
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
                initialValue={moment.utc(oldUserPrecaution.date).local()}
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
                  getPopupContainer={() =>
                    document.getElementById("area")! as HTMLElement
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
                initialValue={oldUserPrecaution.reason}
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
                initialValue={oldUserPrecaution.status}
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
      )}
    </div>
  );
};

export default FormEditPrecaution;
