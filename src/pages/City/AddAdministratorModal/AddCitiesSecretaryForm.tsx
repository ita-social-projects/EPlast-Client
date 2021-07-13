import React, { useState, useEffect } from "react";
import classes from "../../Regions/Form.module.css";
import { Form, DatePicker, AutoComplete, Select, Modal, Button } from "antd";
import {
  getAllAdmins,
  getAllMembers,
} from "../../../api/citiesApi";
import moment from "moment";
import {
  emptyInput,
} from "../../../components/Notifications/Messages"
import CityAdmin from "../../../models/City/CityAdmin";
import AdminType from "../../../models/Admin/AdminType";
import CityMember from "../../../models/City/CityMember";
import "./AddCitiesSecretaryForm.less";
import userApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";

type AddCitiesNewSecretaryForm = {
  onAdd: (admin: CityAdmin) => void;
  onCancel: () => void;
  cityId: number;
  admin?: any;
};
const AddCitiesNewSecretaryForm = (props: any) => {
  const { onAdd, onCancel } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [members, setMembers] = useState<CityMember[]>([]);

  const getMembers = async () => {
    const responseMembers = await getAllMembers(props.cityId);
    setMembers(responseMembers.data.members);
  };

  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);



  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };



  const handleSubmit = async (values: any) => {
    const newAdmin: CityAdmin = {
      id: props.admin === undefined ? 0 : props.admin.id,
      userId: props.admin === undefined
        ? JSON.parse(values.userId).id
        : props.admin.userId,
      user: values.user,
      adminType: {
        ...new AdminType(),
        adminTypeName: values.AdminType,
      },
      cityId: props.cityId,
      startDate: values.startDate,
      endDate: values.endDate,
    };
    onAdd(newAdmin);
  };

  useEffect(() => {
    if (props.visibleModal) {
      form.resetFields();
    }
    getMembers();
    const userRoles = userApi.getActiveUserRoles();
      setActiveUserRoles(userRoles);
  }, [props]);

  return (
    <Form name="basic" onFinish={handleSubmit} form={form} className="formAddSecretaryModal">
      <Form.Item
        className={classes.formField}
        style={{ display: props.admin === undefined ? "flex" : "none" }}
        label="Користувач"
        name="userId"
        rules={[
          {
            required: props.admin === undefined ? true : false,
            message: <div className="formItemExplain">{emptyInput()}</div>,
          },
        ]}
      >
        <Select showSearch className={classes.inputField}>
          {members?.map((o) => (
            <Select.Option key={o.user.id} value={JSON.stringify(o.user)}>
              {o.user.firstName + " " + o.user.lastName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Тип адміністрування"
        initialValue={
          props.admin === undefined ? "" : props.admin.adminType.adminTypeName
        }
        name="AdminType"
        rules={[
          {
            required: true,
            message: <div className="formItemExplain">{emptyInput()}</div>,
          },
        ]}
      >
        <AutoComplete
          className={classes.inputField}
          options={[
            { value: Roles.CityHead, disabled: activeUserRoles.includes(Roles.CityHeadDeputy) },
            { value: Roles.CityHeadDeputy},
            { value: "Голова СПС" },
            { value: "Писар" },
            { value: "Скарбник" },
            { value: "Домівкар" },
            { value: "Член СПР" },
          ]}
          placeholder={"Тип адміністрування"}
        ></AutoComplete>
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата початку"
        name="startDate"
        initialValue={
          props.admin === undefined ? undefined : moment(props.admin.startDate)
        }
      >
        <DatePicker
          className={classes.inputField}
          disabledDate={disabledStartDate}
          onChange={(e) => setStartDate(e)}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата кінця"
        name="endDate"
        initialValue={
          props.admin === undefined
            ? undefined
            : props.admin.endDate === null
              ? undefined
              : moment(props.admin.endDate)
        }
      >
        <DatePicker
          className={classes.inputField}
          disabledDate={disabledEndDate}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCitiesNewSecretaryForm;
