import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Select, Input, Button, Radio } from 'antd';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';
import eventUserApi from '../../../../api/eventUserApi';
import eventsApi from "../../../../api/eventsApi";
import notificationLogic from '../../../../components/Notifications/Notification';
import EventCategories from '../../../../models/EventCreate/EventCategories';
import Users from '../../../../models/EventCreate/Users';
import EventTypes from '../../../../models/EventCreate/EventTypes';

const classes = require('./EventCreate.module.css');

interface Props {
  onCreate: () => void;
  setShowEventCreateDrawer: (visibleEventCreateDrawer: boolean) => void;
}

export default function ({ onCreate, setShowEventCreateDrawer }: Props) {

  const [form] = Form.useForm();
  const [selectedUsers, setSelectedUsers] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const dateFormat = 'MM/DD/YYYY HH:mm';
  const [categories, setCategories] = useState<EventCategories[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypes[]>([]);
  const [administators, setAdministators] = useState<Users[]>([]);

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
        eventDateStart: moment(values.EventDateStart).add(3, "hours"),
        eventDateEnd: moment(values.EventDateEnd).add(3, "hours"),
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
      notificationLogic('success', 'Подія ' + values.EventName + ' успішно створена');
    }).catch(error => {
      if (error.response?.status === 400) {
        notificationLogic('error', 'Спробуйте ще раз');
      }
    });
    onCreate();
    form.resetFields();
    setLoading(false);
    setShowEventCreateDrawer(false);
  }

  function disabledDate(current: any) {
    return current && current < moment().startOf('day');
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

  return (
    <Form name="basic"
      form={form}
      onFinish={handleFinish}
    >
      < div className={classes.radio} >
        <Form.Item name="EventTypeID" rules={[{ required: true, message: 'Оберіть тип події' }]} className={classes.radio}>
          <Radio.Group buttonStyle="solid" className={classes.eventTypeGroup} onChange={onChange} value={categories}>
            {eventTypes.map((item: any) => (<Radio.Button key={item.id} value={item.id}> {item.eventTypeName}</Radio.Button>))}
          </Radio.Group>
        </Form.Item>
      </div>
      < div className={classes.row} >
        <h3>Категорія </h3>
        < Form.Item name="EventCategoryID" className={classes.input} rules={[{ required: true, message: 'Оберіть категорію події' }]} >
          <Select notFoundContent="Спочатку оберіть тип події" showSearch optionFilterProp="children" >
            {categories.map((item: any) => (<Select.Option key={item.eventCategoryId} value={item.eventCategoryId} > {item.eventCategoryName} </Select.Option>))}
          </Select>
        </ Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Назва події </h3>
        < Form.Item name="EventName" rules={[{ required: true, message: 'Вкажіть назву події' }, { max: 50, message: 'Назва події не може перевищувати 50 символів' }]} >
          <Input className={classes.input} />
        </ Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Комендант </h3>
        < Form.Item name="commandantId" className={classes.select} rules={[{ required: true, message: 'Оберіть коменданта' }]} >
          <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(0, e)}  >
            {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.id} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName}</Select.Option>))}
          </Select>
        </ Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Заступник коменданта </h3>
        < Form.Item name="alternateId" className={classes.select} rules={[{ required: true, message: 'Оберіть заступника коменданта' }]} >
          <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(1, e)} >
            {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName}</Select.Option>))}
          </Select>
        </Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Бунчужний </h3>
        < Form.Item name="bunchuzhnyiId" className={classes.select} rules={[{ required: true, message: 'Оберіть бунчужного' }]} >
          <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(2, e)}>
            {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName}</Select.Option>))}
          </Select>
        </Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Писар </h3>
        < Form.Item name="pysarId" className={classes.select} rules={[{ required: true, message: 'Оберіть писаря' }]} >
          <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(3, e)}>
            {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName}</Select.Option>))}
          </Select>
        </Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Дата початку </h3>
        < Form.Item name="EventDateStart" rules={[{ required: true, message: 'Оберіть дату початку події' }]} >
          <DatePicker showTime disabledDate={disabledDate} placeholder="Оберіть дату початку" format={dateFormat} className={classes.select} />
        </ Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Дата завершення </h3>
        < Form.Item name="EventDateEnd" rules={[{ required: true, message: 'Оберіть дату завершення події' }]} >
          <DatePicker showTime disabledDate={disabledDate} placeholder="Оберіть дату завершення" format={dateFormat} className={classes.select} />
        </ Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Форма проведення </h3>
        < Form.Item name="FormOfHolding" rules={[{ required: true, message: 'Вкажіть форму проведення події' },{ max: 50, message: 'Максимальна к-сть символів - 50' }]} >
          <Input className={classes.input} />
        </Form.Item>
      </div>
      <div className={classes.row} >
        <h3>Локація </h3>
        < Form.Item name="Eventlocation" rules={[{ required: true, message: 'Вкажіть локацію події' }]}>
          <Input className={classes.input} />
        </Form.Item>
      </div>
      < div className={classes.row} >
        <h3>Призначений для </h3>
        < Form.Item name="ForWhom" rules={[{ required: true, message: 'Вкажіть для кого призначена подія' },{ max: 50, message: 'Максимальна к-сть символів - 50' }]}>
          <Input className={classes.input} />
        </Form.Item>
      </div>
      < div className={classes.row} >
        <h3>Приблизна кількість учасників </h3>
        < Form.Item name="NumberOfPartisipants" rules={[{ required: true, message: 'Вкажіть приблизну к-сть учасників' }, { min:0, message: 'Мінімальна к-сть учасників - 0'}]} >
          <Input className={classes.input} type="number" min="0"/>
        </Form.Item>
      </ div>
      < div className={classes.row} >
        <h3>Питання / побажання до булави </h3>
        < Form.Item name="Questions" rules={[{ required: true, message: 'Вкажіть питання' },
        { max: 50, message: 'Питання не можуть перевищувати 200 символів' }]}>
          <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
      </div>
      < div className={classes.row} >
        <h3>Опис події</h3>
        < Form.Item name="Description" rules={[{ required: true, message: 'Вкажіть, які впроваджено зміни' },
        { max: 50, message: 'Поле не може перевищувати 200 символів' }]}>
          <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
      </div>
      < Form.Item >
        <Button type="primary" htmlType="submit" className={classes.button} loading={loading} >
          Зберегти подію
               </Button>
      </Form.Item>
    </Form>
  );
};