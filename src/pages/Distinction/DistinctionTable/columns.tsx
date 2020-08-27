import React from 'react';
import decisionsApi from '../../../api/distinctionApi';
import moment from 'moment'
import UserDistinction from '../Interfaces/UserDistinction';
import { User } from '../../userPage/Interface/Interface';
import UserApi from '../../../api/UserApi';
import distinctionApi from '../../../api/distinctionApi';
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Відзначення',
        dataIndex: 'distinctionId',
    },
    {
        title: 'Ім\'я',
        dataIndex: 'userId',
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
