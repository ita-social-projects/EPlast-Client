import React, { useEffect, useState } from "react";
import {
  Form,
  DatePicker,
  Select,
  Input,
  Button,
  Radio,
  Row,
  Col,
  Divider,
  Tooltip,
} from "antd";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import eventUserApi from "../../../../api/eventUserApi";
import eventsApi from "../../../../api/eventsApi";
import notificationLogic from "../../../../components/Notifications/Notification";
import EventCategories from "../../../../models/EventCreate/EventCategories";
import Users from "../../../../models/EventCreate/Users";
import EventTypes from "../../../../models/EventCreate/EventTypes";
import NotificationBoxApi from "../../../../api/NotificationBoxApi";
import {
  successfulCreateAction,
  tryAgain,
  emptyInput,
  isNotChosen,
  maxNumber,
  minNumber,
  incorrectStartTime,
  incorrectEndTime,
  } from "../../../../components/Notifications/Messages";
import { descriptionValidation } from "../../../../models/GllobalValidations/DescriptionValidation";
import { EditOutlined } from "@ant-design/icons";
import { Roles } from "../../../../models/Roles/Roles";
import EventSections from "../../../../models/EventCreate/EventSections";
import ShortUserInfo from "../../../../models/UserTable/ShortUserInfo";
import ButtonCollapse from "../../../../components/ButtonCollapse/ButtonCollapse";
import { EventCategoriesEditDrawer } from "../EventCategoriesEdit/EventCategoriesEditDrawer";

import adminApi from "../../../../api/adminApi";

import classes from "./EventCreate.module.css";
import { EventCategoryCreateModal } from "./EventCategoryCreateModal";

interface Props {
  onCreate?: () => void;
  setIsVisibleEventCreateDrawer: (isVisible: boolean) => void;
  validationStartDate: Date;
  userAccesses: {[key: string]: boolean}
}

