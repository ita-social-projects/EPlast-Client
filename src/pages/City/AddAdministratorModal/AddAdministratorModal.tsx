import React, { useState } from "react";
import { AutoComplete, Col, DatePicker, Form, Input, Modal, Row, Select } from "antd";
import classes from "./AddAdministrationModal.module.css";
import CityAdmin from "./../../../models/City/CityAdmin";
import AdminType from './../../../models/Admin/AdminType';
import { addAdministrator, editAdministrator } from "../../../api/citiesApi";
import moment from "moment";
import "moment/locale/uk";
moment.locale("uk-ua");

interface Props {
  visibleModal: boolean;
  setVisibleModal: (visibleModal: boolean) => void;
  admin: CityAdmin;
  setAdmin: (admin: CityAdmin) => void;
}

const AddAdministratorModal = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<any>();
 
  const handleChange = (date: any, key: string) => {
    if (key.indexOf("startDate") !== -1) {
      setDate(date);
    }

    props.setAdmin({
      ...props.admin,
      [key]: date?._d,
    });
  }

  const handleChangeType = (adminTypeName: string) => {
    props.setAdmin({
      ...props.admin,
      adminType: { ...new AdminType(), adminTypeName: adminTypeName },
    });
  };

  const disabledEndDate = (current: any) => {
    return current && current < date;
  }

  const dateFormat = "DD.MM.YYYY";

  const handleOk = async () => {
    setLoading(true);

    try {
      if (props.admin.id === 0) {
        await addAdministrator(props.admin.cityId, props.admin);
      } else {
        await editAdministrator(props.admin.cityId, props.admin);
      }
    } finally {
      props.setVisibleModal(false);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    props.setVisibleModal(false);
  };

  return (
    <Modal
      title={
        props.admin.id === 0
          ? "Додати в провід станиці"
          : "Редагувати адміністратора"
      }
      visible={props.visibleModal}
      confirmLoading={loading}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form>
        <AutoComplete
          value={props.admin.adminType.adminTypeName}
          style={{ width: "100%", marginBottom: "10px" }}
          options={[
            { value: "Голова Станиці" },
            { value: "Голова СПС"},
            { value: "Писар" },
            { value: "Скарбник" },
            { value: "Домівкар"},
            { value: "Член СПР"},
          ]}
          filterOption={(inputValue, option) =>
            option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
          onChange={handleChangeType}
          placeholder={"Тип адміністрування"}
        ></AutoComplete>
        <Row>
          <Col span={11}>
            <DatePicker
              placeholder="Початок адміністрування"
              format={dateFormat}
              className={classes.select}
              onChange={(event) => handleChange(event, "startDate")}
              value={
                props.admin.startDate
                  ? moment(props.admin.startDate)
                  : undefined
              }
            />
          </Col>
          <Col span={11} offset={2}>
            <DatePicker
              disabledDate={disabledEndDate}
              placeholder="Кінець адміністрування"
              format={dateFormat}
              className={classes.select}
              onChange={(event) => handleChange(event, "endDate")}
              value={
                props.admin.endDate ? moment(props.admin.endDate) : undefined
              }
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddAdministratorModal;
