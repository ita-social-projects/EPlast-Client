import React from 'react';
import moment from 'moment';
import CityUser from '../../../models/City/CityUser';
import Distinction from '../Interfaces/Distinction';
import { Tooltip } from 'antd';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',     
        wisth: 60
    },
    {
        title: 'Відзначення',
        dataIndex: 'distinction',
        render: (distinction: Distinction) => {
            return distinction.name
        },
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
        ellipsis: {
            showTitle: false,
          },
          render: (reporter: any) => (
            <Tooltip placement="topLeft" title={reporter}>
              {reporter}
            </Tooltip>
          ),
    },
    {
        title: 'Обгрунтування',
        dataIndex: 'reason',
        ellipsis: {
            showTitle: false,
          },
          render: (reason: any) => (
            <Tooltip placement="topRight" title={reason}>
              {reason}
            </Tooltip>
          ),
    },
];
export default columns;
