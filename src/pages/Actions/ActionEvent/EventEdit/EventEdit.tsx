import { Form, DatePicker, Select, Input, Button, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import eventUserApi from '../../../../api/eventUserApi';
import notificationLogic from '../../../../components/Notifications/Notification';
import moment, { min } from 'moment';
import 'moment/locale/uk';
import eventsApi from '../../../../api/eventsApi';
import EventCategories from '../../../../models/EventCreate/EventCategories';
import EventTypes from '../../../../models/EventCreate/EventTypes';
import Users from '../../../../models/EventCreate/Users';
import EventEdit from '../../../../models/EventEdit/EventEdit';
import NotificationBoxApi from '../../../../api/NotificationBoxApi';
import{successfulEditAction, tryAgain, emptyInput, maxLength} from "../../../../components/Notifications/Messages"
moment.locale('uk-ua');

const classes = require('./EventEdit.module.css');

interface Props {
    id: number;
    onEdit: () => void;
    setShowEventEditDrawer: (visibleDrawer: boolean) => void;
}

export default function ({ id, onEdit, setShowEventEditDrawer }: Props) {
    const [form] = Form.useForm();
    const [doneLoading, setDoneLoading] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>(['', '', '', '']);
    const dateFormat = 'DD.MM.YYYY HH:mm';
    const [categories, setCategories] = useState<EventCategories[]>([]);
    const [eventTypes, setEventTypes] = useState<EventTypes[]>([]);
    const [administators, setAdministators] = useState<Users[]>([]);
    const [editedEvent, setEvent] = useState<EventEdit>();

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
        const fetchEvent = async () => {
            await eventUserApi.getEditedEvent(id).then(async response => {
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
                await eventsApi.getCategories(response.data.event.eventTypeID).then(async response => {
                    setCategories([...response.data]);
                })
            })
        }
        if (id != undefined) {
            fetchEvent();
        }
    }, [id]);

    useEffect(() => {
        resetUsers()
    }, selectedUsers);

    const handleFinish = async (values: any) => {
        setDoneLoading(true);
        const newEvent = {
            event: {
                id: values.ID,
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
        await eventUserApi.put(newEvent).then(response => {
            notificationLogic('success', successfulEditAction('Подію', values.EventName));

            NotificationBoxApi.createNotifications(
                [values.commandantId, values.alternateId, values.bunchuzhnyiId, values.pysarId],
                "Подія, в якій ви є адміністратором, змінена: ",
                NotificationBoxApi.NotificationTypes.EventNotifications,
                `/events/details/${values.ID}`,
                values.EventName
                );
        }).catch(error => {
            if (error.response.status === 400) {
                notificationLogic('error', tryAgain);
            }
        });;
        setShowEventEditDrawer(false);
        setDoneLoading(false);
        onEdit();
        form.resetFields();
    }

    function disabledDate(current: any) {
        return current && current < moment().startOf('day');
    }

    const onChange = async (e: any) => {
        await eventsApi.getCategories(e.target.value).then(async response => {
            setCategories([...response.data]);
            let arrWithSelectedItem = response.data.filter((c: { eventCategoryId: any; })=>c.eventCategoryId==form.getFieldValue("EventCategoryID"));
            let arrWithDefaultItem = response.data.filter((c: { eventCategoryId: any; })=>c.eventCategoryId==editedEvent?.event.eventCategoryID);
            if(arrWithSelectedItem.length==0)
            {
                if(arrWithDefaultItem.length!=0)
                {
                    form.setFieldsValue({
                        EventCategoryID: editedEvent?.event.eventCategoryID,
                    });
                }
                else
                {
                    form.setFieldsValue({
                        EventCategoryID: '',
                    });
                }
            }
            else
            {
                form.setFieldsValue({
                    EventCategoryID: form.getFieldValue("EventCategoryID"),
                });
            }
        })
        
    }

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
        setShowEventEditDrawer(false);
      };

    return (
        <Form name="basic" form={form} onFinish={handleFinish} initialValues={editedEvent}>
            <Form.Item name="ID" >
                <Input type="hidden" style={{ width: 0 }} />
            </Form.Item>
            < div className={classes.radio} >
                <Form.Item name="EventTypeID" rules={[{ required: true, message: emptyInput() }]} className={classes.radio}>
                    <Radio.Group buttonStyle="solid" className={classes.eventTypeGroup} onChange={onChange} >
                        {eventTypes.map((item: any) => (<Radio.Button defaultChecked={true} key={item.id} value={item.id}> {item.eventTypeName}</Radio.Button>))}
                    </Radio.Group>
                </Form.Item>
            </div>
            < div className={classes.row} >
                <h3>Категорія </h3>
                < Form.Item name="EventCategoryID" className={classes.input} rules={[{ required: true, message: emptyInput() }]} >
                    <Select showSearch optionFilterProp="children">
                        {categories?.map((item: any) => (<Select.Option key={item.id} value={item.eventCategoryId}> {item.eventCategoryName} </Select.Option>))}
                    </Select>
                </ Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Назва події </h3>
                < Form.Item name="EventName" rules={[{ required: true, message: emptyInput() }, { max: 50, message: maxLength(50)}]} >
                <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} /> 
                </ Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Комендант </h3>
                < Form.Item name="commandantId" className={classes.select} rules={[{ required: true, message: emptyInput() }]} >
                    <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(0, e)}  >
                        {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName} </Select.Option>))}
                    </Select>
                </ Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Заступник коменданта </h3>
                < Form.Item name="alternateId" className={classes.select} rules={[{ required: true, message: emptyInput() }]} >
                    <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(0, e)}  >
                        {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName} </Select.Option>))}
                    </Select>
                </Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Бунчужний </h3>
                < Form.Item name="bunchuzhnyiId" className={classes.select} rules={[{ required: true, message: emptyInput() }]} >
                    <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(0, e)} >
                        {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName} </Select.Option>))}
                    </Select>
                </Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Писар </h3>
                < Form.Item name="pysarId" className={classes.select} rules={[{ required: true, message: emptyInput() }]} >
                    <Select showSearch optionFilterProp="children" onChange={(e: any) => handleSelectChange(0, e)} >
                        {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName} </Select.Option>))}
                    </Select>
                </Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Дата початку </h3>
                < Form.Item name="EventDateStart" rules={[{ required: true, message: emptyInput() }]} >
                    <DatePicker showTime disabledDate={disabledDate} placeholder="Оберіть дату початку" format={dateFormat} className={classes.select} />
                </ Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Дата завершення </h3>
                < Form.Item name="EventDateEnd" rules={[{ required: true, message: emptyInput() }]} >
                    <DatePicker showTime disabledDate={disabledDate} placeholder="Оберіть дату завершення" format={dateFormat} className={classes.select} />
                </ Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Форма проведення </h3>
                < Form.Item name="FormOfHolding" rules={[{ required: true, message: emptyInput() }, { max: 50, message: maxLength(50) }]}>
                <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
            </div>
            <div className={classes.row} >
                <h3>Локація </h3>
                < Form.Item name="Eventlocation" rules={[{ required: true, message: emptyInput() } , { max: 50, message: maxLength(50) }]}>
                <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
            </div>
            < div className={classes.row} >
                <h3>Призначена для </h3>
                < Form.Item name="ForWhom" rules={[{ required: true, message: emptyInput() },{ max: 50, message: maxLength(50) }]}>
                <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
            </div>
            < div className={classes.row} >
                <h3>Приблизна кількість учасників </h3>
                < Form.Item name="NumberOfPartisipants">
                    <Input className={classes.input} type="number"  onKeyDown={ e => ( e.keyCode === 69 || e.keyCode === 190 || e.keyCode === 187 || e.keyCode === 189) && e.preventDefault() }  />
                </Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Питання / побажання до булави </h3>
                < Form.Item name="Questions" rules={[{ required: true, message: emptyInput() },
                { max: 50, message: maxLength(50) }]}>
                    <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
            </div>
            < div className={classes.row} >
                <h3>Опис події </h3>
                < Form.Item name="Description" rules={[{ required: true, message: emptyInput() },
                { max: 50, message: maxLength(50) }]}>
                    <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
            </div>
            < Form.Item >
                <Button type="primary" htmlType="submit" className={classes.button} style={{ marginRight: 45 }} loading={doneLoading} >
                    Зберегти подію
               </Button>
               <Button key="back" onClick={handleCancel} className={classes.button} loading={doneLoading} >
                    Відмінити
                </Button>
            </Form.Item>
        </Form>
    );
};