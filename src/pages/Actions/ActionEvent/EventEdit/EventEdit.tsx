import { Form, DatePicker, Select, Input, Button, Radio, Row, Col } from "antd";
import React, { useEffect, useState } from "react";
import TextArea from "antd/lib/input/TextArea";
import eventUserApi from "../../../../api/eventUserApi";
import notificationLogic from "../../../../components/Notifications/Notification";
import moment from "moment";
import "moment/locale/uk";
import eventsApi from "../../../../api/eventsApi";
import EventCategories from "../../../../models/EventCreate/EventCategories";
import EventTypes from "../../../../models/EventCreate/EventTypes";
import Users from "../../../../models/EventCreate/Users";
import EventEdit from "../../../../models/EventEdit/EventEdit";
import ButtonCollapse from "../../../../components/ButtonCollapse/ButtonCollapse";
import { descriptionValidation } from "../../../../models/GllobalValidations/DescriptionValidation";
import NotificationBoxApi from "../../../../api/NotificationBoxApi";
import {
  successfulEditAction,
  tryAgain,
  emptyInput,
  isNotChosen,
  maxNumber,
  minNumber,
  incorrectStartTime,
  incorrectEndTime,
} from "../../../../components/Notifications/Messages";
moment.locale("uk-ua");

const classes = require("./EventEdit.module.css");

interface Props {
  id: number;
  statusId: number;
  onEdit: () => void;
  setShowEventEditDrawer: (visibleDrawer: boolean) => void;
}

