import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  notification,
  Row,
  Col,
} from "antd";
import precautionApi from "../../../api/precautionApi";
import UserPrecaution from "../Interfaces/UserPrecaution";
import formclasses from "./Form.module.css";
import adminApi from "../../../api/adminApi";
import Precaution from "../Interfaces/Precaution";
import {
  emptyInput,
  failEditAction,
  maxNumber,
  minNumber
} from "../../../components/Notifications/Messages"
import moment from "moment";
import "moment/locale/uk";
import { descriptionValidation, getOnlyNums } from "../../../models/GllobalValidations/DescriptionValidation";
moment.locale("uk-ua");

interface Props {
  record: number;
  Precaution: UserPrecaution;
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
  record,
  setShowModal,
  onEdit,
  Precaution,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<any[]>([
    {
      user: {
        id: "",
        firstName: "",
        lastName: "",
        birthday: "",
      },
      regionName: "",
      cityName: "",
      clubName: "",
      userPlastDegreeName: "",
      userRoles: "",
    },
  ]);
  const [distData, setDistData] = useState<Precaution[]>(Array<Precaution>());
  const [loadingUserStatus, setLoadingUserStatus] = useState(false);
  const [distValue, setDistValue] = useState<any>();
  const [userValue, setUserValue] = useState<any>();
  const dateFormat = "DD.MM.YYYY";

  useEffect(() => {
    setLoading(true);
    form.resetFields();
    const fetchData = async () => {
      setDistData([]);
      setUserData([]);
      await precautionApi.getPrecautions().then((response) => {
        setDistData(response.data);
      });
      setLoadingUserStatus(true);
      await adminApi.getUsersForTable().then((response) => {
        setUserData(response.data);
      });
      setLoadingUserStatus(false);
    };
    fetchData();
    setLoading(false);
    setDistValue(Precaution.precaution);
    setUserValue(Precaution.user);
  }, [Precaution]);

  const backgroundColor = (user: any) => {
    return user.isInLowerRole ? { backgroundColor : '#D3D3D3' } : { backgroundColor : 'white' };
  }    

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  const distChange = (dist: any) => {
    dist = JSON.parse(dist);
    setDistValue(dist);
  };
  const userChange = (user: any) => {
    user = JSON.parse(user);
    setUserValue(user);
  };

  const handleFinish = async (dist: any) => {
    const newPrecaution: any = {
      id: record,
      PrecautionId: distValue.id,
      Precaution: distValue,
      user: userValue,
      userId: userValue.id,
      status: dist?.status,
      date: dist?.date,
      endDate: Precaution.endDate,
      isActive: dist?.status === "Скасовано" ? false : true,
      reporter: dist?.reporter,
      reason: dist?.reason,
      number: dist?.number,
    };
    
      await precautionApi.editUserPrecaution(newPrecaution);
      setShowModal(false);
      form.resetFields();
      onEdit(
        newPrecaution.id,
        newPrecaution.Precaution,
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

  return (
    <div>
      {!loading && (
        <Form name="basic" onFinish={handleFinish} form={form} id='area' style={{position: 'relative'}}>
          <Row justify="start" gutter={[12, 0]}>
            <Col md={24} xs={24}>
              <Form.Item
                initialValue={Precaution.number}
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
                      validator: async (_ : object, value: number) => 
                      value && !isNaN(value)
                          ? value == Precaution.number || 
                          await precautionApi
                            .checkNumberExisting(value)
                            .then(response => response.data === false)
                              ? Promise.resolve()
                                : Promise.reject("Цей номер уже зайнятий")
                                : Promise.reject()
                    }
                  ]}
              >
                <Input
                  onChange={(e) => {
                    form.setFieldsValue({
                      number: getOnlyNums(e.target.value),
                    });
                  }}
                  autoComplete = "off"
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
                initialValue={Precaution.precaution.name}
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
                  onSelect={distChange}
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
                initialValue={
                  Precaution.user.firstName + " " + Precaution.user.lastName
                }
                rules={[
                  { 
                    required: true, 
                    message: emptyInput() 
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
                          disabled={o.isInLowerRole}
                          >
                      {o.firstName + " " + o.lastName}
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
                initialValue={Precaution.reporter}
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
                initialValue={moment.utc(Precaution.date).local()}
                rules={[
                  { 
                    required: true, 
                    message: emptyInput() 
                  },
                ]}
              >
                <DatePicker
                  format={dateFormat}
                  className={formclasses.selectField}
                  getPopupContainer = {() => document.getElementById('area')! as HTMLElement}
                  popupStyle={{position: 'absolute'}}
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
                initialValue={Precaution.reason}
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
                initialValue={Precaution.status}
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
                  <Select.Option key="9" value="Прийнято">Прийнято</Select.Option>
                  <Select.Option key="10" value="Потверджено">Потверджено</Select.Option>
                  <Select.Option key="11" value="Скасовано">Скасовано</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {Precaution.isActive ? <Form.Item>
            <div className={formclasses.cardButton}>
              <Button key="back" onClick={handleCancel} className={formclasses.buttons}>
                Відмінити
              </Button>
              <Button type="primary" htmlType="submit" className={formclasses.buttons}>
                Зберегти
              </Button>
            </div>
          </Form.Item> : ""}
        </Form>
      )}
    </div>
  );
};

export default FormEditPrecaution;
