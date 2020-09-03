import { Form, DatePicker, Select, Input, Space, Button, Radio, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import TextArea from 'antd/lib/input/TextArea';
import { useParams, useHistory } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import jwt from 'jwt-decode';
import eventUserApi from '../../../../api/eventUserApi';
import notificationLogic from '../../../../components/Notifications/Notification';
import moment from 'moment';
import 'moment/locale/uk';
import eventsApi from '../../../../api/eventsApi';
import AuthStore from '../../../../stores/AuthStore';
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
    const [administators, setAdministators] = useState<any>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>(['', '', '', '']);
    const [categories, setCategories] = useState<any>([]);
    const dateFormat = 'DD/MM/YYYY HH:mm';

    const [editedEvent, setEvent] = useState<any>({
        event: {
            description: '',
            eventCategoryID: 0,
            eventDateEnd: '',
            eventDateStart: '',
            eventName: '',
            eventStatusID: 0,
            eventTypeID: 0,
            eventlocation: '',
            forWhom: '',
            formOfHolding: '',
            id: 0,
            numberOfPartisipants: 0,
            questions: ''
        },
        commandant: {
            userId: '',
        },
        alternate: {
            userId: ''
        },
        bunchuzhnyi: {
            userId: ''
        },
        pysar: {
            userId: ''
        }
    });

    useEffect(() => {
        const fetchEvent = async () => {
            await eventUserApi.getEditedEvent(id).then(async response => {
                const { editedEvent } = response.data;
                setEvent({ editedEvent });
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
        fetchEvent();
        form.resetFields();
    }, [id]);

    const [data, setData] = useState<any>({
        eventCategories: [{
            eventCategoryId: 0,
            eventCategoryName: '',
        }],
        eventTypes: [{
            id: 0,
            eventTypeName: '',
        }],
        users: [{
            id: '',
            firstName: '',
            lastName: '',
            userName: '',
        }]
    });

    useEffect(() => {
        const fetchData = async () => {
            await eventUserApi.getDataForNewEvent().then(async response => {
                const { eventCategories, eventTypes, users } = response.data;
                setData({ eventCategories, eventTypes, users });
                setAdministators(users);
                setCategories(categories);
            })
        }
        fetchData();
    }, []);

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
            notificationLogic('success', 'Подія ' + values.EventName + ' успішно змінена');

        }).catch(error => {
            if (error.response.status === 400) {
                notificationLogic('error', 'Спробуйте ще раз');
            }
        });;
        onEdit();
        form.resetFields();
        setDoneLoading(false);
        setShowEventEditDrawer(false);
    }

    function onSearch(val: any) {
    }

    function disabledDate(current: any) {
        return current && current < moment().startOf('day');
    }

    const onChange = async (e: any) => {
        await eventsApi.getCategories(e.target.value).then(async response => {
            setCategories([...response.data]);
            form.setFieldsValue({
                EventCategoryID: '',
            });
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

    return (
        <Form name="basic" form={form} onFinish={handleFinish} initialValues={editedEvent}>
            <Form.Item name="ID" >
                <Input type="hidden" style={{ width: 0 }} />
            </Form.Item>
            < div className={classes.radio} >
                <Form.Item name="EventTypeID" rules={[{ required: true, message: 'Оберіть тип події' }]} className={classes.radio}>
                    <Radio.Group buttonStyle="solid" className={classes.eventTypeGroup} onChange={onChange} >
                        {data?.eventTypes.map((item: any) => (<Radio.Button defaultChecked={true} key={item.id} value={item.id}> {item.eventTypeName}</Radio.Button>))}
                    </Radio.Group>
                </Form.Item>
            </div>
            < div className={classes.row} >
                <h3>Категорія </h3>
                < Form.Item name="EventCategoryID" className={classes.input} rules={[{ required: true, message: 'Оберіть категорію події' }]} >
                    <Select showSearch optionFilterProp="children" onSearch={onSearch}>
                        {categories?.map((item: any) => (<Select.Option key={item.id} value={item.eventCategoryId}> {item.eventCategoryName} </Select.Option>))}
                    </Select>
                </ Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Назва події </h3>
                < Form.Item name="EventName" rules={[{ required: true, message: 'Вкажіть назву події' }]} >
                    <Input className={classes.input} />
                </ Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Комендант </h3>
                < Form.Item name="commandantId" className={classes.select} rules={[{ required: true, message: 'Оберіть коменданта' }]} >
                    <Select showSearch optionFilterProp="children" onSearch={onSearch} onChange={(e: any) => handleSelectChange(0, e)}  >
                        {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName} </Select.Option>))}
                    </Select>
                </ Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Заступник коменданта </h3>
                < Form.Item name="alternateId" className={classes.select} rules={[{ required: true, message: 'Оберіть заступника коменданта' }]} >
                    <Select showSearch optionFilterProp="children" onSearch={onSearch} onChange={(e: any) => handleSelectChange(0, e)}  >
                        {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName} </Select.Option>))}
                    </Select>
                </Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Бунчужний </h3>
                < Form.Item name="bunchuzhnyiId" className={classes.select} rules={[{ required: true, message: 'Оберіть бунчужного' }]} >
                    <Select showSearch optionFilterProp="children" onSearch={onSearch} onChange={(e: any) => handleSelectChange(0, e)} >
                        {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName} </Select.Option>))}
                    </Select>
                </Form.Item>
            </ div>
            < div className={classes.row} >
                <h3>Писар </h3>
                < Form.Item name="pysarId" className={classes.select} rules={[{ required: true, message: 'Оберіть писаря' }]} >
                    <Select showSearch optionFilterProp="children" onSearch={onSearch} onChange={(e: any) => handleSelectChange(0, e)} >
                        {administators.map((item: any) => (<Select.Option disabled={item.isSelected} key={item.value} value={item.id} > {item.firstName} {item.lastName} <br /> {item.userName} </Select.Option>))}
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
                < Form.Item name="FormOfHolding" rules={[{ required: true, message: 'Вкажіть форму проведення події' }]}>
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
                < Form.Item name="ForWhom" rules={[{ required: true, message: 'Вкажіть для кого призначена подія' }]}>
                    <Input className={classes.input} />
                </Form.Item>
            </div>
            < div className={classes.row} >
                <h3>Приблизна кількість учасників </h3>
                < Form.Item name="NumberOfPartisipants" rules={[{ required: true, message: 'Вкажіть приблизну к-сть учасників' }]}>
                    <Input className={classes.input} type="number" />
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
                <h3>Опис події </h3>
                < Form.Item name="Description" rules={[{ required: true, message: 'Вкажіть, які впроваджено зміни' },
                { max: 50, message: 'Поле не може перевищувати 200 символів' }]}>
                    <TextArea className={classes.input} autoSize={{ minRows: 3, maxRows: 5 }} />
                </Form.Item>
            </div>
            < Form.Item >
                <Button type="primary" htmlType="submit" className={classes.button} loading={doneLoading} >
                    Редагувати подію
               </Button>
            </Form.Item>
        </Form>
    );
};