import React, { useContext, useEffect, useRef, useState } from "react";
import { Form, Select, Button, DatePicker, Spin } from "antd";
import activeMembershipApi, {
  PlastDegree,
  UserPlastDegree,
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
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";

type FormAddPlastDegreeProps = {
  plastDegrees: Array<PlastDegree>;
  currentUserDegree?: UserPlastDegree;
  setVisibleModal: (visibleModal: boolean) => void;
  handleAddDegree: () => void;
  resetAvailablePlastDegree: () => Promise<void>;
  userId: string;
  cancel: boolean;
  isModalVisible: boolean;
};

const FormAddPlastDegree = (props: FormAddPlastDegreeProps) => {
  const [form] = Form.useForm();

  const [isDegreeSelectVisible, setDegreeSelectVisible] = useState(false);
  const [isCitySelectVisible, setCitySelectVisible] = useState(true);

  const [filtredDegrees, setFiltredDegrees] = useState<Array<PlastDegree>>([]);
  const [cities, setCities] = useState<CityProfile[]>([]);

  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [isFormReady, setFormReady] = useState(false);
  const { UpdateData } = useContext(PersonalDataContext);

  const handleFinish = async (info: any) => {
    setLoading(true);
    info.plastDegree = filtredDegrees.find((item) => item.name === "Пластприят")?.id ?? info.plastDegree;
    const degreeName = filtredDegrees.find((item) => item.id === info.plastDegree)?.name;

    const userPlastDegreePost: UserPlastDegreePost = {
      plastDegreeId: info.plastDegree,
      dateStart: info.datepickerStart._d,
      userId: props.userId,
    };

    const cityDefault = cities.find((x) => x.name == info.userCity)?.id;

    const newCityFollower: CityMember = (
      await addFollowerWithId(cityDefault as number, props.userId)
    ).data;
    await toggleMemberStatus(newCityFollower.id);
    await activeMembershipApi.postUserPlastDegree(userPlastDegreePost);
    props.handleAddDegree();
    form.resetFields();
    props.resetAvailablePlastDegree();
    setLoading(false);
    if (UpdateData) {
      await UpdateData();
    }
    await NotificationBoxApi.createNotifications(
      [props.userId],
      `Вам було надано ступінь ${degreeName} в `,
      NotificationBoxApi.NotificationTypes.UserNotifications,
      `/userpage/activeMembership/${props.userId}`,
      `Дійсному членстві`
    );
    notificationLogic("success", successfulAddDegree());
    props.setVisibleModal(false);
  };

  const handleOnChange = async (value: any) => {
    form.setFieldsValue({plastDegree : undefined});
    if (value === "Пластприят") {
      setDegreeSelectVisible(false);
      setFiltredDegrees(
        props.plastDegrees.filter((item) => item.name === "Пластприят")
      );
    } else if (value === "Улад Старшого Пластунства") {
      setDegreeSelectVisible(true);
      setFiltredDegrees(
        props.plastDegrees.filter((item) => item.name.includes("Старш"))
      );
    } else {
      setDegreeSelectVisible(true);
      setFiltredDegrees(
        props.plastDegrees.filter((item) => item.name.includes("сеніор"))
      );
    }
  };

  const disabledDate = (current: any) => {
    if (!props.currentUserDegree) return current > moment();

    let previousDegreeStart = moment(props.currentUserDegree.dateStart);
    return current && current > moment() || (current.isBefore(previousDegreeStart) || undefined);
  };

  const fetchData = async () => {
    const response = await getCities();
    setCities(response.data);
    const userInfo = await UserApi.getById(props.userId);
    if (userInfo.data.user.city) {
      setDisabled(true);
    }
    form.setFieldsValue({
      userCity: userInfo.data.user.city,
      plastUlad: props.currentUserDegree ? getDegreeCategory(props.currentUserDegree.plastDegree.name) : undefined,
      datepickerStart: props.currentUserDegree ? moment(props.currentUserDegree.dateStart) : undefined
    });
    if (sortDegrees(form.getFieldValue("plastUlad"))) {
      form.setFieldsValue({
        plastDegree: props.currentUserDegree ? props.currentUserDegree.plastDegree.name : undefined,
      })
      setDegreeSelectVisible(true);
    }
    setFormReady(true);
  };

  useEffect(() => {
    if (props.isModalVisible) {
      fetchData();
    }
    else {
      form.resetFields();
      setDegreeSelectVisible(false);
      setFormReady(false);
    }
  }, [props.isModalVisible]);

  const sortDegrees = (filter: string) => {
    switch (filter) {
      case "Улад Пластового Сеніорату":
        return props.plastDegrees.filter((item) => item.name.includes("сеніор"));
      case "Улад Старшого Пластунства":
        return props.plastDegrees.filter((item) => item.name.includes("Старш"));
      default:
        return;
    }
  }

  const getDegreeCategory = (degree: string | undefined) => {
    if (!degree) return;

    if (degree.includes("сеніор")) {
      return "Улад Пластового Сеніорату";
    }
    else if (degree.includes("Старш")) {
      return "Улад Старшого Пластунства";
    }
    else if (degree === "Пластприят") {
      return degree;
    }
    else return;
  }

  const isDegreeAvailable = (degree: string) => {
    if (!props.currentUserDegree) return true;
    return !(props.currentUserDegree?.plastDegree.name === degree);
  }

  return (
    isFormReady ?
    <Form
      name="basic"
      onFinish={handleFinish}
      form={form}
    >
      
      <Form.Item
        name="plastUlad"
        rules={[{ required: true, message: emptyInput() }]}
      >
        <Select
          onChange={(value) => handleOnChange(value)}
          placeholder="Оберіть Улад"
        >
          {(
            <Select.Option
              value="Пластприят"
              disabled={!isDegreeAvailable("Пластприят")}
            >
              Пластприят
            </Select.Option>
          )}
          {sortDegrees("Улад Старшого Пластунства") && (
            <Select.Option value="Улад Старшого Пластунства">
              Улад Старшого Пластунства
            </Select.Option>
          )}
          {sortDegrees("Улад Пластового Сеніорату") && (
            <Select.Option value="Улад Пластового Сеніорату">
              Улад Пластового Сеніорату
            </Select.Option>
          )}
        </Select>
      </Form.Item>
      {isDegreeSelectVisible && (
        <Form.Item
          name="plastDegree"
          rules={[{ required: isDegreeSelectVisible, message: emptyInput() }]}
        >
          <Select
            placeholder="Оберіть ступінь"
          >
            {sortDegrees(form.getFieldValue("plastUlad"))?.map((apd) => {
              return (
                <Select.Option key={apd.id} value={apd.id} disabled={!isDegreeAvailable(apd.name)}>
                  {apd.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      )}
      {isCitySelectVisible &&  (
        <Form.Item
          name="userCity"
          rules={[{ required: isCitySelectVisible, message: emptyInput() }]}
        >
          <Select placeholder="Оберіть станицю" disabled={disabled}>
            {cities.map((apd) => {
              return (
                <Select.Option key={apd.id} value={apd.name}>
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
          disabledDate={disabledDate}
          placeholder="Дата надання ступеню"
        />
      </Form.Item>
      <Form.Item>
        <Button className={classes.cardButton} type="primary" htmlType="submit" loading={loading}>
          Додати
        </Button>
      </Form.Item>
    </Form>
    : <LoadingOutlined style={{fontSize: 24}}/>
  );
};
export default FormAddPlastDegree;