export default function ({
  onCreate,
  setIsVisibleEventCreateDrawer,
  validationStartDate,
  userAccesses
}: Props) {
  const [form] = Form.useForm();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const [loading, setLoading] = useState(false);
  const dateFormat = "DD.MM.YYYY HH:mm";
  const [categories, setCategories] = useState<EventCategories[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypes[]>([]);
  const [eventSections, setEventSections] = useState<EventSections[]>([]);
  const [administrators, setAdministrators] = useState<Users[]>([]);
  const [visibleEndDatePicker, setVisibleEndDatePicker] = useState<boolean>(true);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isVisibleEventCategoriesEditDrawer, setIsVisibleEventCategoriesEditDrawer] = useState<boolean>(false);
  const [StartDate, setStartDate] = useState<Date>();

  const [categoryName, setCategoryName] = useState<string>();
  const [newCategoryName, setNewCategoryName] = useState<string>();
  const [eventType, setEventType] = useState<string>();
  const [eventSection, setEventSection] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      await eventUserApi.getDataForNewEvent().then(async (response) => {
        const { users, eventTypes } = response.data;
        setEventTypes(eventTypes);
        setAdministrators(users);
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    resetUsers();
  }, selectedUsers);

  const handleFinish = async (values: any) => {
    setLoading(true);
    const newEvent = {
      event: {
        eventName: values.EventName,
        description: values.Description,
        questions: values.Questions,
        eventDateStart: moment(values.EventDateStart).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        eventDateEnd: moment(values.EventDateEnd).format("YYYY-MM-DD HH:mm:ss"),
        eventlocation: values.Eventlocation,
        eventTypeID: values.EventTypeID,
        eventCategoryID: values.EventCategoryID,
        eventStatusID: values.EventStatusID,
        formOfHolding: values.FormOfHolding,
        forWhom: values.ForWhom,
        numberOfPartisipants: values.NumberOfPartisipants,
      },
      сommandant: {
        userId: values.commandantId,
      },
      alternate: {
        userId: values.alternateId,
      },
      bunchuzhnyi: {
        userId: values.bunchuzhnyiId,
      },
      pysar: {
        userId: values.pysarId,
      },
    };
    await eventUserApi
      .post(newEvent)
      .then(async (response) => {
        notificationLogic(
          "success",
          successfulCreateAction("Подію", values.EventName)
        );

        NotificationBoxApi.createNotifications(
          [
            values.commandantId,
            values.alternateId,
            values.bunchuzhnyiId,
            values.pysarId,
          ],
          "Вам надано адміністративну роль в новій ",
          NotificationBoxApi.NotificationTypes.EventNotifications,
          `/events/details/${response.data.event.id}`,
          "Події"
        );
        
        const userIds = ((await adminApi.getUsersByAnyRole([[Roles.Admin, Roles.GoverningBodyAdmin, Roles.GoverningBodyHead]], true))
          .data as ShortUserInfo[]).map(user => user.id);
        
        NotificationBoxApi.createNotifications(
          userIds,
          `Нова подія "${values.EventName}" очікує вашого `,
          NotificationBoxApi.NotificationTypes.UserNotifications,
          `/events/details/${response.data.event.id}`,
          "підтвердження"
        );
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          notificationLogic("error", tryAgain);
        }
      });
    if (onCreate != undefined) {
      onCreate();
    }
    form.resetFields();
    setSelectedUsers(["", "", "", ""]);
    setLoading(false);
    setIsVisibleEventCreateDrawer(false);
  };

  const addCategory = async () => {
    const newCategory = {
      eventCategory: {
        eventCategoryName: newCategoryName,
        eventSectionId: eventSection,
      },
      eventTypeId: eventType,
    };
    eventsApi
      .createEventCategory(newCategory)
      .then((response) => {
        notificationLogic(
          "success",
          successfulCreateAction("Категорію", newCategoryName)
        );
        setVisibleModal(false);
        clearModal();
        getCategoriesByType(eventType);
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          notificationLogic("error", "Така категорія вже існує");
        }
        else {
          notificationLogic("error", "Щось пішло не так");
        }
      });
  };

  function showModal() {
    setVisibleModal(true);
  }

  function clearModal() {
    setCategoryName(undefined);
    setEventSection(undefined);
  }

  function disabledDate(current: any) {
    return current && (current < moment().startOf("day") || !current.isAfter("01.01.1900", "DD-MM-YYYY"));
  }

  function disabledEndDate(current: any) {
    return current && current < moment(StartDate)?.startOf("day");
  }

  function onEventDateStartChange(e: any) {
    if (moment(validationStartDate).diff(e, "minute") <= 1) {
      setStartDate(e);
      setVisibleEndDatePicker(false);
      form.resetFields(["EventDateEnd"]);
    } else {
      setVisibleEndDatePicker(true);
    }
  }

  function getCategoriesByType(eventType: any) {
    eventsApi.getCategories(eventType).then((response) => {
      setCategories(response.data);
      form.setFieldsValue({
        EventCategoryID: "",
      });
    });
  }

  function onChange(e: any) {
    setCategoryName("");
    setEventType(e.target.value);
    getCategoriesByType(e.target.value);
    eventsApi.getSections().then((response) => {
      const eventSections = response.data;
      setEventSections(eventSections);
    });
  }

  const handleSelectChange = (dropdownIndex: number, selectedId: string) => {
    const tempSelectedUsers: string[] = [...selectedUsers];
    tempSelectedUsers[dropdownIndex] = selectedId;

    setSelectedUsers([...tempSelectedUsers]);
  };

  function resetUsers(): void {
    const updatedUsers: any[] = administrators;

    updatedUsers.forEach((user) => {
      const userId = user.id;
      user.isSelected = selectedUsers.some(
        (selectedUserId) => selectedUserId === userId
      );
    });

    setAdministrators([...updatedUsers]);
  }

  const handleCancel = () => {
    form.resetFields();
    setIsVisibleEventCreateDrawer(false);
  };

  const handleClose = () => {
    setIsVisibleEventCreateDrawer(false);
  };

  return (
    <>
      <ButtonCollapse handleClose={handleClose} />
      <Form
        name="basic"
        form={form}
        onFinish={handleFinish}
        id="createForm"
        style={{ position: "relative" }}
      >
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Тип події"
              name="EventTypeID"
              rules={[{ required: true, message: isNotChosen("Тип події") }]}
              className={classes.radio}
            >
              <Radio.Group
                buttonStyle="solid"
                className={classes.eventTypeGroup}
                onChange={onChange}
                value={categories}
              >
                {eventTypes.map((item: any) => (
                  <Radio.Button key={item.id} value={item.id}>
                    {item.eventTypeName}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]} className={classes.minRowWidth}>
          <Col md={24} xs={24}>
            <Row>
              <Col span={22}>
                <Form.Item
                  name="EventCategoryID"
                  className={classes.formItem}
                  label="Категорія"
                  labelCol={{ span: 24 }}
                  rules={[descriptionValidation.Required]}
                >
                  <Select
                    className={classes.selectEventCategory}
                    notFoundContent="Спочатку оберіть тип події"
                    showSearch
                    optionFilterProp="children"
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        {userAccesses["CreateEventCategory"] ? (
                          <div>
                            <Divider style={{ margin: "4px 0" }} />
                            <EventCategoryCreateModal
                              isVisible={visibleModal}
                              setIsVisible={setVisibleModal}
                              newCategoryName={newCategoryName}
                              setNewCategoryName={setNewCategoryName}
                              eventSection={eventSection}
                              setEventSection={setEventSection}
                              eventSections={eventSections}
                              eventType={eventType}
                              addCategory={addCategory}
                            />
                          </div>
                        ) : (null)}
                      </>
                    )}
                  >
                    {categories.map((item: any) => (
                      <Select.Option
                        key={item.eventCategoryId}
                        value={item.EventCategoryId}
                      >
                        {item.eventCategoryName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}>
                <Tooltip
                  title="Редагувати категорії"
                  placement="left"
                  style={{paddingTop: 10}}
                >
                  <EditOutlined
                    style={{paddingTop: 35}}
                    className={
                      userAccesses["EditEventCategory"] || userAccesses["DeleteEventCategory"] ?
                      classes.editIcon : classes.disabledEditIcon
                    }
                    onClick={() => {
                      if (userAccesses["EditEventCategory"] || userAccesses["DeleteEventCategory"]) {
                        setIsVisibleEventCreateDrawer(false);
                        setIsVisibleEventCategoriesEditDrawer(true);
                      }
                    }}
                  />
                </Tooltip>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Назва події"
              name="EventName"
              className={classes.formItem}
              rules={descriptionValidation.Inputs}
            >
              <TextArea
                className={classes.input}
                autoSize={{ minRows: 2, maxRows: 3 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Комендант"
              name="commandantId"
              className={classes.formItem}
              rules={[{ required: true, message: emptyInput() }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={(e: any) => handleSelectChange(0, e)}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {administrators.map((item: any) => (
                  <Select.Option
                    disabled={item.isSelected}
                    key={item.id}
                    value={item.id}
                  >
                    {item.firstName} {item.lastName} <br /> {item.userName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Заступник коменданта"
              name="alternateId"
              className={classes.formItem}
              rules={[{ required: false, message: emptyInput() }]}
            >
              <Select
                allowClear
                showSearch
                optionFilterProp="children"
                onChange={(e: any) => handleSelectChange(1, e)}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {administrators.map((item: any) => (
                  <Select.Option
                    disabled={item.isSelected}
                    key={item.value}
                    value={item.id}
                  >
                    {item.firstName} {item.lastName} <br /> {item.userName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Бунчужний"
              name="bunchuzhnyiId"
              className={classes.formItem}
              rules={[{ required: true, message: emptyInput() }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={(e: any) => handleSelectChange(2, e)}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {administrators.map((item: any) => (
                  <Select.Option
                    disabled={item.isSelected}
                    key={item.value}
                    value={item.id}
                  >
                    {item.firstName} {item.lastName} <br /> {item.userName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Писар"
              name="pysarId"
              className={classes.formItem}
              rules={[{ required: true, message: emptyInput() }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={(e: any) => handleSelectChange(3, e)}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {administrators.map((item: any) => (
                  <Select.Option
                    disabled={item.isSelected}
                    key={item.value}
                    value={item.id}
                  >
                    {item.firstName} {item.lastName} <br /> {item.userName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Дата початку"
              name="EventDateStart"
              className={classes.formItem}
              rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
                {
                  validator: (_: object, value: Date) => {
                    return moment(validationStartDate).diff(value, "minute") > 1
                      ? Promise.reject(incorrectStartTime)
                      : Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                showTime
                disabledDate={disabledDate}
                placeholder="Оберіть дату початку"
                format={dateFormat}
                className={classes.select}
                onChange={onEventDateStartChange}
                getPopupContainer={() =>
                  document.getElementById("createForm")! as HTMLElement
                }
                popupStyle={{ position: "absolute" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Дата завершення"
              name="EventDateEnd"
              className={classes.formItem}
              rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
                {
                  validator: (_: object, value: Date) => {
                    return moment(value).diff(StartDate, "minute") < 1
                      ? Promise.reject(incorrectEndTime)
                      : Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker
                showTime
                disabled={visibleEndDatePicker}
                defaultPickerValue={moment(StartDate)}
                disabledDate={disabledEndDate}
                placeholder="Оберіть дату завершення"
                format={dateFormat}
                className={classes.select}
                getPopupContainer={() =>
                  document.getElementById("createForm")! as HTMLElement
                }
                popupStyle={{ position: "absolute" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Форма проведення"
              name="FormOfHolding"
              className={classes.formItem}
              rules={descriptionValidation.Inputs}
            >
              <TextArea
                className={classes.input}
                autoSize={{ minRows: 2, maxRows: 3 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Локація"
              name="Eventlocation"
              className={classes.formItem}
              rules={descriptionValidation.EventLocation}
            >
              <TextArea
                className={classes.input}
                autoSize={{ minRows: 2, maxRows: 3 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Призначена для"
              name="ForWhom"
              className={classes.formItem}
              rules={descriptionValidation.Inputs}
            >
              <TextArea
                className={classes.input}
                autoSize={{ minRows: 2, maxRows: 3 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Приблизна кількість учасників"
              name="NumberOfPartisipants"
              className={classes.formItem}
              rules={[
                {
                  required: true,
                  message: emptyInput(),
                },
                {
                  validator: (_: object, value: number) =>
                    value > 100
                      ? Promise.reject(maxNumber(100))
                      : Promise.resolve(),
                },
                {
                  validator: (_: object, value: number) =>
                    value < 2
                      ? Promise.reject(minNumber(2))
                      : Promise.resolve(),
                },
              ]}
            >
              <Input
                className={classes.input}
                type="number"
                onKeyDown={(e) =>
                  (e.keyCode === 69 ||
                    e.keyCode === 190 ||
                    e.keyCode === 187 ||
                    e.keyCode === 189) &&
                  e.preventDefault()
                }
                onKeyPress={(e) =>
                  (e.key === "." || e.key === ",") && e.preventDefault()
                }
                min="2"
                max="100"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Питання / побажання до булави"
              className={classes.formItem}
              name="Questions"
              rules={descriptionValidation.DescriptionAndQuestionsNotRequired}
            >
              <TextArea
                className={classes.input}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Опис події"
              name="Description"
              className={classes.formItem}
              rules={descriptionValidation.DescriptionAndQuestions}
            >
              <TextArea
                className={classes.input}
                autoSize={{ minRows: 3, maxRows: 5 }}
                maxLength={201}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item className={classes.formItem}>
              <Button
                type="primary"
                htmlType="submit"
                className={classes.button}
                loading={loading}
              >
                Зберегти подію
              </Button>
              <Button
                key="back"
                style={{ marginRight: "7px" }}
                onClick={handleCancel}
                className={classes.button}
                loading={loading}
              >
                Відмінити
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <EventCategoriesEditDrawer 
        isVisibleEventCategoriesEditDrawer={isVisibleEventCategoriesEditDrawer}
        setIsVisibleEventCategoriesEditDrawer={setIsVisibleEventCategoriesEditDrawer}
        setIsVisibleEventCreateDrawer={setIsVisibleEventCreateDrawer}
        categories={categories}
        setCategories={setCategories}
        userAccesses={userAccesses}
      />
    </>
  );
}
