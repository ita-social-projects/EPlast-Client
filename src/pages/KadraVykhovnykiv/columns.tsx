
import CityUser from '../../models/City/CityUser';
import moment from 'moment';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { SortOrder } from 'antd/lib/table/interface';

const classes = require('./Table.module.css');

const columns = [
  { 
    align: 'right' as FormLabelAlign,
    width: 75,
    fixed: true,
    title: 'ID',
    dataIndex: 'id',
      sorter: true,
      sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
  {
    title: 'Користувач',
    dataIndex: 'userName',
    render: (userName: string) => {
      return userName
    },
    sorter: true,
    sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
  {
    title: 'Дата надання',
    dataIndex: 'dateOfGranting',
    render:(dateOfGranting:Date)=>{
     return moment.utc(dateOfGranting.toLocaleString()).local().format('DD.MM.YYYY');
    },
    sorter:true,
      sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
  {
    title: 'Номер в реєстрі',
    dataIndex: 'numberInRegister',
    sorter: true,
    sortDirections: ['ascend', 'descend'] as SortOrder[],
  },
    
];
export default columns;
