import React, { useEffect, useState } from "react";
import "./AddAdministrationModal.less";
import { AutoComplete, Button, Col, DatePicker, Form, Modal, Row } from "antd";
import CityAdmin from "./../../../models/City/CityAdmin";
import AdminType from "./../../../models/Admin/AdminType";
import { addAdministrator, editAdministrator } from "../../../api/citiesApi";
import notificationLogic from "./../../../components/Notifications/Notification";
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  admin: CityAdmin;
  setAdmin: (admin: CityAdmin) => void;
  cityId: number;
  onAdd?: (admin?: CityAdmin) => void;
  onChange?: (id: string, userRoles: string) => void;
}

const AddAdministratorModal = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<any>();
  const [form] = Form.useForm();

  const disabledEndDate = (current: any) => {
    return current && current < date;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    let admin: CityAdmin = {
      id: props.admin.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: values.adminType,
      },
      cityId: props.cityId,
      user: props.admin.user,
      userId: props.admin.userId,
      endDate: values.endDate?._d,
      startDate: values.startDate?._d,
    };

    try {
      if (admin.id === 0) {
        admin = (await addAdministrator(props.admin.cityId, admin)).data;
      } else {
        admin = (await editAdministrator(props.admin.cityId, admin)).data;
      }
    } finally {
      props.onAdd?.(admin);
      props.setVisibleModal(false);
      notificationLogic("success", "Користувач успішно доданий в провід");
      props.onChange?.(props.admin.userId, values.adminType);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    props.setVisibleModal(false);
  };

  useEffect(() => {
    if (props.visibleModal) {
      form.resetFields();
    }
  }, [props]);

  return (
    <Modal
      title={
        props.admin.id === 0
          ? "Додати в провід станиці"
          : "Редагувати адміністратора"
      }
      visible={props.visibleModal}
      footer={null}
      confirmLoading={loading}
      className="addAdministrationModal"
      onCancel={handleCancel}
    >
      <Form name="basic" onFinish={handleSubmit} form={form}>
        <Form.Item
          className="adminTypeFormItem"
          name="adminType"
          label="Виберіть тип адміністрування"
          labelCol={{ span: 24 }}
          initialValue={props.admin.adminType.adminTypeName}
          rules={[{ required: true, message: "Це поле є обов'язковим" }]}
        >
          <AutoComplete
            className="adminTypeSelect"
            options={[
              { value: "Голова Станиці" },
              { value: "Голова СПС" },
              { value: "Писар" },
              { value: "Скарбник" },
              { value: "Домівкар" },
              { value: "Член СПР" },
            ]}
            filterOption={(inputValue, option) =>
              option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
            placeholder={"Тип адміністрування"}
            value={props.admin.adminType.adminTypeName}
          ></AutoComplete>
        </Form.Item>
        <Row>
          <Col span={11}>
            <Form.Item
              name="startDate"
              label="Час початку"
              labelCol={{ span: 24 }}
              initialValue={
                props.admin.startDate
                  ? moment(props.admin.startDate)
                  : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledStartDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.startDate
                    ? moment(props.admin.startDate)
                    : undefined
                }
                onChange={(e) => setDate(e)}
              />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="endDate"
              label="Час кінця"
              labelCol={{ span: 24 }}
              initialValue={
                props.admin.endDate ? moment(props.admin.endDate) : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledEndDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.endDate ? moment(props.admin.endDate) : undefined
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="cancelConfirmButtons">
          <Row justify="end">
            <Col xs={11} sm={5}>
              <Button key="back" onClick={handleCancel}>
                Відмінити
              </Button>
            </Col>
            <Col
              className="publishButton"
              xs={{ span: 11, offset: 2 }}
              sm={{ span: 6, offset: 1 }}
            >
              <Button type="primary" htmlType="submit">
                Опублікувати
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAdministratorModal;
