import { Table } from 'antd';
import { title } from 'process';

const SectionsTable:any =[
 {
     title: title,
     dataIndex: "title"
 },
 {
     title:null,
     dataIndex:"edit"
     render:()=>{ }
 },
 {
     title:null,
     dataIndex:"delete"
     render:()=>
 }
];

export default SectionsTable