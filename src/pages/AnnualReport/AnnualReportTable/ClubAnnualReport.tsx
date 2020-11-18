import React, { useEffect, useState, PropsWithRef } from "react";
import { Table, Spin, Input, Divider, Button } from 'antd';
import AnnualReport from '../Interfaces/AnnualReport';
import ClubAnnualReport from '../Interfaces/ClubAnnualReport';
import Paragraph from 'antd/lib/skeleton/Paragraph';


interface props {

    columns: any;
    filteredData: any;
  }


  export const ClubAnnualReportTable =({columns, filteredData}:props)=>{

    const [annualReport, setAnnualReport] = useState<AnnualReport>(Object);
    const [clubAnnualReport, setClubAnnualReport] = useState<ClubAnnualReport>(Object);
    const [reportStatusNames, setReportStatusNames] = useState<string[]>(Array());
    const [annualReports, setAnnualReports] = useState<AnnualReport[]>(Array());
    const [clubAnnualReports, setClubAnnualReports] = useState<ClubAnnualReport[]>(Array());
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<
    boolean
  >(false);
  const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(
    false
  );
  const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);

    const hideDropdowns = () => {
      setShowUnconfirmedDropdown(false);
      setShowConfirmedDropdown(false);
      setShowSavedDropdown(false);
    };

    const showDropdown = (annualReportStatus: number) => {
      switch (annualReportStatus) {
        case 0:
          hideDropdowns();
          setShowUnconfirmedDropdown(true);
          break;
        case 1:
          hideDropdowns();
          setShowConfirmedDropdown(true);
          break;
        case 2:
          hideDropdowns();
          setShowSavedDropdown(true);
          break;
      }
    };
    
    return(
        <div>
        <Table
  bordered
  rowKey="id"
  columns={columns}
  scroll={{ x: 1300 }}
  dataSource={filteredData}
  onRow={(record) => {
    return {
      onClick: () => {
        hideDropdowns();
      },
      onContextMenu: (event) => {
        event.preventDefault();
        showDropdown(record.status);
        setX(event.pageX);
        setY(event.pageY);
      },
    };
  }}
  onChange={(pagination) => {
    if (pagination) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: "smooth",
      });
    }
  }}
  pagination={{
    showLessItems: true,
    responsive: true,
    showSizeChanger: true,
  }}
/>
  </div>
    )
  }
