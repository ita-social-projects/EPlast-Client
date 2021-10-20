import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Select, Input, Button, Radio, Row, Col } from 'antd';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import eventUserApi from '../../../../api/eventUserApi';
import eventsApi from "../../../../api/eventsApi";
import notificationLogic from '../../../../components/Notifications/Notification';
import EventCategories from '../../../../models/EventCreate/EventCategories';
import Users from '../../../../models/EventCreate/Users';
import EventTypes from '../../../../models/EventCreate/EventTypes';
import NotificationBoxApi from '../../../../api/NotificationBoxApi';
import {
  successfulCreateAction,
  tryAgain,
  emptyInput,
  isNotChosen,
  maxNumber,
  minNumber,
  incorrectStartTime,
  incorrectEndTime
} from "../../../../components/Notifications/Messages"
import { descriptionValidation } from '../../../../models/GllobalValidations/DescriptionValidation';

const classes = require('./EventCreate.module.css');

interface Props {
  onCreate?: () => void;
  setShowEventCreateDrawer: (visibleEventCreateDrawer: boolean) => void;
}

export default function ({ onCreate, setShowEventCreateDrawer }: Props) {

  const [form] = Form.useForm();
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const dateFormat = 'DD.MM.YYYY HH:mm';
  const [categories, setCategories] = useState<EventCategories[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypes[]>([]);
  const [administators, setAdministators] = useState<Users[]>([]);
  const [visibleEndDatePicker, setVisibleEndDatePicker] = useState<boolean>(true);


  const [StartDate, setStartDate] = useState<Date>();

  useEffect(() => {
    const fetchData = async () => {
      await eventUserApi.getDataForNewEvent().then(async response => {
        const { users, eventTypes } = response.data;
        setEventTypes(eventTypes);
        setAdministators(users);
      })
    }
    fetchData();
  }, []);

  useEffect(() => {
    resetUsers()
  }, selectedUsers);

  const handleFinish = async (values: any) => {
    setLoading(true);
    const newEvent = {
      event: {
        eventName: values.EventName,
        description: values.Description,
        questions: values.Questions,
        eventDateStart: moment.utc(values.EventDateStart).local(),
        eventDateEnd: moment.utc(values.EventDateEnd).local(),
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
      }
    }
    await eventUserApi.post(newEvent).then(response => {
      notificationLogic('success', successfulCreateAction('Подію', values.EventName));

      NotificationBoxApi.createNotifications(
        [values.commandantId, values.alternateId, values.bunchuzhnyiId, values.pysarId],
        "Вам надано адміністративну роль в новій ",
        NotificationBoxApi.NotificationTypes.EventNotifications,
        `/events/details/${response.data.event.id}`,
        "події"
      );
    }).catch(error => {
      if (error.response?.status === 400) {
        notificationLogic('error', tryAgain);
      }
    });
    if (onCreate != undefined) {
      onCreate();
    }
    form.resetFields();
    setLoading(false);
    setShowEventCreateDrawer(false);
  }

  function disabledDate(current: any) {
    return current && current < moment().startOf('day');
  }

  function disabledEndDate(current: any) {
    return current && current < moment(StartDate)?.startOf('day');
  }

  function onEventDateStartChange(e: any) {
    if (e > moment()) {
      setStartDate(e)
      setVisibleEndDatePicker(false)
      form.resetFields(['EventDateEnd'])
    }
  }

  function onChange(e: any) {
    eventsApi.getCategories(e.target.value).then(async response => {
      setCategories(response.data);
      form.setFieldsValue({
        EventCategoryID: '',
      });
    })
  };

  const handleSelectChange = (dropdownIndex: number, selectedId: string) => {
    const tempSelectedUsers: string[] = [...selectedUsers];
    tempSelectedUsers[dropdownIndex] = selectedId;

    setSelectedUsers([...tempSelectedUsers]);
  }

  function resetUsers(): void {
    const updatedUsers: any[] = administators;

    updatedUsers.forEach(user => {
      const userId = user.id;
      user.isSelected = selectedUsers.some(selectedUserId => selectedUserId === userId);
    });

    setAdministators([...updatedUsers]);
  }
  const handleCancel = () => {
    form.resetFields();
    setShowEventCreateDrawer(false);
  };
  return (
    <Form name="basic" form={form} onFinish={handleFinish} id='area' style={{ position: 'relative' }}>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Тип події" name="EventTypeID" rules={[{ required: true, message: isNotChosen("Тип події") }]} className={classes.radio}>
            <Radio.Group buttonStyle="solid" className={classes.eventTypeGroup} onChange={onChange} value={categories}>
              {eventTypes.map((item: any) => (<Radio.Button key={item.id} value={item.id}> {item.eventTypeName}</Radio.Button>))}
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item name="EventCategoryID" className={classes.formItem} label="Категорія" rules={[{ required: true, message: emptyInput() }]}>
            <Select notFoundContent="Спочатку оберіть тип події" showSearch optionFilterProp="children" getPopupContainer={(triggerNode) => triggerNode.parentNode}>
              {categories.map((item: any) => (<Select.Option key={item.eventCategoryId} value={item.eventCategoryId}> {item.eventCategoryName} </Select.Option>))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Назва події" name="EventName" className={classes.formItem} rules={descriptionValidation.Inputs}>
            <TextArea className={classes.input} autoSize={{ minRows: 2, maxRows: 3 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Комендант" name="commandantId" className={classes.formItem} rules={[{ required: true, message: emptyInput() }]}>
            <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(0, e)} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
              {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.id} value={item.id}> {item.firstName} {item.lastName} <br /> {item.userName}</Select.Option>))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Заступник коменданта" name="alternateId" className={classes.formItem} rules={[{ required: true, message: emptyInput() }]}>
            <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(1, e)} getPopupContainer={(triggerNode) => triggerNode.parentNode} >
              {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id}> {item.firstName} {item.lastName} <br /> {item.userName}</Select.Option>))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Бунчужний" name="bunchuzhnyiId" className={classes.formItem} rules={[{ required: true, message: emptyInput() }]}>
            <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(2, e)} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
              {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id}> {item.firstName} {item.lastName} <br /> {item.userName}</Select.Option>))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Писар" name="pysarId" className={classes.formItem} rules={[{ required: true, message: emptyInput() }]}>
            <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(3, e)} getPopupContainer={(triggerNode) => triggerNode.parentNode}>
              {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id}> {item.firstName} {item.lastName} <br /> {item.userName}</Select.Option>))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Дата початку" name="EventDateStart" className={classes.formItem}
            rules={[
              {
                required: true,
                message: emptyInput()
              },
              {
                validator: (_: object, value: Date) => {
                  return (value < new Date()
                    ? Promise.reject(incorrectStartTime)
                    : Promise.resolve())
                }
              }]}>
            <DatePicker
              showTime
              disabledDate={disabledDate}
              placeholder="Оберіть дату початку"
              format={dateFormat}
              className={classes.select}
              onChange={onEventDateStartChange}
              getPopupContainer={() => document.getElementById('area')! as HTMLElement}
              popupStyle={{ position: 'absolute' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Дата завершення" name="EventDateEnd" className={classes.formItem}
            rules={[
              {
                required: true,
                message: emptyInput()
              },
              {
                validator: (_: object, value: Date) => {
                  return (
                    value < StartDate!
                      ? Promise.reject(incorrectEndTime)
                      : Promise.resolve())
                }
              }
            ]}>
            <DatePicker
              showTime
              disabled={visibleEndDatePicker}
              defaultPickerValue={moment(StartDate)}
              disabledDate={disabledEndDate}
              placeholder="Оберіть дату завершення"
              format={dateFormat}
              className={classes.select}
              getPopupContainer={() => document.getElementById('area')! as HTMLElement}
              popupStyle={{ position: 'absolute' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Форма проведення" name="FormOfHolding" className={classes.formItem} rules={descriptionValidation.Inputs}>
            <TextArea className={classes.input} autoSize={{ minRows: 2, maxRows: 3 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Локація" name="Eventlocation" className={classes.formItem} rules={descriptionValidation.Inputs}>
            <TextArea className={classes.input} autoSize={{ minRows: 2, maxRows: 3 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Призначена для" name="ForWhom" className={classes.formItem} rules={descriptionValidation.Inputs}>
            <TextArea className={classes.input} autoSize={{ minRows: 2, maxRows: 3 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Приблизна кількість учасників" name="NumberOfPartisipants" className={classes.formItem}
            rules={[
              {
                required: true,
                message: emptyInput()
              },
              {
                validator: (_: object, value: number) =>
                  value > 100
                    ? Promise.reject(maxNumber(100))
                    : Promise.resolve()
              },
              {
                validator: (_: object, value: number) =>
                  value < 2
                    ? Promise.reject(minNumber(2))
                    : Promise.resolve()
              }
            ]}
          >
            <Input className={classes.input} type="number" onKeyDown={e => (e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189) && e.preventDefault()} min="2" max="100" />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Питання / побажання до булави" className={classes.formItem} name="Questions" rules={descriptionValidation.DescriptionAndQuestions}>
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item label="Опис події" name="Description" className={classes.formItem} rules={descriptionValidation.DescriptionAndQuestions}>
            <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="start" gutter={[12, 0]}>
        <Col md={24} xs={24}>
          <Form.Item className={classes.formItem}>
            <Button type="primary" htmlType="submit" className={classes.button} loading={loading}>
              Зберегти подію
            </Button>
            <Button key="back" style={{ marginRight: "7px" }} onClick={handleCancel} className={classes.button} loading={loading}>
              Відмінити
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
