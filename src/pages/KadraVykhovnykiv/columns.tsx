import React, { useState } from "react";
import CityUser from '../../models/City/CityUser';
import moment from 'moment';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { SortOrder } from 'antd/lib/table/interface';
import {
  CaretUpOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import { Tooltip, Tag, Row, Col, Checkbox, Button } from "antd";
import styles from './Table.module.css';

const classes = require('./Table.module.css');
interface Props {
  sortKey: number;
  setSortKey: any;
 
}
const columns = (props: Props): any[] =>{
  const { sortKey, setSortKey} = props;
  const SortDirection = (props: {sort: number}) => {
    return<>
      <div className={"tableHeaderSorting"}>
        <button onClick={() => {setSortKey( props.sort)}} className={sortKey=== props.sort? "sortDirection":""}><CaretUpOutlined /></button>
        <button onClick={() => {setSortKey(-props.sort)}} className={sortKey===-props.sort? "sortDirection":""}><CaretDownOutlined /></button>
      </div>
    </>
  }

  const SortColumnHighlight = (sort: number, text: any) => {
    return {
      props: {
        style: { backgroundColor: (sortKey===sort || sortKey===-sort)? "#fafafa" : "", }
      },
      children: <div>{text}</div>
    };
  }
  return[
  { 
    align: 'right' as FormLabelAlign,
    width: 75,
    fixed: true,
    title: <Row className="tableHeader"><Col>ID</Col><Col><SortDirection sort={1} /></Col></Row>,
    dataIndex: 'id',
    render: (id: any) => {
      return SortColumnHighlight(1, 
        <div className={styles.divWrapper}>
          <div className={styles.tagText}>
            <Tooltip placement="top" title={id}>
              {id}
            </Tooltip>
          </div>
        </div>
      );
    },

  },
  {
    title: <Row className="tableHeader"><Col>Користувач</Col><Col><SortDirection sort={2} /></Col></Row>,
    dataIndex: 'userName',
    render: (userName: any) => {
      return SortColumnHighlight(2, 
        <div className={styles.divWrapper}>
          <div className={styles.tagText}>
            <Tooltip placement="top" title={userName}>
              {userName}
            </Tooltip>
          </div>
        </div>
      );
    },
  },
  {
    title: <Row className="tableHeader"><Col>Дата надання</Col><Col><SortDirection sort={3} /></Col></Row>,
    dataIndex: 'dateOfGranting',
    render:(dateOfGranting:Date)=>{
        return moment(dateOfGranting).format("DD.MM.YYYY")
    },
    
  },
  {
    title: <Row className="tableHeader"><Col>Номер в реєстрі</Col><Col><SortDirection sort={4} /></Col></Row>, 
    render: (numberInRegister: any) => {
      return SortColumnHighlight(4, 
        <div className={styles.divWrapper}>
          <div className={styles.tagText}>
            <Tooltip placement="top" title={numberInRegister}>
              {numberInRegister}
            </Tooltip>
          </div>
        </div>
      );
    },
    dataIndex: 'numberInRegister',
  },
    
]};
export default columns;
