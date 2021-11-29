import React, { useState, useEffect } from "react";
import classes from "../../Regions/Form.module.css";
import { Form, DatePicker, AutoComplete, Select, Button } from "antd";
import { getClubUsers, getUserClubAccess } from "../../../api/clubsApi";
import moment from "moment";
import {emptyInput, inputOnlyWhiteSpaces,} from "../../../components/Notifications/Messages"
import AuthStore from "../../../stores/AuthStore";
import jwt from 'jwt-decode';
import AdminType from "../../../models/Admin/AdminType";
import ClubAdmin from "../../../models/Club/ClubAdmin";
import "./AddClubsSecretaryForm.less";
import { Roles } from "../../../models/Roles/Roles";
import { useParams } from "react-router-dom";
import ClubUser from "../../../models/Club/ClubUser";
import {descriptionValidation} from "../../../models/GllobalValidations/DescriptionValidation"

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
  const { id } = useParams();
  const { onAdd, onCancel } = props;
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState<any>();
  const [members, setMembers] = useState<ClubUser[]>([]);
  const [userClubAccesses, setUserClubAccesses] = useState<{[key: string] : boolean}>({});
  const [loading, setLoading] = useState<boolean>(false);

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

  const SetAdmin = (property: any, value: any) => {
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
      user: JSON.parse(value.userId),
      endDate: value.endDate,
      startDate: value.startDate,
    };
    return admin;
  }

  const handleSubmit = async (values: any) => {
      const newAdmin = SetAdmin(props.admin, values);
      onAdd(newAdmin);   
  };

  const fetchData = async () => {
    if (props.clubId !== undefined)
    {
    await getUserAccessesForClubs();
    await getClubUsers(props.clubId).then((response) => { 
      setMembers(response.data);
    });
    }
  };

  useEffect(() => {
    if (props.visibleModal) {
      form.resetFields();
      setLoading(false)
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
            { value: Roles.KurinHead, disabled: !userClubAccesses["AddClubHead"] },
            { value: Roles.KurinHeadDeputy },
            { value: "Голова КПР" },
            { value: "Фотограф" },
            { value: "Писар" },
            { value: "Скарбник" },
            { value: "Домівкар" },
            { value: "Член КПР" },
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

export default AddClubsNewSecretaryForm;
