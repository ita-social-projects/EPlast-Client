import React from 'react';
import { Select, Input, DatePicker, InputNumber, Button } from 'antd';
import moment from 'moment';

const classes = require('./EventCreate.module.css');

const EventCreate = () => {
    const { Option } = Select;

    function handleChange(value: any) {
        console.log(`selected ${value}`);
    }
    function onChange(value: any) {
        console.log('changed', value);
    }
    const { TextArea } = Input;

    const onChange1 = (e: any) => {
        console.log(e);
    };

    const dateFormat = 'YYYY/MM/DD';
    return (
        <div className={classes.background}>
            <div className={classes.actionsWrapper}>
                <div className={classes.card}>
                    <h1>Нова подія</h1>
                    <form method="post">
                        <div className={classes.row}>
                            <label htmlFor="radio1" className={classes.label}><input type="radio" name="radio" value="1" id="radio1" />Акція</label>
                            <label htmlFor="radio2" className={classes.label}><input type="radio" name="radio" value="2" id="radio2" />Вишкіл</label>
                            <label htmlFor="radio3" className={classes.label}><input type="radio" name="radio" value="3" id="radio3" />Табір</label>
                        </div>
                        <div className={classes.row}>
                            <h2>Категорія</h2>
                            <Select defaultValue="1" style={{ width: '240' }} onChange={handleChange} className={classes.select}>
                                <Option value="1" className={classes.input}>Інструкторський Вишкіл (УСП)</Option>
                                <Option value="2" className={classes.input}>Конгрес</Option>
                                <Option value="3" className={classes.input}>КПЗ</Option>
                                <Option value="4" className={classes.input}>Крайовий Вишкіл Виховників УПЮ (КВВ УПЮ)</Option>
                                <Option value="5" className={classes.input}>Крайовий Вишкіл Дійсного Членства (КВДЧ)</Option>
                                <Option value="6" className={classes.input}>Крайовий Вишкіл Звязкових</Option>
                                <Option value="7" className={classes.input}>Крайовий Вишкіл Провідників Вишколів</Option>
                                <Option value="8" className={classes.input}>Крайовий Дошкіл Виховників УПЮ (КВВ УПЮ)</Option>
                                <Option value="9" className={classes.input}>Крайовий табір</Option>
                                <Option value="10" className={classes.input}>Курінний табір</Option>
                                <Option value="11" className={classes.input}>ЛШ вишкіл булавних</Option>
                                <Option value="12" className={classes.input}>ЛШ вишкіл бунчужних</Option>
                                <Option value="13" className={classes.input}>Окружний табір</Option>
                                <Option value="14" className={classes.input}>Рада Орлиної Спеціалізації (провідників вишколів)</Option>
                                <Option value="15" className={classes.input}>Рада Орлиної Спеціалізації (провідників таборів)</Option>
                                <Option value="16" className={classes.input}>Рада Орлиного Вогню (булавних)</Option>
                                <Option value="17" className={classes.input}>Рада Орлиного Вогню (впорядників)</Option>
                                <Option value="18" className={classes.input}>Рада Орлиного Вогню (гніздових)</Option>
                                <Option value="19" className={classes.input}>Станичний табір</Option>
                                <Option value="20" className={classes.input}>ШБ вишкіл булавних</Option>
                                <Option value="21" className={classes.input}>ШБ вишкіл бунчужних</Option>
                            </Select>
                        </div>

                        <div className={classes.row}>
                            <h2>Назва події</h2>
                            <Input className={classes.input} />
                        </div>

                        <div className={classes.row}>
                            <h2>Комендант</h2>
                            <Select defaultValue="1" style={{ width: '240' }} onChange={handleChange} className={classes.select}>
                                <Option value="1" className={classes.input}>Інструкторський Вишкіл (УСП)</Option>
                                <Option value="2" className={classes.input}>Конгрес</Option>
                                <Option value="3" className={classes.input}>КПЗ</Option>
                                <Option value="4" className={classes.input}>Крайовий Вишкіл Виховників УПЮ (КВВ УПЮ)</Option>
                                <Option value="5" className={classes.input}>Крайовий Вишкіл Дійсного Членства (КВДЧ)</Option>
                                <Option value="6" className={classes.input}>Крайовий Вишкіл Звязкових</Option>
                                <Option value="7" className={classes.input}>Крайовий Вишкіл Провідників Вишколів</Option>
                                <Option value="8" className={classes.input}>Крайовий Дошкіл Виховників УПЮ (КВВ УПЮ)</Option>
                                <Option value="9" className={classes.input}>Крайовий табір</Option>
                                <Option value="10" className={classes.input}>Курінний табір</Option>
                                <Option value="11" className={classes.input}>ЛШ вишкіл булавних</Option>
                                <Option value="12" className={classes.input}>ЛШ вишкіл бунчужних</Option>
                                <Option value="13" className={classes.input}>Окружний табір</Option>
                                <Option value="14" className={classes.input}>Рада Орлиної Спеціалізації (провідників вишколів)</Option>
                                <Option value="15" className={classes.input}>Рада Орлиної Спеціалізації (провідників таборів)</Option>
                                <Option value="16" className={classes.input}>Рада Орлиного Вогню (булавних)</Option>
                                <Option value="17" className={classes.input}>Рада Орлиного Вогню (впорядників)</Option>
                                <Option value="18" className={classes.input}>Рада Орлиного Вогню (гніздових)</Option>
                                <Option value="19" className={classes.input}>Станичний табір</Option>
                                <Option value="20" className={classes.input}>ШБ вишкіл булавних</Option>
                                <Option value="21" className={classes.input}>ШБ вишкіл бунчужних</Option>
                            </Select>
                        </div>

                        <div className={classes.row}>
                            <h2>Дата початку</h2>
                            <DatePicker style={{ width: '240' }} defaultValue={moment('2020/06/17', dateFormat)} format={dateFormat} className={classes.select} />
                        </div>

                        <div className={classes.row}>
                            <h2>Дата завершення</h2>
                            <DatePicker style={{ width: '240' }} defaultValue={moment('2020/06/17', dateFormat)} format={dateFormat} className={classes.select} />
                        </div>

                        <div className={classes.row}>
                            <h2>Форма проведення</h2>
                            <Input className={classes.input} />
                        </div>

                        <div className={classes.row}>
                            <h2>Локація</h2>
                            <Input className={classes.input} />
                        </div>

                        <div className={classes.row}>
                            <h2>Призначений для</h2>
                            <Input className={classes.input} />
                        </div>
                        <div className={classes.row}>
                            <h2>Приблизна кількість учасників</h2>
                            <InputNumber min={1} max={200} defaultValue={1} onChange={onChange} className={classes.select} />
                        </div>

                        <div className={classes.row}>
                            <h2>Питання/побажання до булави</h2>
                            <TextArea allowClear onChange={onChange1} className={classes.select1} />
                        </div>

                        <div className={classes.row}>
                            <h2>Які впроваджено зміни/додатки?</h2>
                            <TextArea allowClear onChange={onChange1} className={classes.select1} />
                        </div>
                        <Button type="primary" className={classes.button} >
                            Створити подію
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default EventCreate;