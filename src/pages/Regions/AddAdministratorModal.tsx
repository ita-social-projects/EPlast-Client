import React, { useEffect, useState } from "react";
import { 
    Button, 
    Modal, 
    Form, 
    AutoComplete,
    Row,
    Col,
    DatePicker
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import{getCheckPlastMember} from "../../api/citiesApi";
import { emptyInput, inputOnlyWhiteSpaces } from "../../components/Notifications/Messages"
import { 
  getHead, 
  getHeadDeputy, 
  AddAdmin,
  EditAdmin,
  getRegionAdministration
} from "../../api/regionsApi";
import userApi from "../../api/UserApi";
import "./Region.less";
import AdminType from "../../models/Admin/AdminType";
import moment from "moment";
import "moment/locale/uk";
import notificationLogic from "../../components/Notifications/Notification";
import { Roles } from "../../models/Roles/Roles";
import RegionAdmin from "../../models/Region/RegionAdmin";
moment.locale("uk-ua");

const confirm = Modal.confirm;

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  admin: RegionAdmin;
  setAdmin: (admin: RegionAdmin) => void;
  regionId: number;
  regionName: string;
  onAdd?: (admin?: RegionAdmin) => void;
  onChange?: (id: string, userRoles: string) => void;
}

const AddAdministratorModal = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [form] = Form.useForm();
  const [head, setHead] = useState<any>();
  const [headDeputy, setHeadDeputy] = useState<any>();
  const [activeUserRoles, setActiveUserRoles] = useState<string[]>([]);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [admins, setAdmins] = useState<RegionAdmin[]>([]);

  const disabledEndDate = (current: any) => {
    return current && current < moment();
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const getRegionAdmins = async () => {
    setLoading(true);
    if (props.regionId !== 0) {
      const responseAdmins = await getRegionAdministration(props.regionId);
      setAdmins(responseAdmins.data.administration);
      setHead(responseAdmins.data.head);
      setHeadDeputy(responseAdmins.data.headDeputy);
      setLoading(false);
    }
  };

  function showEditConfirmModal(admin: RegionAdmin) {
    return Modal.confirm({
      title: "Ви впевнені, що хочете змінити роль даного користувача?",
      icon: <ExclamationCircleOutlined />,
      okText: "Так, Змінити",
      okType: "primary",
      cancelText: "Скасувати",
      maskClosable: true,
      onOk() {
         editRegionAdmin(admin);
      },
    });
  }

  const showDisableModal = async (admin: RegionAdmin) => {
    return Modal.warning({
      title: "Ви не можете змінити роль цьому користувачу",
      content: (
        <div style={{ margin: 15 }}>
          <b>
            {head?.user.firstName} {head?.user.lastName}
          </b>{" "}
          є Головою Округи, час правління закінчується{" "}
          <b>
            {moment.utc(head?.endDate).local().format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment.utc(head?.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onOk() {}
    });
  };

  const showConfirm = (newAdmin: RegionAdmin, existingAdmin: RegionAdmin) => {
    Modal.confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {existingAdmin.user.firstName} {existingAdmin.user.lastName}
          </b>{" "}
          вже має роль "{existingAdmin.adminType.adminTypeName}", час правління закінчується{" "}
          <b>
            {moment.utc(existingAdmin.endDate).local().format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment.utc(existingAdmin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),    
      onCancel() { },
      onOk() {
        if (newAdmin.id === 0) {
          addRegionAdmin(newAdmin);
        } else {
          editRegionAdmin(newAdmin);
        }
      }
    });
  };

  const showDisable = async (admin: RegionAdmin) => {
    return Modal.warning({
      title: "Ви не можете додати роль цьому користувачу",
      content: (
        <div style={{ margin: 15 }}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
            вже має таку роль, час правління закінчується{" "}
          <b>
            {moment.utc(admin.endDate).local().format("DD.MM.YYYY") === "Invalid date"
              ? "ще не скоро"
              : moment.utc(admin.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onOk() {}
    });
  };

  const showPlastMemberDisable = async (admin: RegionAdmin) => {
    return Modal.warning({
      title: "Ви не можете додати роль цьому користувачу",
      content: (
        <div style={{ margin: 15 }}>
          <b>
            {admin.user.firstName} {admin.user.lastName}
          </b>{" "}
            не є членом Пласту.
        </div>
      ),
      onOk() {}
    });
  };
  
  const addRegionAdmin = async (admin: RegionAdmin) => {
    
    await AddAdmin(admin);
    notificationLogic("success", "Користувач успішно доданий в провід");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };

  const editRegionAdmin = async (admin: RegionAdmin) => {
    await EditAdmin(admin);
    notificationLogic("success", "Адміністратор успішно відредагований");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };

  const getAdministration = async () => {
    setLoading(true);
    const responseHead = await getHead(props.regionId);
    const responseAdministration = await getRegionAdministration(props.regionId);
    const responseHeadDeputy = await getHeadDeputy(props.regionId);
    setAdmins(responseAdministration.data)
    setHead(responseHead.data);
    setHeadDeputy(responseHeadDeputy.data);
    setLoading(false);
  };

  const checkAdminId = async (admin: RegionAdmin)=> {
    if (admin.id === 0) {
      await addRegionAdmin(admin);
    } else {
      await editRegionAdmin(admin);
    }
  }

  const handleSubmit = async (values: any) => {
    setLoading(true);

    let admin: any = {
      id: props.admin.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: values.adminType,
      },
      regionId: props.regionId,
      user: props.admin.user,
      userId: props.admin.userId,
      endDate: values.endDate?._d,
      startDate: values.startDate?._d,
    };

    try {
      if(admin !== undefined){
          const admini = admin.adminType.adminTypeName[0].toUpperCase() + admin.adminType.adminTypeName.slice(1);
          admin.adminType.adminTypeName = admini
        }
      const existingAdmin  = (admins as RegionAdmin[])
        .find(x => x.adminType.adminTypeName === admin.adminType.adminTypeName)   
        if (head?.userId === admin.userId){
          showDisableModal(head)
        }
        else if(existingAdmin?.userId === admin.userId && existingAdmin?.endDate === admin.endDate){
          showDisable(admin)
        }
        else if(admin.adminType.adminTypeName === "Голова КПР" ||
          admin.adminType.adminTypeName === "Член КПР" ||
          admin.adminType.adminTypeName === Roles.KurinHead ||
          admin.adminType.adminTypeName === Roles.KurinHeadDeputy){
          const check = await getCheckPlastMember(admin.userId);
          if(check.data){
            await addRegionAdmin(admin);
          }
          else {
            showPlastMemberDisable(admin);
          }
        }
        else if(existingAdmin !== undefined) {
          showConfirm(admin, existingAdmin);
        }
        else {
          await checkAdminId(admin);
        }
    }
    finally {
      props.setVisibleModal(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    props.setVisibleModal(false);
  };

  useEffect(() => {
    if (props.visibleModal) {
      form.resetFields();
      setLoadingButton(false);
    }
    getAdministration();
    const userRoles = userApi.getActiveUserRoles();
      setActiveUserRoles(userRoles);
  }, [props]);

  return (
    <Modal
      title={
        props.admin.id === 0
          ? `Додати в провід округи ${props.regionName}`
          : "Редагування проводу"
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
          rules={[
            { 
              required: true, 
              message: emptyInput() 
            },
            {
              pattern: /^\s*\S.*$/,
              message: inputOnlyWhiteSpaces()
            },
          ]}
        >
          <AutoComplete
            className="adminTypeSelect"
            options={[
              { value: Roles.OkrugaHead, disabled: (activeUserRoles.includes(Roles.OkrugaHeadDeputy) 
              && !activeUserRoles.includes(Roles.Admin)) },
              { value: Roles.OkrugaHeadDeputy },
              { value: "Голова СПС" },
              { value: "Фотограф" },
              { value: "Писар" },
              { value: "Скарбник" },
              { value: "Домівкар" },
              { value: "Член СПР" },
            ]}
            placeholder={"Тип адміністрування"}
            value={props.admin.adminType.adminTypeName}
          />
        </Form.Item>
        <Row>
          <Col span={11}>
            <Form.Item
              name="startDate"
              label="Час початку"
              labelCol={{ span: 24 }}
              initialValue={
                props.admin.startDate
                  ? moment.utc(props.admin.startDate).local()
                  : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledStartDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.startDate
                    ? moment.utc(props.admin.startDate).local()
                    : undefined
                }
                onChange={(e) => setStartDate(e)}
              />
            </Form.Item>
          </Col>
          <Col span={11} offset={2}>
            <Form.Item
              name="endDate"
              label="Час кінця"
              labelCol={{ span: 24 }}
              initialValue={
                props.admin.endDate ? moment.utc(props.admin.endDate).local() : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledEndDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.endDate ? moment.utc(props.admin.endDate).local() : undefined
                }
                onChange={(e) => setEndDate(e)}
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
              <Button type="primary" loading = {loadingButton} onClick = {() => {setLoadingButton(true); handleSubmit(form.getFieldsValue());}}>
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
