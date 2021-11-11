import React, { useState, useEffect } from "react";
import classes from "./Form.module.css";
import {Form, DatePicker, AutoComplete, Select, Button } from "antd";
import regionsApi from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import moment from "moment";
import {
  emptyInput, inputOnlyWhiteSpaces,
} from "../../components/Notifications/Messages"
import AdminType from "../../models/Admin/AdminType";
import RegionUser from "../../models/Region/RegionUser";
import "./AddRegionSecretaryForm.less";
import { Roles } from "../../models/Roles/Roles";

type AddNewSecretaryForm = {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (admin: any) => void;
  onCancel: () => void;
  admin?: any;
  regionId: any;
  head?: any;
  headDeputy?: any;
};

const AddNewSecretaryForm = (props: any) => {
  const [currentRegion, setCurrentRegion] = useState<number>();
  const { onAdd, onCancel } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [users, setUsers] = useState<Array<RegionUser>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);

  const [types, setTypes] = useState<any[]>([
    {
      id: "",
      adminTypeName: "",
    },
  ]);

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const SetAdmin = async  (property: any, value: any) => {
    let admin: any = {
      id: property === undefined ? 0 : property.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: value.AdminType,
      },
      regionId: props.regionId,
      AdminTypeId: await (
        await regionsApi.getAdminTypeIdByName(value.AdminType)
      ).data,
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
    if (props.regionId !== undefined)
    {
    await regionsApi.getRegionUsers(props.regionId).then((response) => { 
      setUsers(response.data);
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

  useEffect(() => {
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
          {users?.map((o) => (
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
        rules={[
          {
            required: true,
            message: <div className="formItemExplain">{emptyInput()}</div>,
          },
          {
            pattern: /^\s*\S.*$/,
            message: <div className="formItemExplain">{inputOnlyWhiteSpaces()}</div>,
          },
        ]}
      >
        <AutoComplete
          className={classes.inputField}
          options={[
            { value: Roles.OkrugaHead,  disabled: (activeUserRoles.includes(Roles.OkrugaHeadDeputy) 
              && !activeUserRoles.includes(Roles.Admin)) },
            { value: Roles.OkrugaHeadDeputy},
            { value: "Писар" },
            { value: "Бунчужний" },
            { value: "Скарбник" },
            { value: "Домівкар" },
            { value: "Член ОПР" },
            { value: "Голова ОПР" },
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
        <Button type="primary" loading = {loading} onClick = {() => {setLoading(true); handleSubmit(form.getFieldsValue());}}>
          Опублікувати
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddNewSecretaryForm;
