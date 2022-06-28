import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Select,
  Row,
  Col,
  AutoComplete,
  DatePicker,
  Modal,
  Input,
  message,
} from "antd";
import moment from "moment";
import classes from "../Regions/Form.module.css";
import NotificationBoxApi from "../../api/NotificationBoxApi";
import {
  emptyInput,
  inputOnlyWhiteSpaces,
} from "../../components/Notifications/Messages";
import { Roles } from "../../models/Roles/Roles";
import {
  addAdministrator,
  getGoverningBodiesList,
  getGoverningBodyById,
  addMainAdmin,
  checkRoleNameExists,
} from "../../api/governingBodiesApi";
import { GoverningBody } from "../../api/decisionsApi";
import SectorProfile from "../../models/GoverningBody/Sector/SectorProfile";
import {
  getAllAdmins,
  getSectorsListByGoverningBodyId,
  addAdministrator as addSectorAdministrator,
} from "../../api/governingBodySectorsApi";
import GoverningBodyAdmin from "../../models/GoverningBody/GoverningBodyAdmin";
import AdminType from "../../models/Admin/AdminType";
import userApi from "../../api/UserApi";
import notificationLogic from "../../components/Notifications/Notification";
import SectorAdmin from "../../models/GoverningBody/Sector/SectorAdmin";

interface Props {
  onChange: (id: string, userRoles: string) => void;
  record: string;
  setShowModal: (showModal: boolean) => void;
  user: any;
}

