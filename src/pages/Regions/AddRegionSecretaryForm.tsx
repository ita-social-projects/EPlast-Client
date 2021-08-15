import React, { useState, useEffect } from "react";
import classes from "./Form.module.css";
import {Form, DatePicker, AutoComplete, Select, Button } from "antd";
import notificationLogic from "../../components/Notifications/Notification";
import regionsApi from "../../api/regionsApi";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import userApi from "../../api/UserApi";
import moment from "moment";
import {
  emptyInput,
} from "../../components/Notifications/Messages"
import AdminType from "../../models/Admin/AdminType";
import RegionUser from "../../models/Region/RegionUser";
import User from "../Distinction/Interfaces/User";
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
      user: value.user,
      endDate: value.endDate,
      startDate: value.startDate,
    };
    return admin;
  }

  const handleSubmit = async (values: any) => {
    if (JSON.parse(values.userId).id == props.head?.userId ) {
      const newAdmin = await SetAdmin(props.head, values);
      onAdd(newAdmin);  
    } else if (JSON.parse(values.userId).id == props.headDeputy?.userId){
      const newAdmin = await SetAdmin(props.headDeputy, values);
      onAdd(newAdmin);  
    } else if (JSON.parse(values.userId).id != props.head?.userId && JSON.parse(values.userId).id != props.headDeputy?.userId) {
      const newAdmin = await SetAdmin(props.admin, values);
      onAdd(newAdmin);
    }
  };
  const fetchData = async () => {
    await regionsApi.getAdminTypes().then((response) => {
      setTypes(response.data);
    });
    if (props.regionId !== undefined)
    {
    await regionsApi.getRegionUsers(props.regionId).then((response) => { 
      setUsers(response.data);
    });
    }
  };
  useEffect(() => {
    setCurrentRegion(
      Number(
        window.location.hash.substring(1) ||
        window.location.pathname.split("/").pop()
      )
    );
    fetchData();
  }, [props]);

  useEffect(() => {
    if (!props.visibleModal) {
      form.resetFields();
    }
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
        ]}
      >
        <AutoComplete
          className={classes.inputField}
          options={[
            { value: Roles.OkrugaHead, disabled: activeUserRoles.includes(Roles.OkrugaHeadDeputy) },
            { value: Roles.OkrugaHeadDeputy},
            { value: "Писар" },
            { value: "Бунчужний" },
            { value: "Скарбник" },
            { value: "Домівкар" },
            { value: "Член ОПР" },
            { value: "Голова ОПС" },
            { value: "Голова ОПР" },
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

export default AddNewSecretaryForm;
