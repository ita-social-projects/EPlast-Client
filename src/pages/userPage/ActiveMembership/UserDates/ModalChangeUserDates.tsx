import React, { useState } from "react";
import { Modal, Form, DatePicker, Button } from "antd";
import activeMembershipApi, {
  UserOathDate,
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

const ModalChangeUserDates = ({
  userId,
  dates,
  datesVisibleModal,
  setDatesVisibleModal,
  handleChangeDates,
}: props) => {
  const [form] = Form.useForm();
  const handleCancel = () => setDatesVisibleModal(false);

  const [StartDate, setStartDate] = useState<any>();

  const disabledStartDate = (current: any) => {
    if (dates.dateEntry === "" || dates.dateEntry === null) {
      return current && current < moment();
    } else {
      //Check if dateEnd is not null or empty
      if (dates.dateEnd) {
        return !(
          moment.utc(dates.dateEnd).local().subtract(1, "d").isAfter(current) &&
          moment.utc(dates.dateEntry).local().isSameOrBefore(current)
        );
      } else {
        return current && current < moment.utc(dates.dateEntry).local();
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
    const userOathDateChange: UserOathDate = {
      userId: userId,
      dateOath: SetDate(info.datepickerOath, dates.dateOath)
    };
    setDatesVisibleModal(false);
    await activeMembershipApi.postUserOathDate(userOathDateChange);
    handleChangeDates();
  };

  return (
    <Modal
      visible={datesVisibleModal}
      onCancel={handleCancel}
      title="Зміна даних користувача"
      footer={null}
    >
      <Form name="basic" onFinish={handleFinish} form={form}>
        <label htmlFor="datepickerOath" className={classes.formLabel}>
          Дата присяги
        </label>
        <Form.Item className={classes.formField} name="datepickerOath">
          <DatePicker
            format="DD.MM.YYYY"
            disabledDate={disabledStartDate}
            onChange={(e) => setStartDate(e)}
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
