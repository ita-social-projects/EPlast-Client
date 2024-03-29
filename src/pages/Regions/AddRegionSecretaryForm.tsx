import React, { useState, useEffect } from "react";
import { Form, DatePicker, AutoComplete, Select, Button, Row } from "antd";
import moment from "moment";
import classes from "./Form.module.css";
import regionsApi from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import { emptyInput } from "../../components/Notifications/Messages";
import AdminType from "../../models/Admin/AdminType";
import RegionUser from "../../models/Region/RegionUser";
import "./AddRegionSecretaryForm.less";
import { Roles } from "../../models/Roles/Roles";
import { descriptionValidation } from "../../models/GllobalValidations/DescriptionValidation";
import { minAvailableDate } from "../../constants/TimeConstants";

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
    return current && (current > moment() || !current.isAfter(minAvailableDate));
  };

  const SetAdmin = async (property: any, value: any) => {
    let admin: any = {
      id: property === undefined ? 0 : property.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: value.AdminType,
      },
      regionId: props.regionId,
      userId:
        property === undefined ? JSON.parse(value.userId).id : property.userId,
      user: JSON.parse(value.userId),
      endDate: value.endDate,
      startDate: value.startDate,
    };
    return admin;
  };

  const handleSubmit = async (values: any) => {
    const newAdmin = await SetAdmin(props.admin, values);
    onAdd(newAdmin);
  };

  const fetchData = async () => {
    if (props.regionId !== undefined) {
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
    <Form
      className={classes.form}
      name="basic"
      onFinish={async (values) => {
        setLoading(true);
        await handleSubmit(values);
        form.resetFields();
        setLoading(false);
      }}
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
    >
      <Form.Item
        className={classes.formSelectAlignCenter}
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
              {o.firstName} {o.lastName} <br /> {o.email}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        className={classes.formSelectAlignCenter}
        label="Тип адміністрування"
        initialValue={
          props.admin === undefined ? "" : props.admin.adminType.adminTypeName
        }
        name="AdminType"
        rules={descriptionValidation.AdminType}
      >
        <AutoComplete
          options={[
            {
              value: Roles.OkrugaHead,
              disabled:
                activeUserRoles.includes(Roles.OkrugaHeadDeputy) &&
                !activeUserRoles.includes(Roles.Admin),
            },
            { value: Roles.OkrugaHeadDeputy },
            { value: Roles.OkrugaReferentUPS },
            { value: Roles.OkrugaReferentUSP },
            { value: Roles.OkrugaReferentOfActiveMembership },
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
        label="Дата початку"
        name="startDate"
        rules={[descriptionValidation.Required]}
        initialValue={
          props.admin === undefined
            ? undefined
            : moment.utc(props.admin.startDate).local()
        }
      >
        <DatePicker
          className={classes.datePicker}
          disabledDate={disabledStartDate}
          onChange={(e) => setStartDate(e)}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item
        label="Дата кінця"
        name="endDate"
        rules={[descriptionValidation.Required]}
        initialValue={
          props.admin === undefined
            ? undefined
            : props.admin.endDate === null
            ? undefined
            : moment.utc(props.admin.endDate).local()
        }
      >
        <DatePicker
          className={classes.datePicker}
          disabledDate={disabledEndDate}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Row className={classes.submitRow}>
        <Button type="primary" htmlType="submit">
          Опублікувати
        </Button>
      </Row>
    </Form>
  );
};

export default AddNewSecretaryForm;
