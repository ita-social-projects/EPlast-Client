import { Table } from "antd";
import React from "react";

interface props{
    columns:any;
    filteredData:any;
}
export const RegionAnnualReportTable=({columns,filteredData}:props)=>{
return (  
    <div>
        <Table
    bordered
    rowKey="id"
    columns={columns}
    dataSource={filteredData}
  />
    </div>
    
    )
}