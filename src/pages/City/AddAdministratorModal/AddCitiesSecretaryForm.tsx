import React, { useState, useEffect } from "react";
import classes from "../../Regions/Form.module.css";
import { Form, DatePicker, AutoComplete, Select, Button } from "antd";
import {
  getCityUsers,
} from "../../../api/citiesApi";
import moment from "moment";
import {
  emptyInput, inputOnlyWhiteSpaces, maxLength
} from "../../../components/Notifications/Messages"
import CityAdmin from "../../../models/City/CityAdmin";
import AdminType from "../../../models/Admin/AdminType";
import "./AddCitiesSecretaryForm.less";
import userApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";
import CityUser from "../../../models/City/CityUser";
import {descriptionValidation} from "../../../models/GllobalValidations/DescriptionValidation"

type AddCitiesNewSecretaryForm = {
  setVisibleModal: (visibleModal: boolean) => void;
  visibleModal: boolean;
  onAdd: (admin: CityAdmin) => void;
  onCancel: () => void;
  cityId: number;
  admin?: any;
  head?: CityAdmin;
  headDeputy?: CityAdmin;
};
const AddCitiesNewSecretaryForm = (props: any) => {
  const { onAdd, onCancel } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [members, setMembers] = useState<CityUser[]>([]);
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const SetAdmin = async (property: any, value: any) => {
    let admin: CityAdmin = {
      id: property === undefined ? 0 : property.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: value.AdminType,
      },
      cityId: props.cityId,
      userId: property === undefined
        ? JSON.parse(value.userId).id
        : property.userId,
      user: JSON.parse(value.userId),
      endDate: value.endDate,
      startDate: value.startDate,
    };
    return admin;
  }

  const handleSubmit = async (values: any) => {
      const newAdmin = await SetAdmin(props.admin, values);
      onAdd(newAdmin);
  };

  const fetchData = async () => {
    if (props.cityId !== undefined)
    {
    await getCityUsers(props.cityId).then((response) => { 
      setMembers(response.data);
    });
    }
  };

  useEffect(() => {
    if (props.visibleModal) {
      form.resetFields();
      setLoading(false);
    }
    fetchData();
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
            required: props.admin === undefined,
            message: <div className="formItemExplain">{emptyInput()}</div>,
          },
        ]}
      >
        <Select showSearch className={classes.inputField}>
          {members?.map((o) => (
            <Select.Option key={o.id} value={JSON.stringify(o)}>            
              {o.firstName + " " + o.lastName}
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
        rules={descriptionValidation.AdminType}
      >
        <AutoComplete
          className={classes.inputField}
          options={[
            { value: Roles.CityHead, disabled: (activeUserRoles.includes(Roles.CityHeadDeputy)
            && activeUserRoles.includes(Roles.Admin)) },
            { value: Roles.CityHeadDeputy},
            { value: "Голова СПР" },
            { value: "Писар" },
            { value: "Скарбник" },
            { value: "Фотограф" },
            { value: "Домівкар" },
            { value: "Член СПР" },
          ]}
          placeholder={"Тип адміністрування"}
        />
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата початку"
        name="startDate"
        initialValue={
          props.admin === undefined ? undefined : moment.utc(props.admin.startDate).local()
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
              : moment.utc(props.admin.endDate).local()
        }
      >
        <DatePicker
          className={classes.inputField}
          disabledDate={disabledEndDate}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit" loading = {loading}>
          Опублікувати
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCitiesNewSecretaryForm;
