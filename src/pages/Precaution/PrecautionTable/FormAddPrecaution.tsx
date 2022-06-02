import React, { useEffect, useState } from "react";
import { Form, DatePicker, Select, Input, Button, Row, Col } from "antd";
import Precaution from "../Interfaces/Precaution";
import UserPrecaution from "../Interfaces/UserPrecaution";
import precautionApi from "../../../api/precautionApi";
import formclasses from "./Form.module.css";
import NotificationBoxApi from "../../../api/NotificationBoxApi";
import notificationLogic from "../../../components/Notifications/Notification";
import { failCreateAction } from "../../../components/Notifications/Messages";
import {
  emptyInput,
  maxNumber,
} from "../../../components/Notifications/Messages";
import moment from "moment";
import {
  descriptionValidation,
  getOnlyNums,
} from "../../../models/GllobalValidations/DescriptionValidation";
import AvailableUser from "../Interfaces/AvailableUser";

type FormAddPrecautionProps = {
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: () => void;
};

const FormAddPrecaution: React.FC<FormAddPrecautionProps> = (props: any) => {
  const { setVisibleModal, onAdd } = props;
  const [form] = Form.useForm();

  const [userData, setUserData] = useState<AvailableUser[]>([
    {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      isInLowerRole: false
    }
  ]);
  const [distData, setDistData] = useState<Precaution[]>(Array<Precaution>());
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const dateFormat = "DD.MM.YYYY";

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  useEffect(() => {
    const fetchData = async () => {
      await precautionApi.getPrecautions().then((response) => {
        setDistData(response.data);
      });
      setLoadingUserStatus(true);
      await precautionApi
        .getUsersForPrecaution()
        .then((response) => {
          setUserData(response.data);
          setLoadingUserStatus(false);
        });
    };
    fetchData();
  }, []);

  const backgroundColor = (user: any) => {
    return user.isInLowerRole
      ? { backgroundColor: "#D3D3D3" }
      : { backgroundColor: "white" };
  };

  const handleCancel = () => {
    form.resetFields();
    setVisibleModal(false);
  };

  const createNotifications = async (userPrecaution: UserPrecaution) => {
    await NotificationBoxApi.createNotifications(
      [userPrecaution.userId],
      `Вам було надано нову пересторогу: '${userPrecaution.precaution.name}' від ${userPrecaution.reporter}. `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/Precautions`,
      `Переглянути`
    );

    await NotificationBoxApi.getCitiesForUserAdmins(userPrecaution.userId).then(
      (res) => {
        res.cityRegionAdmins.length !== 0 &&
          res.cityRegionAdmins.forEach(async (cra) => {
            await NotificationBoxApi.createNotifications(
              [cra.cityAdminId, cra.regionAdminId],
              `${res.user.firstName} ${res.user.lastName}, який є членом станиці: '${cra.cityName}' отримав нову пересторогу: '${userPrecaution.precaution.name}' від ${userPrecaution.reporter}. `,
              NotificationBoxApi.NotificationTypes.UserNotifications,
              `/Precautions`,
              `Переглянути`
            );
          });
      }
    );
  };
  const AddPrecaution = async (newPrecaution: UserPrecaution) => {
    await precautionApi.addUserPrecaution(newPrecaution);
    setVisibleModal(false);
    form.resetFields();
    onAdd();
    await createNotifications(newPrecaution);
  };

  const activePrecautionNofication = async (newPrecaution: UserPrecaution) => {
    await precautionApi
      .getUserActivePrecautionEndDate(
        newPrecaution.userId,
        newPrecaution.precaution.name
      )
      .then((response) => {
        notificationLogic(
          "error",
          failCreateAction(
            "пересторогу! Користувач має активну до " + response.data + "!"
          )
        );
      });
  };
  const handleSubmit = async (values: any) => {
    const newPrecaution: UserPrecaution = {
      id: 0,
      precautionId: JSON.parse(values.Precaution).id,
      precaution: JSON.parse(values.Precaution),
      user: JSON.parse(values.user),
      userId: JSON.parse(values.user).id,
      status: values.status,
      date: values.date,
      endDate: values.date,
      isActive: true,
      reporter: values.reporter,
      reason: values.reason,
      number: values.number,
    };

    await precautionApi
      .checkUserPrecautionsType(
        newPrecaution.userId,
        newPrecaution.precaution.name
      )
      .then((response) => {
        if (response.data) {
          activePrecautionNofication(newPrecaution);
        } else {
          AddPrecaution(newPrecaution);
        }
      });
  };
  return (
    <Form
      name="basic"
      onFinish={handleSubmit}
      form={form}
      id="area"
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
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {distData?.map((user) => (
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
              loading={loadingUserStatus}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              {userData?.map((user) => (
                <Select.Option
                  key={user.id}
                  value={JSON.stringify(user)}
                  style={backgroundColor(user)}
                  disabled={user.isInLowerRole}
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
    </Form>
  );
};

export default FormAddPrecaution;
