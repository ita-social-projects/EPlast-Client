import React from 'react';
import decisionsApi from '../../../api/distinctionApi';
import moment from 'moment'
import UserDistinction from '../Interfaces/UserDistinction';
import { User } from '../../userPage/Interface/Interface';
import UserApi from '../../../api/UserApi';
import distinctionApi from '../../../api/distinctionApi';
import CityUser from '../../../models/City/CityUser';
import Distinction from '../Interfaces/Distinction';
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Відзначення',
        dataIndex: 'distinction',
        render: (distinction: Distinction) => {
            return distinction.name
        }
    },
    {
        title: 'Ім\'я',
        dataIndex: 'user',
        render: (user: CityUser) => {
            return user.firstName + " " + user.lastName
        }
    },
    {
        title: 'Дата затвердження',
        dataIndex: 'date',
        render: (date: Date) => {
            return moment(date.toLocaleString()).format('DD-MM-YYYY');
        }
    },
    {
        title: 'Подання від',
        dataIndex: 'reporter',
    },
    {
        title: 'Обгрунтування',
        dataIndex: 'reason',
    },
];
export default columns;
