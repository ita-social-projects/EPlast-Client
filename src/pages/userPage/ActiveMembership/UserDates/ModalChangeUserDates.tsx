import React, { useState } from "react";
import { Modal, Form, DatePicker, Button } from "antd";
import activeMembershipApi, {
  UserDates,
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
  const [EndDate, setEndDate] = useState<any>();

  const disabledEndDate = (current: any) => {
    return current && current <= StartDate;
  };

  const disabledStartDate = (current: any) => {
    if (EndDate === "" || EndDate === null) {
      return current && current > moment();
    } else {
      return current && current > EndDate;
    }
  };

  const SetDate = (date: any, prevDate: string): string => {
    if (date === undefined) {
      if (prevDate === "") return "0001-01-01T00:00:00";
      else return prevDate;
    } else if (date === null) {
      return "0001-01-01T00:00:00";
    } else {
      return moment(date._d).format();
    }
  };

  const handleFinish = async (info: any) => {
    const userDatesChange: UserDates = {
      userId: userId,
      dateEntry: dates.dateEntry,
      dateOath: SetDate(info.datepickerOath, dates.dateOath),
      dateEnd: SetDate(info.datepickerEnd, dates.dateEnd),
    };
    setDatesVisibleModal(false);
    await activeMembershipApi.postUserDates(userDatesChange);
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

        <label htmlFor="datepickerEnd" className={classes.formLabel}>
            Дата завершення
        </label>
        <Form.Item className={classes.formField} name="datepickerEnd">
          <DatePicker
            format="DD.MM.YYYY"
            disabledDate={disabledEndDate}
            onChange={(e) => setEndDate(e)}
            defaultValue={
              dates.dateEnd !== ""
                ? moment.utc(dates.dateEnd, "YYYY-MM-DD").local()
                : undefined
            }
            className={classes.selectField}
            placeholder="Дата завершення"
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
