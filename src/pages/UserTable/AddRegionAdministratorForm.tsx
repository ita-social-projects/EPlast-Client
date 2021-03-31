import React, { useState, useEffect } from "react";
import { Form, Button, Select, DatePicker, AutoComplete } from "antd";
import classes from "../../pages/Regions/Form.module.css";
import regionsApi, { getRegionAdministration } from "../../api/regionsApi";
import notificationLogic from "../../components/Notifications/Notification";
import ConfirmRegionAdminModal from "./ConfirmRegionAdministrationModal";
import moment from "moment";
import{ emptyInput } from "../../components/Notifications/Messages"

interface Props {
  userId: string;
  showAdministratorModal: boolean;
  regionId: number;
  setShowAdministratorModal: (showAdministratorModal: boolean) => void;
  roles: string | undefined;
  onChange: (id: string, userRoles: string) => void;
}

const AddNewAdministratorForm = ({
  userId,
  showAdministratorModal,
  setShowAdministratorModal,
  regionId,
  roles,
  onChange,
}: Props) => {
  const [currentRegion, setCurrentRegion] = useState<number>(0);
  const [form] = Form.useForm();
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [administration, setAdministration] = useState<any[]>([
    {
      id: "",
      user: {
        firstName: "",
        lastName: "",
        imagePath: "",
      },
      adminType: {
        adminTypeName: "",
      },
      startDate: "",
      endDate: "",
    },
  ]);
  const [adminType, setAdminType] = useState<any>();
  const [startDay, setStartDay] = useState<any>();
  const [endDay, setEndDay] = useState<any>();
  const [endDayOld, setEndDayOld] = useState<any>();
  const [oldAdminFirstName, setOldAdminFirstName] = useState<string>();
  const [oldAdminLastName, setOldAdminLastName] = useState<string>();

  const disabledEndDate = (current: any) => {
    return current && current < startDay;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const getAdministration = async () => {
    const response = await getRegionAdministration(regionId);
    setAdministration([...response.data].filter((a) => a != null));
  };

  const handleClick = async (value: any) => {
    setAdminType(value);
    const oldAdmin = administration.find(
      (a: any) => a.adminType.adminTypeName === value
    );
    if (oldAdmin !== undefined) {
      setEndDayOld(moment(oldAdmin.endDate).format("DD.MM.YYYY"));
      setOldAdminFirstName(oldAdmin.user.firstName);
      setOldAdminLastName(oldAdmin.user.lastName);
    }
  };

  const handleSubmit = async (values: any) => {
    const oldAdmin = administration.find(
      (a: any) => a.adminType.adminTypeName === values.AdminType
    );
    const newAdmin: any = {
      id: 0,
      userId: userId,
      AdminTypeId: await (
        await regionsApi.getAdminTypeIdByName(values.AdminType)
      ).data,
      startDate: values.startDate,
      endDate: values.endDate,
      regionId: regionId,
    };
    if (oldAdmin !== undefined && values.AdminType === "Голова Округи") {
      setShowAdministratorModal(false);
      setShowConfirmModal(true);
    } else {
      await regionsApi.AddAdmin(newAdmin);
      notificationLogic("success", "Користувач успішно доданий в провід");
      form.resetFields();
      onChange(userId, values.AdminType);
      setShowAdministratorModal(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {};
    setCurrentRegion(regionId);
    getAdministration();
    fetchData();
  }, []);

  return (
    <Form name="basic" onFinish={handleSubmit} form={form}>
      <Form.Item
        className={classes.formField}
        label="Тип адміністрування"
        name="AdminType"
        rules={[
          {
            required: true,
            message: emptyInput(),
          },
        ]}
      >
        {roles?.includes("Дійсний член організації") ? (
          <AutoComplete
            className={classes.inputField}
            onChange={handleClick}
            options={[
              { value: "Голова Округи" },
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
        ) : (
          <AutoComplete
            className={classes.inputField}
            onChange={handleClick}
            options={[
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
        )}
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата початку"
        name="startDate"
      >
        <DatePicker
          className={classes.inputField}
          disabledDate={disabledStartDate}
          onChange={(e) => setStartDay(e)}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item
        className={classes.formField}
        label="Дата кінця"
        name="endDate"
      >
        <DatePicker
          className={classes.inputField}
          disabledDate={disabledEndDate}
          onChange={(e) => setEndDay(e)}
          format="DD.MM.YYYY"
        />
      </Form.Item>

      <Form.Item style={{ textAlign: "right" }}>
        <Button type="primary" htmlType="submit">
          Призначити
        </Button>
      </Form.Item>
      <ConfirmRegionAdminModal
        onChange={onChange}
        visibleModal={showConfirmModal}
        setVisibleModal={setShowConfirmModal}
        userId={userId}
        regionId={regionId}
        adminType={adminType}
        startDate={startDay}
        endDate={endDay}
        endDayOld={endDayOld}
        oldAdminFirstName={oldAdminFirstName}
        oldAdminLastName={oldAdminLastName}
      />
    </Form>
  );
};

export default AddNewAdministratorForm;