const ChangeUserRoleForm = ({
  record,
  setShowModal,
  onChange,
  user,
}: Props) => {
  const userId = record;
  const [form] = Form.useForm();

  const [startDate, setStartDate] = useState<any>();

  const [gvbLoading, setGvbLoading] = useState<boolean>(false);
  const [governingBodies, setGoverningBodies] = useState<GoverningBody[]>([]);
  const [governingBodiesAdmins, setGoverningBodiesAdmins] = useState<
    GoverningBodyAdmin[]
  >([]);
  const [sectorsAdmins, setSectorsAdmins] = useState<SectorAdmin[]>([]);

  const [hideFields, setHideFields] = useState<boolean>(false);

  const [sectorsLoading, setSectorsLoading] = useState<boolean>(false);
  const [sectors, setSectors] = useState<SectorProfile[]>([]);

  const [selectSectorId, setSelectSectorId] = useState<any>();
  const [selectGoverningBodyId, setSelectGoverningBodyId] = useState<number>(0);

  const [isSubmitActive, setIsSubmitActive] = useState<boolean>(true);

  const fetchData = async () => {
    setGvbLoading(true);
    try {
      const response = await getGoverningBodiesList();
      setGoverningBodies(response);
    } finally {
      setGvbLoading(false);
    }
  };

  const governingBodyChange = async (id: number) => {
    const governingBodyViewModel = (await getGoverningBodyById(id))
      .governingBodyViewModel;
    setGoverningBodiesAdmins(
      [
        governingBodyViewModel.head,
        ...governingBodyViewModel.administration,
      ].filter((a) => a !== null)
    );
    const response = await getSectorsListByGoverningBodyId(id);
    setSectors(response);
  };

  const sectorChange = async (id: number) => {
    const admins = await getAllAdmins(id);
    setSectorsAdmins(
      [admins.data.head, ...admins.data.admins].filter((a) => a !== null)
    );
  };

  const onSectorSelect = async (value: any) => {
    setSectorsLoading(true);
    try {
      const { id } = JSON.parse(value.toString());
      setSelectSectorId(id);
      sectorChange(id);
    } finally {
      setSectorsLoading(false);
    }
  };

  const onGvbSelect = async (value: any) => {
    setSectorsLoading(true);
    try {
      form.setFieldsValue({ sector: undefined });
      const { id } = JSON.parse(value.toString());
      setSelectGoverningBodyId(id);
      governingBodyChange(id);
    } finally {
      setSectorsLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
  };

  const addGoverningBodyAdmin = async (admin: GoverningBodyAdmin) => {
    if (admin.adminType.adminTypeName === "Крайовий Адмін") {
      await addMainAdmin(admin);
      notificationLogic("success", "Користувач успішно доданий в провід");
      form.resetFields();
      setShowModal(false);
      onChange(admin.userId, admin.adminType.adminTypeName);
      await NotificationBoxApi.createNotifications(
        [admin.userId],
        `Вам була присвоєна адміністративна роль: '${admin.adminType.adminTypeName}'`,
        NotificationBoxApi.NotificationTypes.UserNotifications
      );
    } else {
      await addAdministrator(admin.governingBodyId, admin);
      notificationLogic("success", "Користувач успішно доданий в провід");
      form.resetFields();
      setShowModal(false);
      onChange(admin.userId, admin.adminType.adminTypeName);
      await NotificationBoxApi.createNotifications(
        [admin.userId],
        `Вам була присвоєна адміністративна роль: '${admin.adminType.adminTypeName}' в `,
        NotificationBoxApi.NotificationTypes.UserNotifications,
        `/governingBodies/${admin.governingBodyId}`,
        `цьому керівному органі`
      );
    }
  };

  const addSectorAdmin = async (admin: SectorAdmin) => {
    await addSectorAdministrator(admin.sectorId, admin);
    notificationLogic("success", "Користувач успішно доданий в провід");
    form.resetFields();
    setShowModal(false);
    onChange(admin.userId, admin.adminType.adminTypeName);
    await NotificationBoxApi.createNotifications(
      [admin.userId],
      `Вам була присвоєна адміністративна роль: '${admin.adminType.adminTypeName}' в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/sectors/${admin.sectorId}`,
      `цьому керівному органі`
    );
  };

  const showConfirm = (
    newAdmin: GoverningBodyAdmin,
    existingAdmin: GoverningBodyAdmin
  ) => {
    Modal.confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {existingAdmin.user.firstName} {existingAdmin.user.lastName}
          </b>{" "}
          вже має роль "{existingAdmin.adminType.adminTypeName}", час правління
          закінчується{" "}
          <b>
            {existingAdmin.endDate === null ||
            existingAdmin.endDate === undefined
              ? "ще не скоро"
              : moment(existingAdmin.endDate).format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() {},
      onOk() {
        addGoverningBodyAdmin(newAdmin);
        setGoverningBodiesAdmins(
          governingBodiesAdmins.map((x) =>
            x.userId === existingAdmin?.userId ? newAdmin : x
          )
        );
      },
    });
  };

  const showSectorConfirm = (
    newAdmin: SectorAdmin,
    existingAdmin: SectorAdmin
  ) => {
    Modal.confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {existingAdmin.user.firstName} {existingAdmin.user.lastName}
          </b>{" "}
          вже має роль "{existingAdmin.adminType.adminTypeName}", час правління
          закінчується{" "}
          <b>
            {existingAdmin.endDate === null ||
            existingAdmin.endDate === undefined
              ? "ще не скоро"
              : moment(existingAdmin.endDate).format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() {},
      onOk() {
        addSectorAdmin(newAdmin);
        setSectorsAdmins(
          sectorsAdmins.map((x) =>
            x.userId === existingAdmin?.userId ? newAdmin : x
          )
        );
      },
    });
  };

  const handleFinish = async (value: any) => {
    setGvbLoading(true);
    if (selectSectorId) {
      const newAdmin: SectorAdmin = {
        id: 0,
        userId,
        user,
        adminType: {
          ...new AdminType(),
          adminTypeName: value.AdminType,
        },
        sectorId: selectSectorId,
        startDate: value.startDate,
        endDate: value.endDate,
        workEmail: user.email,
      };
      newAdmin.user.imagePath = (
        await userApi.getImage(newAdmin.user.imagePath)
      ).data;

      const existingAdmin = sectorsAdmins.find(
        (x) => x.adminType.adminTypeName === newAdmin.adminType.adminTypeName
      );
      if (existingAdmin !== undefined) {
        showSectorConfirm(newAdmin, existingAdmin);
      } else {
        addSectorAdmin(newAdmin);
        setSectorsAdmins((old: SectorAdmin[]) => [...old, newAdmin]);
      }
    } else {
      const newAdmin: GoverningBodyAdmin = {
        id: 0,
        userId,
        user,
        adminType: {
          ...new AdminType(),
          adminTypeName: value.AdminType,
        },
        governingBodyId: selectGoverningBodyId,
        startDate: value.startDate,
        endDate: value.endDate,
        workEmail: user.email,
        governingBodyAdminRole: value.GBARole,
      };
      newAdmin.user.imagePath = (
        await userApi.getImage(newAdmin.user.imagePath)
      ).data;
      const existingAdmin = governingBodiesAdmins.find(
        (x) => x.adminType.adminTypeName === newAdmin.adminType.adminTypeName
      );
      if (existingAdmin !== undefined) {
        showConfirm(newAdmin, existingAdmin);
      } else {
        addGoverningBodyAdmin(newAdmin);
        setGoverningBodiesAdmins((old: GoverningBodyAdmin[]) => [
          ...old,
          newAdmin,
        ]);
      }
      setGvbLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const onAdminTypeSelect = (adminType: string) => {
    if (adminType === "Крайовий Адмін") {
      setHideFields(true);
    } else {
      setHideFields(false);
    }
  };

  const checkRoleName = async () => {
    const roleValue = form.getFieldValue("governingBodyAdminRole");
    if (roleValue.trim().length !== 0) {
      checkRoleNameExists(roleValue).then((response) => {
        if (response.data) {
          form.setFields([
            {
              name: "governingBodyAdminRole",
              errors: ["Така роль адміністратора вже існує!"],
            },
          ]);
          setIsSubmitActive(false);
        }
        else{
          setIsSubmitActive(true);
        }
      });
    }
  };

  return (
    <div>
      <Form name="basic" onFinish={handleFinish} form={form}>
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
          <AutoComplete
            className={classes.inputField}
            options={[
              { value: Roles.GoverningBodyAdmin },
              { value: Roles.GoverningBodyHead },
              { value: "Голова КПР" },
              { value: "Секретар КПР" },
              { value: "Член КПР з питань організаційного розвитку" },
              { value: "Член КПР з соціального напрямку" },
              { value: "Член КПР відповідальний за зовнішні зв'язки" },
            ]}
            placeholder="Тип адміністрування"
            onChange={(value) => onAdminTypeSelect(value)}
          />
        </Form.Item>
        {!hideFields ? (
          <>
            <Form.Item
              label="Орган"
              labelCol={{ span: 24 }}
              name="governingBody"
              rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
              ]}
            >
              <Select
                id="governingBodySelect"
                showSearch
                loading={gvbLoading}
                onChange={(value) => onGvbSelect(value)}
              >
                {governingBodies?.map((o) => (
                  <Select.Option key={o.id} value={JSON.stringify(o)}>
                    {o.governingBodyName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Напрям"
              labelCol={{ span: 24 }}
              name="sector"
              rules={[
                {
                  message: emptyInput(),
                },
              ]}
            >
              <Select
                id="sectorSelect"
                showSearch
                allowClear
                loading={sectorsLoading}
                onChange={(value) => onSectorSelect(value)}
              >
                {sectors?.map((o) => (
                  <Select.Option key={o.id} value={JSON.stringify(o)}>
                    {o.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              className="adminTypeFormItem"
              name="governingBodyAdminRole"
              label="Роль адміністратора"
              labelCol={{ span: 24 }}
              rules={[
                {
                  pattern: /^\s*\S.*$/,
                  message: inputOnlyWhiteSpaces(),
                },
              ]}
            >
              <Input onChange={checkRoleName} />
            </Form.Item>
          </>
        )}

        <Form.Item
          className={classes.formField}
          label="Дата початку"
          name="startDate"
        >
          <DatePicker
            style={{ width: "100%" }}
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
        >
          <DatePicker
            className={classes.inputField}
            disabledDate={disabledEndDate}
            format="DD.MM.YYYY"
          />
        </Form.Item>

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
              <Button
                type="primary"
                htmlType="submit"
                disabled={!isSubmitActive}
              >
                Призначити
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangeUserRoleForm;
