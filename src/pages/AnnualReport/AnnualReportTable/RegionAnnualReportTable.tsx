import { Button, Modal, Table } from "antd";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import regionsApi from "../../../api/regionsApi";
import AuthStore from "../../../stores/AuthStore";
import RegionAnnualReport from "../Interfaces/RegionAnnualReports";
import ConfirmedRegionDropdown from "./DropdownsForRegionReports/ConfirmedDropdown/ConfirmedRegionDropdown";
import RegionAnnualReportInformation from "./RegionAnnualReportInformation";

interface props{
    columns:any;
    filteredData:any;
}

export const RegionAnnualReportTable=({columns,filteredData}:props)=>{
    const [regionAnnualReport, setRegionAnnualReport] = useState<RegionAnnualReport>(Object);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [showConfirmedRegionDropdown, setShowConfirmedRegionDropdown] = useState<boolean>(false);
    const [showRegionAnnualReportModal, setShowRegionAnnualReportModal] = useState<boolean>(false);
    const [canManage, setCanManage] = useState<boolean>(false);
    const hideDropdowns = () => {
        setShowConfirmedRegionDropdown(false);
      };
    const showDropdown = () => {
            hideDropdowns();
            setShowConfirmedRegionDropdown(true);
        }
        
    const handleView = async (id: number, year:number) => {
            hideDropdowns();
            try {
              let response = await regionsApi.getReportById(id,year);
              setRegionAnnualReport(response.data);
              setShowRegionAnnualReportModal(true);
            } catch (error) {
              showError(error.message);
            }
          };
    const showError = (message: string) => {
            Modal.error({
              title: "Помилка!",
              content: message,
            });
          };
    const checkAccessToManage = () => {
            let jwt = AuthStore.getToken() as string;
            let decodedJwt = jwt_decode(jwt) as any;
            let roles = decodedJwt[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ] as string[];
            setCanManage(roles.includes("Admin") || roles.includes("Голова Регіону"));
          };
    useEffect(() => {
            checkAccessToManage();
          }, []);
      
return (  
    <div>
        <Table
    bordered
    rowKey="id"
    columns={columns}
    dataSource={filteredData}
    onRow={(regionRecord) => {
        return {
          onClick: () => {
            hideDropdowns();
          },
          onContextMenu: (event) => {
            event.preventDefault();
            showDropdown();
            setRegionAnnualReport(regionRecord);
            setX(event.pageX);
            setY(event.pageY-200);
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
  <ClickAwayListener onClickAway={hideDropdowns}>
        <ConfirmedRegionDropdown
          showDropdown={showConfirmedRegionDropdown}
          regionRecord={regionAnnualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
        />
      </ClickAwayListener>
      <RegionAnnualReportInformation
        visibleModal={showRegionAnnualReportModal}
        regionAnnualReport={regionAnnualReport}
        showError={showError}
        handleOk={() => setShowRegionAnnualReportModal(false)}
      />
    </div>
    )
}