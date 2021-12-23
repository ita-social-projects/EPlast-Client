import React, { useEffect, useState } from "react";
import { Modal, Form, DatePicker, Button } from "antd";
import activeMembershipApi, {
  UserEntryAndOathDates,
} from "../../../../api/activeMembershipApi";
import classes from "./ModalChangeUserDates.module.css";
import moment from "moment";
moment.locale("uk-ua");

type props = {
  userId: string;
  dates: any;
  datesVisibleModal: boolean;
  setDatesVisibleModal: (visibleModal: boolean) => void;
  handleChangeDates: () => void;
};

const defaultDate = "0001-01-01T00:00:00";
const minAvailableDate = "01.01.1900";

const ModalChangeUserDates = ({
  userId,
  dates,
  datesVisibleModal,
  setDatesVisibleModal,
  handleChangeDates,
}: props) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    setDatesVisibleModal(false);
  }

  const [OathDate, setOathDate] = useState<any>();
  const [EntryDate, setEntryDate] = useState<any>();

  useEffect(() => {
    setDates();
  }, [])

  const setDates = () => {
    setEntryDate(dates.dateEntry);
    setOathDate(dates.dateOath);
  }

  const disabledEntryDate = (current: any) => {
    return current < moment(minAvailableDate) || current > OathDate;
  };

  const disabledOathDate = (current: any) => {
    if (dates.dateEntry === "" || dates.dateEntry === null) {
      return current && current < moment();
    } else {
      //Check if dateEnd is not null or empty
      if (dates.dateEnd) {
        return current > moment(dates.dateEnd) || current < moment.utc(dates.dateEntry).local();
      } else {
        return current > moment() || current < moment.utc(EntryDate).local();
      }
    }
  };

  const SetDate = (date: any, prevDate: string): string => {
    if (date === undefined) {
      if (prevDate === "") return defaultDate;
      else return prevDate;
    } else if (date === null) {
      return defaultDate;
    } else {
      return moment(date._d).format();
    }
  };

  const handleFinish = async (info: any) => {
    const userEntryAndOathDatesChange: UserEntryAndOathDates = {
      userId: userId,
      dateEntry: SetDate(info.datepickerEntry, dates.dateEntry),
      dateOath: SetDate(info.datepickerOath, dates.dateOath)
    };
    setDatesVisibleModal(false);
    await activeMembershipApi.postUserEntryAndOathDates(userEntryAndOathDatesChange);
    handleChangeDates();
  };

  return (
    <Modal
      visible={datesVisibleModal}
      onCancel={handleCancel}
      destroyOnClose = {true}
      title="Зміна даних користувача"
      footer={null}
    >
      <Form name="basic" onFinish={handleFinish} form={form}>
        <label htmlFor="datepickerEntry" className={classes.formLabel}>
          Дата вступу
        </label>
        <Form.Item className={classes.formField} name="datepickerEntry">
          <DatePicker
            format="DD.MM.YYYY"
            disabledDate={disabledEntryDate}
            onChange={(e) => setEntryDate(e)}
            defaultValue={
              dates.dateEntry !== ""
                ? moment.utc(dates.dateEntry, "YYYY-MM-DD").local()
                : undefined
            }
            className={classes.selectField}
            placeholder="Дата вступу"
          />
        </Form.Item>
        <label htmlFor="datepickerOath" className={classes.formLabel}>
          Дата присяги
        </label>
        <Form.Item className={classes.formField} name="datepickerOath">
          <DatePicker
            format="DD.MM.YYYY"
            disabledDate={disabledOathDate}
            onChange={(e) => setOathDate(e)}
            defaultValue={
              dates.dateOath !== ""
                ? moment.utc(dates.dateOath, "YYYY-MM-DD").local()
                : undefined
            }
            className={classes.selectField}
            placeholder="Дата присяги"
          />
        </Form.Item>
        <Form.Item>
          <Button
            className={classes.cardButton}
            type="primary"
            htmlType="submit"
          >
            Змінити
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalChangeUserDates;
