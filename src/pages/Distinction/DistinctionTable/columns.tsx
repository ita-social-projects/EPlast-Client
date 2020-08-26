import React from 'react';
import decisionsApi from '../../../api/distinctionApi';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Відзначення',
        dataIndex: 'distinction',
    },
    {
        title: 'Ім\'я',
        dataIndex: 'name',
    },
    {
        title: 'Дата затвердження',
        dataIndex: 'date',
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
