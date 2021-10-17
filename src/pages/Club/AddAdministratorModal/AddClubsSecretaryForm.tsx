import React, { useState, useEffect } from "react";
import classes from "../../Regions/Form.module.css";
import { Form, DatePicker, AutoComplete, Select, Button } from "antd";
import { getAllMembers, getUserClubAccess } from "../../../api/clubsApi";
import moment from "moment";
import {emptyInput, inputOnlyWhiteSpaces,} from "../../../components/Notifications/Messages"
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
import AdminType from "../../../models/Admin/AdminType";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import ClubMember from "../../../models/Club/ClubMember";
import "./AddClubsSecretaryForm.less";

import userApi from "../../../api/UserApi";
import { Roles } from "../../../models/Roles/Roles";
import { useParams } from "react-router-dom";


type AddClubsNewSecretaryForm = {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  onAdd: (admin: ClubAdmin) => void;
  onCancel: () => void;
  clubId: number;
  admin?: any;
  head?: ClubAdmin;
  headDeputy?: ClubAdmin;
};
const AddClubsNewSecretaryForm = (props: any) => {
  const {id} = useParams();
  const { onAdd, onCancel } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [userClubAccesses, setUserClubAccesses] = useState<{[key: string] : boolean}>({});
  
  const getMembers = async () => {
    const responseMembers = await getAllMembers(props.clubId);
    await getUserAccessesForClubs();
    setMembers(responseMembers.data.members);
  };

  const getUserAccessesForClubs = async () => {
    let user: any = jwt(AuthStore.getToken() as string);
    await getUserClubAccess(+id, user.nameid).then(
      response => {
        setUserClubAccesses(response.data);
      }
    );
  }  

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const SetAdmin =  (property: any, value: any) => {
    let admin: ClubAdmin = {
      id: property === undefined ? 0 : property.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: value.AdminType,
      },
      clubId: props.clubId,
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
      const newAdmin = SetAdmin(props.head, values);
      onAdd(newAdmin);
    } else if (JSON.parse(values.userId).id == props.headDeputy?.userId){
      const newAdmin = SetAdmin(props.headDeputy, values);
      onAdd(newAdmin);  
    } else if (JSON.parse(values.userId).id != props.head?.userId && JSON.parse(values.userId).id != props.headDeputy?.userId) {
      const newAdmin = SetAdmin(props.admin, values);
      onAdd(newAdmin);
    }
     
  };

  useEffect(() => {
    if (props.visibleModal) {
      form.resetFields();
    }
    getMembers();
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
            <Select.Option key={o.userId} value={JSON.stringify(o.user)}>
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
          {
            pattern: /^\s*\S.*$/,
            message: <div className="formItemExplain">{inputOnlyWhiteSpaces()}</div>,
          },
        ]}
      >
        <AutoComplete
          className={classes.inputField}
          options={[
            { value: Roles.KurinHead, disabled: !userClubAccesses["AddClubHead"] },
            { value: Roles.KurinHeadDeputy },
            { value: "Голова СПС" },
            { value: "Фотограф" },
            { value: "Писар" },
            { value: "Скарбник" },
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
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddClubsNewSecretaryForm;
