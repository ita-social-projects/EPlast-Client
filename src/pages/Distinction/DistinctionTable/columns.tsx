import React from 'react';
import moment from 'moment';
import CityUser from '../../../models/City/CityUser';
import Distinction from '../Interfaces/Distinction';
import { Tooltip } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { FormLabelAlign } from 'antd/lib/form/interface';


const columns = [
    {
        align: 'right' as FormLabelAlign,
        title: '№',
        dataIndex: 'number',     
        width: 75,
        fixed: true,
        defaultSortOrder: 'ascend' as SortOrder,
        sorter: (a: any, b: any) => a.number - b.number,
    },
    {
        title: 'Відзначення',
        dataIndex: 'distinction',
        render: (distinction: Distinction) => {
            return distinction.name
        },
        sorter: (a: any, b: any) => a.distinction.name.localeCompare(b.distinction.name),
        sortDirections: ['ascend', 'descend'] as SortOrder[],
        
        
    },
    {
        title: 'Ім\'я',
        dataIndex: 'user',
        render: (user: CityUser) => {
            return user.firstName + " " + user.lastName
        },
        sorter: (a: any, b: any) => a.user.firstName.localeCompare(b.user.firstName),
        sortDirections: ['ascend', 'descend'] as SortOrder[],
    },
    {
        title: 'Дата затвердження',
        dataIndex: 'date',
        render: (date: Date) => {
            return moment(date.toLocaleString()).format('DD.MM.YYYY');
        },
        sorter:(a: any, b: any)  => a.date.localeCompare(b.date),
      sortDirections: ['ascend', 'descend'] as SortOrder[],
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
