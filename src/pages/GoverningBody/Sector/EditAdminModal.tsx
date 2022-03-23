import React, { useEffect, useState } from "react";
import "../AddAdministratorModal/AddAdministrationModal.less";
import {
  AutoComplete,
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
} from "antd";
import AdminType from "../../../models/Admin/AdminType";
import {
  addAdministrator,
  editAdministrator,
  getAllAdmins,
} from "../../../api/governingBodySectorsApi";
import notificationLogic from "../../../components/Notifications/Notification";
import moment from "moment";
import { emptyInput } from "../../../components/Notifications/Messages";
import { Roles } from "../../../models/Roles/Roles";
import { descriptionValidation } from "../../../models/GllobalValidations/DescriptionValidation";
import SectorAdmin from "../../../models/GoverningBody/Sector/SectorAdmin";

const confirm = Modal.confirm;

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  admin: SectorAdmin;
  setAdmin: (admin: SectorAdmin) => void;
  sectorId: number;
  onAdd?: (admin?: SectorAdmin) => void;
  onChange?: (id: string, userRoles: string) => void;
}

const EditAdministratorModal = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>();
  const [form] = Form.useForm();
  const [head, setHead] = useState<SectorAdmin>();

  const getSectorHead = async () => {
    if (props.sectorId !== 0) {
      await getAllAdmins(props.sectorId).then((response) => {
        setHead(response.data.head);
      });
      setLoading(false);
    }
  };

  const disabledEndDate = (current: any) => {
    return current && current < startDate;
  };

  const disabledStartDate = (current: any) => {
    return current && current > moment();
  };

  const showConfirm = (admin: SectorAdmin) => {
    confirm({
      title: "Призначити даного користувача на цю посаду?",
      content: (
        <div style={{ margin: 10 }}>
          <b>
            {head?.user.firstName} {head?.user.lastName}
          </b>{" "}
          є Головою Напряму Керівного Органу, час правління закінчується{" "}
          <b>
            {moment.utc(head?.endDate).local().format("DD.MM.YYYY") ===
            "Invalid date"
              ? "ще не скоро"
              : moment.utc(head?.endDate).local().format("DD.MM.YYYY")}
          </b>
          .
        </div>
      ),
      onCancel() {},
      onOk() {
        if (admin.id === 0) {
          addSectorAdmin(admin);
        } else {
          editSectorAdmin(admin);
        }
      },
    });
  };

  const addSectorAdmin = async (admin: SectorAdmin) => {
    admin = (await addAdministrator(props.admin.sectorId, admin)).data;
    notificationLogic("success", "Користувач успішно доданий в провід");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };

  const editSectorAdmin = async (admin: SectorAdmin) => {
    admin = (await editAdministrator(props.admin.sectorId, admin)).data;
    notificationLogic("success", "Адміністратор успішно відредагований");
    props.onChange?.(props.admin.userId, admin.adminType.adminTypeName);
    props.onAdd?.(admin);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    let admin: SectorAdmin = {
      id: props.admin.id,
      adminType: {
        ...new AdminType(),
        adminTypeName: values.adminType,
      },
      sectorId: props.sectorId,
      user: props.admin.user,
      userId: props.admin.userId,
      endDate: values.endDate?._d,
      startDate: values.startDate?._d,
      workEmail: values.workEmail,
    };

    try {
      if (values.adminType === Roles.GoverningBodySectorHead && head !== null) {
        if (head?.userId !== admin.userId) {
          showConfirm(admin);
        } else {
          await editSectorAdmin(admin);
        }
      } else {
        if (admin.id === 0) {
          await addSectorAdmin(admin);
        } else {
          await editSectorAdmin(admin);
        }
      }
    } finally {
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
    }
  }, [props]);

  useEffect(() => {
    getSectorHead();
  }, []);

  return (
    <Modal
      title={
        props.admin.id === 0 ? "Додати в провід напряму" : "Редагування проводу"
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
          rules={[{ required: true, message: emptyInput() }]}
        >
          <AutoComplete
            className="adminTypeSelect"
            options={[
              { value: Roles.GoverningBodySectorHead },
              { value: "Голова КПР" },
              { value: "Секретар КПР" },
              { value: "Член КПР з питань організаційного розвитку" },
              { value: "Член КПР з соціального напрямку" },
              { value: "Член КПР відповідальний за зовнішні зв'язки" },
            ]}
            placeholder={"Тип адміністрування"}
          />
        </Form.Item>

        <Form.Item
          label="Електронна пошта"
          name="workEmail"
          initialValue={props.admin.workEmail}
          rules={descriptionValidation.RegionEmail}
        >
          <Input placeholder="Електронна пошта" />
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
                props.admin.endDate
                  ? moment.utc(props.admin.endDate).local()
                  : undefined
              }
            >
              <DatePicker
                className="formSelect"
                disabledDate={disabledEndDate}
                format="DD.MM.YYYY"
                value={
                  props.admin.endDate
                    ? moment.utc(props.admin.endDate).local()
                    : undefined
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
              <Button type="primary" htmlType="submit">
                Опублікувати
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAdministratorModal;