export default function ({
  id,
  statusId,
  onEdit,
  setShowEventEditDrawer,
}: Props) {
  const [form] = Form.useForm();
  const [doneLoading, setDoneLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const dateFormat = "DD.MM.YYYY HH:mm";
  const [categories, setCategories] = useState<EventCategories[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypes[]>([]);
  const [administators, setAdministators] = useState<Users[]>([]);
  const [editedEvent, setEvent] = useState<EventEdit>();
  const [StartDate, setStartDate] = useState<Date>(new Date());
  const [disableStartDate, setDisableStartDate] = useState<boolean>();
  const [validationStartDate, setValidationStartDate] = useState<Date>(
    new Date()
  );

  useEffect(() => {
    fetchData();
    setValidationStartDate(new Date());
  }, []);

  useEffect(() => {
    if (id != undefined) {
      fetchEvent();
    }
  }, [id]);

  useEffect(() => {
    resetUsers();
  }, selectedUsers);

  const fetchData = async () => {
    await eventUserApi.getDataForNewEvent().then(async (response) => {
      const { users, eventTypes } = response.data;
      setEventTypes(eventTypes);
      setAdministators(users);
    });
  };

  const fetchEvent = async () => {
    await eventUserApi.getEditedEvent(id).then(async (response) => {
      const preselectedUsers = [
        response.data.сommandant?.userId,
        response.data.alternate?.userId,
        response.data.bunchuzhnyi?.userId,
        response.data.pysar?.userId,
      ];
      setSelectedUsers(preselectedUsers);
      setEvent(response.data);
      form.setFieldsValue({
        ID: response.data.event.id,
        EventName: response.data.event.eventName,
        Description: response.data.event.description,
        Questions: response.data.event.questions,
        EventTypeID: response.data.event.eventTypeID,
        EventCategoryID: response.data.event.eventCategoryID,
        EventDateStart: moment(response.data.event.eventDateStart),
        EventDateEnd: moment(response.data.event.eventDateEnd),
        FormOfHolding: response.data.event.formOfHolding,
        Eventlocation: response.data.event.eventlocation,
        ForWhom: response.data.event.forWhom,
        NumberOfPartisipants: response.data.event.numberOfPartisipants,
        commandantId: response.data.сommandant?.userId,
        alternateId: response.data.alternate?.userId,
        bunchuzhnyiId: response.data.bunchuzhnyi?.userId,
        pysarId: response.data.pysar?.userId,
      });
      setStartDate(form.getFieldValue("EventDateStart"));
      checkStartEvent(response.data.event.eventDateStart);
      await eventsApi
        .getCategories(response.data.event.eventTypeID)
        .then(async (response) => {
          setCategories([...response.data]);
        });
    });
  };

  const handleFinish = async (values: any) => {
    setDoneLoading(true);
    const newEvent = {
      event: {
        id: values.ID,
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
        eventStatusID: statusId,
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
      .put(newEvent)
      .then((response) => {
        notificationLogic(
          "success",
          successfulEditAction("Подію", values.EventName)
        );
        NotificationBoxApi.createNotifications(
          [
            values.commandantId,
            values.alternateId,
            values.bunchuzhnyiId,
            values.pysarId,
          ],
          "Подія, в якій ви є адміністратором, змінена: ",
          NotificationBoxApi.NotificationTypes.EventNotifications,
          `/events/details/${values.ID}`,
          values.EventName
        );
      })
      .catch((error) => {
        if (error.response.status === 400) {
          notificationLogic("error", tryAgain);
        }
      });
    setShowEventEditDrawer(false);
    setDoneLoading(false);
    onEdit();
  };

  function disabledDate(current: any) {
    return current && current < moment().startOf("day");
  }
  function checkStartEvent(value: Date) {
    setDisableStartDate(
      moment(value).diff(moment(), "minutes") < 1 ? true : false
    );
  }

  function onEventDateStartChange(e: any) {
    if (moment(validationStartDate).diff(e, "minute") < 1) {
      setStartDate(e);
    }
  }

  const onChange = async (e: any) => {
    await eventsApi.getCategories(e.target.value).then(async (response) => {
      setCategories([...response.data]);
      let arrWithSelectedItem = response.data.filter(
        (c: { eventCategoryId: any }) =>
          c.eventCategoryId == form.getFieldValue("EventCategoryID")
      );
      let arrWithDefaultItem = response.data.filter(
        (c: { eventCategoryId: any }) =>
          c.eventCategoryId == editedEvent?.event.eventCategoryID
      );
      if (arrWithSelectedItem.length == 0) {
        if (arrWithDefaultItem.length != 0) {
          form.setFieldsValue({
            EventCategoryID: editedEvent?.event.eventCategoryID,
          });
        } else {
          form.setFieldsValue({
            EventCategoryID: "",
          });
        }
      } else {
        form.setFieldsValue({
          EventCategoryID: form.getFieldValue("EventCategoryID"),
        });
      }
    });
  };

  const handleSelectChange = (dropdownIndex: number, selectedId: string) => {
    const tempSelectedUsers: string[] = [...selectedUsers];
    tempSelectedUsers[dropdownIndex] = selectedId;
    setSelectedUsers([...tempSelectedUsers]);
    updateIsSelectedStatus(tempSelectedUsers);
  };

  const updateIsSelectedStatus = (selectedUsers: string[]) => {
    const updatedUsers: any[] = administators;

    updatedUsers.forEach((user) => {
      const userId = user.id;
      user.isSelected = selectedUsers.some(
        (selectedUserId) => selectedUserId === userId
      );
    });

    setAdministators([...updatedUsers]);
  };

  function resetUsers(): void {
    const updatedUsers: any[] = administators;

    updatedUsers.forEach((user) => {
      const userId = user.id;
      user.isSelected = selectedUsers.some(
        (selectedUserId) => selectedUserId === userId
      );
    });
    setAdministators([...updatedUsers]);
  }

  const handleCancel = () => {
    fetchEvent();
    setShowEventEditDrawer(false);
  };

  const handleClose = () => {
    setShowEventEditDrawer(false);
  };

  return (
    <>
      <ButtonCollapse handleClose={handleClose} />
      <Form
        name="basic"
        form={form}
        onFinish={handleFinish}
        initialValues={editedEvent}
        id="editForm"
        style={{ position: "relative" }}
      >
        <Row justify="start" gutter={[0, 0]}>
          <Col md={0} xs={0}>
            <Form.Item name="ID">
              <Input type="hidden" />
            </Form.Item>
          </Col>
        </Row>
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
              >
                {eventTypes.map((item: any) => (
                  <Radio.Button
                    defaultChecked={true}
                    key={item.id}
                    value={item.id}
                  >
                    {" "}
                    {item.eventTypeName}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Категорія"
              name="EventCategoryID"
              className={classes.formItem}
              rules={[{ required: true, message: emptyInput() }]}
            >
              <Select
                notFoundContent="Спочатку оберіть тип події"
                showSearch
                optionFilterProp="children"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {categories?.map((item: any) => (
                  <Select.Option key={item.id} value={item.eventCategoryId}>
                    {" "}
                    {item.eventCategoryName}{" "}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row justify="start" gutter={[12, 0]}>
          <Col md={24} xs={24}>
            <Form.Item
              label="Назва події"
              labelCol={{ span: 24 }}
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
                onClick={() => {
                  updateIsSelectedStatus(selectedUsers);
                }}
              >
                {administators.map((item: any) => (
                  <Select.Option
                    disabled={item.isSelected}
                    key={item.value}
                    value={item.id}
                  >
                    {" "}
                    {item.firstName} {item.lastName} <br /> {item.userName}{" "}
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
                onClick={() => {
                  updateIsSelectedStatus(selectedUsers);
                }}
              >
                {administators.map((item: any) => (
                  <Select.Option
                    disabled={item.isSelected}
                    key={item.value}
                    value={item.id}
                  >
                    {" "}
                    {item.firstName} {item.lastName} <br /> {item.userName}{" "}
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
                onClick={() => {
                  updateIsSelectedStatus(selectedUsers);
                }}
              >
                {administators.map((item: any) => (
                  <Select.Option
                    disabled={item.isSelected}
                    key={item.value}
                    value={item.id}
                  >
                    {" "}
                    {item.firstName} {item.lastName} <br /> {item.userName}{" "}
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
                onClick={() => {
                  updateIsSelectedStatus(selectedUsers);
                }}
              >
                {administators.map((item: any) => (
                  <Select.Option
                    disabled={item.isSelected}
                    key={item.value}
                    value={item.id}
                  >
                    {" "}
                    {item.firstName} {item.lastName} <br /> {item.userName}{" "}
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
              style={{ position: "relative" }}
              className={classes.formItem}
              rules={
                disableStartDate
                  ? [
                      {
                        required: true,
                        message: emptyInput(),
                      },
                    ]
                  : [
                      {
                        required: true,
                        message: emptyInput(),
                      },
                      {
                        validator: (_: object, value: Date) => {
                          return moment(validationStartDate).diff(
                            value,
                            "minute"
                          ) > 1
                            ? Promise.reject(incorrectStartTime)
                            : Promise.resolve();
                        },
                      },
                    ]
              }
            >
              <DatePicker
                showTime
                disabledDate={disabledDate}
                onChange={onEventDateStartChange}
                disabled={disableStartDate}
                placeholder="Оберіть дату початку"
                format={dateFormat}
                className={classes.select}
                popupStyle={{ position: "absolute" }}
                getPopupContainer={() =>
                  document.getElementById("editForm")! as HTMLElement
                }
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
                disabledDate={disabledDate}
                placeholder="Оберіть дату завершення"
                format={dateFormat}
                className={classes.select}
                popupStyle={{ position: "absolute" }}
                getPopupContainer={() =>
                  document.getElementById("editForm")! as HTMLElement
                }
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
              labelCol={{ span: 24 }}
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
              name="Questions"
              className={classes.formItem}
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
                loading={doneLoading}
              >
                Зберегти подію
              </Button>
              <Button
                key="back"
                style={{ marginRight: "7px" }}
                onClick={handleCancel}
                className={classes.button}
                loading={doneLoading}
              >
                Відмінити
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
