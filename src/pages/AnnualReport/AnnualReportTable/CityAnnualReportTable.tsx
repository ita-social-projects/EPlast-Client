import React, { useEffect, useState, PropsWithRef } from "react";
import { useHistory } from "react-router-dom";
import { Table, Spin, Input, Divider, Button } from 'antd';
import AnnualReport from '../Interfaces/AnnualReport';
import ClubAnnualReport from '../Interfaces/ClubAnnualReport';
import ClickAwayListener from "react-click-away-listener";
import UnconfirmedDropdown from "./Dropdowns/UnconfirmedDropdown/UnconfirmedDropdown";
import ConfirmedDropdown from "./Dropdowns/ConfirmedDropdown/ConfirmedDropdown";
import SavedDropdown from "./Dropdowns/SavedDropdown/SavedDropdown";
import AnnualReportInformation from "./AnnualReportInformation/AnnualReportInformation";
import CitySelectModal from "./CitySelectModal/CitySelectModal";
import AnnualReportApi from "../../../api/AnnualReportApi";
import Modal from "antd/lib/modal";
import AuthStore from "../../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import { ExclamationCircleOutlined } from "@ant-design/icons";



interface props {

    columns: any;
    filteredData: any;
  }
  
  export const CityAnnualReportTable =({columns, filteredData}:props)=>{
  const history = useHistory();
    const [annualReport, setAnnualReport] = useState<AnnualReport>(Object);
    const [clubAnnualReport, setClubAnnualReport] = useState<ClubAnnualReport>(Object);
    const [reportStatusNames, setReportStatusNames] = useState<string[]>(Array());
    const [annualReports, setAnnualReports] = useState<AnnualReport[]>(Array());
    const [clubAnnualReports, setClubAnnualReports] = useState<ClubAnnualReport[]>(Array());
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
  const [recordObj, setRecordObj] = useState<any>(0);
    const [loading, setLoading] = useState(false);
    const [canManage, setCanManage] = useState<boolean>(false);
    const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<
    boolean
  >(false);
  const [showCitySelectModal, setShowCitySelectModal] = useState<boolean>(
    false
  );
  const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(
    false
  );
  const [showAnnualReportModal, setShowAnnualReportModal] = useState<boolean>(
    false
  );
  const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);

    const hideDropdowns = () => {
      setShowUnconfirmedDropdown(false);
      setShowConfirmedDropdown(false);
      setShowSavedDropdown(false);
    };

    const checkAccessToManage = () => {
      let jwt = AuthStore.getToken() as string;
      let decodedJwt = jwt_decode(jwt) as any;
      let roles = decodedJwt[
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      ] as string[];
      setCanManage(roles.includes("Admin") || roles.includes("Голова Регіону"));
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
    
    const handleView = async (id: number) => {
      hideDropdowns();
      try {
        let response = await AnnualReportApi.getById(id);
        setAnnualReport(response.data.annualReport);
        setShowAnnualReportModal(true);
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
    const showSuccess = (message: string) => {
      Modal.success({
        content: message,
      });
    };
    const handleEdit = (id: number) => {
      hideDropdowns();
      history.push(`/annualreport/edit/${id}`);
    };
    const handleConfirm = async (id: number) => {
      hideDropdowns();
      try {
        let response = await AnnualReportApi.confirm(id);
        let cityId = annualReports.find((item) => item.id == id)?.cityId;
        setAnnualReports(
          annualReports.map((item) => {
            if (
              item.id === id ||
              (item.id !== id && item.cityId === cityId && item.status === 1)
            ) {
              item.status++;
            }
            return item;
          })
        );
        showSuccess(response.data.message);
      } catch (error) {
        showError(error.message);
      }
    };

    const handleRemove = async (id: number) => {
      hideDropdowns(); 
      try {
        Modal.confirm({
          title: "Ви дійсно хочете видалити річний звіт?",
          icon: <ExclamationCircleOutlined/>,
          okText: 'Так, видалити',
          okType: 'danger',
          cancelText: 'Скасувати',
          maskClosable: true,
          async onOk() {
        let response = await AnnualReportApi.remove(id);
        setAnnualReports(annualReports?.filter((item) => item.id !== id));
        showSuccess(response.data.message);
          }
        });
      } catch (error) {
        showError(error.message);
      }
    };

    const handleCancel = async (id: number) => {
      hideDropdowns();
      try {
        let response = await AnnualReportApi.cancel(id);
        setAnnualReports(
          annualReports.map((item) => {
            if (item.id === id) {
              item.status--;
            }
            return item;
          })
        );
        showSuccess(response.data.message);
      } catch (error) {
        showError(error.message);
      }
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
              setAnnualReport(record);
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
        <UnconfirmedDropdown
          showDropdown={showUnconfirmedDropdown}
          record={annualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          onRemove={handleRemove}
        />
        <ConfirmedDropdown
          showDropdown={showConfirmedDropdown}
          record={annualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onCancel={handleCancel}
        />
        <SavedDropdown
          showDropdown={showSavedDropdown}
          record={annualReport}
          pageX={x}
          pageY={y}
          onView={handleView}
        />
      </ClickAwayListener>
      <AnnualReportInformation
        visibleModal={showAnnualReportModal}
        annualReport={annualReport}
        showError={showError}
        handleOk={() => setShowAnnualReportModal(false)}
      />
      <CitySelectModal
        visibleModal={showCitySelectModal}
        handleOk={() => setShowCitySelectModal(false)}
      />
        </div>
        
        )
}
