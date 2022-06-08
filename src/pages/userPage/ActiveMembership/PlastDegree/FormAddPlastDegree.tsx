import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Select, Button, DatePicker } from "antd";
import activeMembershipApi, {
  PlastDegree,
  UserPlastDegreePost,
} from "../../../../api/activeMembershipApi";
import classes from "./FormAddPlastDegree.module.css";
import NotificationBoxApi from "../../../../api/NotificationBoxApi";
import {
  emptyInput,
  successfulAddDegree,
} from "../../../../components/Notifications/Messages";
import notificationLogic from "../../../../components/Notifications/Notification";
import CityProfile from "../../../../models/City/CityProfile";
import {
  addFollowerWithId,
  getCities,
  toggleMemberStatus,
} from "../../../../api/citiesApi";
import CityMember from "../../../../models/City/CityMember";
import { PersonalDataContext } from "../../personalData/PersonalData";
import UserApi from "../../../../api/UserApi";

type FormAddPlastDegreeProps = {
  availablePlastDegree: Array<PlastDegree>;
  setVisibleModal: (visibleModal: boolean) => void;
  handleAddDegree: () => void;
  resetAvailablePlastDegree: () => Promise<void>;
  userId: string;
  isCityAdmin?: boolean;
  cancel: boolean;
};

const FormAddPlastDegree = ({
  setVisibleModal,
  userId,
  availablePlastDegree,
  handleAddDegree,
  isCityAdmin,
  resetAvailablePlastDegree,
  cancel,
}: FormAddPlastDegreeProps) => {
  const [form] = Form.useForm();
  const visiableDegree = useRef<boolean>(false);
  const visiableCities = useRef<boolean>(false);
  const [filtredDegrees, setFiltredDegrees] = useState<Array<PlastDegree>>([]);
  const [cities, setCities] = useState<CityProfile[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const { UpdateData } = useContext(PersonalDataContext);

  const handleFinish = async (info: any) => {
    console.log(info);
    const plastDegreeId = filtredDegrees.find(
      (item) => item.name === "Пластприят"
    )?.id;
    info.plastDegree = plastDegreeId ? plastDegreeId : info.plastDegree;
    const userPlastDegreePost: UserPlastDegreePost = {
      plastDegreeId: info.plastDegree,
      dateStart: info.datepickerStart._d,
      userId: userId,
    };
    setVisibleModal(false);
    visiableDegree.current = false;
    visiableCities.current = false;

    const cityDefault = cities.find((x) => x.name == info.userCity)?.id;
    console.log(cityDefault);

    const newCityFollower: CityMember = (
      await addFollowerWithId(cityDefault as number, userId)
    ).data;
    await toggleMemberStatus(newCityFollower.id);
    await activeMembershipApi.postUserPlastDegree(userPlastDegreePost);
    handleAddDegree();
    form.resetFields();
    resetAvailablePlastDegree();
    if (UpdateData) {
      await UpdateData();
    }
    await NotificationBoxApi.createNotifications(
      [userId],
      `Вам було надано новий ступінь в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/userpage/activeMembership/${userId}`,
      `Дійсному членстві`
    );
    notificationLogic("success", successfulAddDegree());
  };

  const handleOnChange = async (value: any) => {
    if (value === "Пластприят") {
      visiableCities.current = true;
      visiableDegree.current = false;
      setFiltredDegrees(
        availablePlastDegree.filter((item) => item.name === "Пластприят")
      );
    } else if (value === "Улад Старшого Пластунства") {
      visiableDegree.current = true;
      visiableCities.current = true;
      setFiltredDegrees(
        availablePlastDegree.filter((item) => item.name.includes("Старш"))
      );
    } else {
      visiableDegree.current = true;
      visiableCities.current = true;
      setFiltredDegrees(
        availablePlastDegree.filter((item) => item.name.includes("сеніор"))
      );
    }
  };

  const fetchData = async () => {
    const response = await getCities();
    setCities(response.data);
    const userInfo = await UserApi.getById(userId);
    if (userInfo.data.user.city) {
      setDisabled(true);
    }
    form.setFieldsValue({
      userCity: userInfo.data.user.city,
    });
  };

  useEffect(() => {
    fetchData();
    if (cancel) {
      form.resetFields();
      visiableDegree.current = false;
      visiableCities.current = false;
    }
  }, [cancel]);

  return (
    <Form name="basic" onFinish={handleFinish} form={form}>
      <Form.Item
        name="plastUlad"
        rules={[{ required: true, message: emptyInput() }]}
      >
        <Select
          onChange={(value) => handleOnChange(value)}
          placeholder="Оберіть Улад"
        >
          {availablePlastDegree.find((item) => item.name === "Пластприят") && (
            <Select.Option value="Пластприят">Пластприят</Select.Option>
          )}
          {availablePlastDegree.find((item) => item.name.includes("Старш")) && (
            <Select.Option value="Улад Старшого Пластунства">
              Улад Старшого Пластунства
            </Select.Option>
          )}
          {availablePlastDegree.filter((item) =>
            item.name.includes("сеніор")
          ) && (
            <Select.Option value="Улад Пластового Сеніорату">
              Улад Пластового Сеніорату
            </Select.Option>
          )}
        </Select>
      </Form.Item>
      {visiableDegree.current && (
        <Form.Item
          name="plastDegree"
          rules={[{ required: visiableDegree.current, message: emptyInput() }]}
        >
          <Select placeholder="Оберіть ступінь">
            {filtredDegrees.map((apd) => {
              return (
                <Select.Option key={apd.id} value={apd.id}>
                  {apd.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      )}
      {visiableCities.current && (
        <Form.Item
          name="userCity"
          rules={[{ required: visiableCities.current, message: emptyInput() }]}
        >
          <Select placeholder="Оберіть станицю" disabled={disabled}>
            {cities.map((apd) => {
              return (
                <Select.Option key={apd.id} value={apd.id}>
                  {apd.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      )}

      <Form.Item
        name="datepickerStart"
        rules={[{ required: true, message: emptyInput() }]}
      >
        <DatePicker
          format="DD.MM.YYYY"
          className={classes.selectField}
          placeholder="Дата надання ступеню"
        />
      </Form.Item>
      <Form.Item>
        <Button className={classes.cardButton} type="primary" htmlType="submit">
          Додати
        </Button>
      </Form.Item>
    </Form>
  );
};
export default FormAddPlastDegree;
