import React, { useEffect, useState, PropsWithRef } from "react";
import { Modal, Table} from 'antd';
import AuthStore from "../../../stores/AuthStore";
import jwt_decode from "jwt-decode";
import {
  cancelClubAnnualReport,
  confirmClubAnnualReport,
  getSearchedClubAnnualReports,
  getClubAnnualReportById,
  removeClubAnnualReport
} from "../../../api/clubsApi";
import ClubAnnualReportInformation from "./ClubAnnualReportInformation/ClubAnnualReportInformation";
import ClickAwayListener from "react-click-away-listener";
import UnconfirmedDropdown from "./DropdownsForClubAnnualReports/UnconfirmedDropdown/UnconfirmedDropdown";
import ConfirmedDropdown from "./DropdownsForClubAnnualReports/ConfirmedDropdown/ConfirmedDropdown";
import SavedDropdown from "./DropdownsForClubAnnualReports/SavedDropdown/SavedDropdown";
import{successfulConfirmedAction, successfulDeleteAction, successfulUpdateAction, tryAgain} from "../../../components/Notifications/Messages";
import notificationLogic from '../../../components/Notifications/Notification';
import { useHistory } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Spinner from "../../Spinner/Spinner";

interface props {
    columns: any;
    searchedData: any;
  }

  export const ClubAnnualReportTable =({columns, searchedData}:props)=>{
    const history = useHistory();
    const [clubAnnualReport, setClubAnnualReport] = useState(Object);
    const [clubAnnualReports, setClubAnnualReports] = useState(Array());
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [currentSearchedData, setCurrentSearchedData] = useState<string>();
    const [showUnconfirmedDropdown, setShowUnconfirmedDropdown] = useState<boolean>(false);
    const [showConfirmedDropdown, setShowConfirmedDropdown] = useState<boolean>(false);
    const [showSavedDropdown, setShowSavedDropdown] = useState<boolean>(false);
    const [canManage, setCanManage] = useState<boolean>(false);
    const [showClubAnnualReportModal, setShowClubAnnualReportModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading]=useState(false);

    useEffect(()=>{
      if(currentSearchedData!=searchedData){
        setCurrentSearchedData(searchedData);
        setPage(1);
      }
      fetchClubAnnualReports();
      checkAccessToManage();
    },[searchedData, page, pageSize]);

    const fetchClubAnnualReports = async () => {
      setIsLoading(true);
      try {
        let response = await getSearchedClubAnnualReports(searchedData, page, pageSize);
        setClubAnnualReports(response.data.clubAnnualReports);
        setTotal(response.data.clubAnnualReports[0]?.total);
        setCount(response.data.clubAnnualReports[0]?.count);
        setPage(1)
      } catch (error) {
        showError(error.message);
      }finally {
        setIsLoading(false);
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
    setCanManage(roles.includes("Admin"));
    };

    const handleClickAway = () => {
      setShowUnconfirmedDropdown(false);
      setShowConfirmedDropdown(false);
      setShowSavedDropdown(false);
    }

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

    const  renewPage = ()=>{
      window.location.reload(false);
    }

    const handleView = async (id:number) => {
      hideDropdowns();
      try {
        let response = await getClubAnnualReportById(id);
        setClubAnnualReport(response.data.annualreport);
        setShowClubAnnualReportModal(true);
      } catch (error)
      {
        if (error.response?.status === 400) {
          notificationLogic('error', tryAgain);
          history.goBack(); 
        };
      }
    }

    const handleCancel = async (id:number) => {
      hideDropdowns();
      setLoading(true);
      try {
        let response = await cancelClubAnnualReport(id);
        setClubAnnualReports(clubAnnualReports?.filter((item) => item.id !== id));
        notificationLogic('success', successfulUpdateAction ('Річний звіт', response.data.name));
        renewPage();
      } catch (error)
      {
        if (error.response?.status === 400) {
          notificationLogic('error', tryAgain);
          history.goBack(); 
        };
      }
    }

    const handleConfirm = async (id: number) => {
      hideDropdowns();
      setLoading(false);
      try {
        let response = await confirmClubAnnualReport(id);
        setClubAnnualReports(
          clubAnnualReports.map((item) => {
            if (
              item.id === id ||
              (item.id !== id && item.clubId === response.data.clubId && item.status === 1)
            ) {
              item.status++;
            }
            return item;
          })
        );
        notificationLogic('success', successfulConfirmedAction ('Річний звіт', response.data.name));
        renewPage();
      } catch (error) {
        notificationLogic('error', tryAgain);
        history.goBack(); 
      }
    }

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
        let response = await removeClubAnnualReport(id);
        setClubAnnualReports(clubAnnualReports?.filter((item) => item.id !== id));
        notificationLogic('success', successfulDeleteAction ('Річний звіт', response.data.name));
        renewPage();
      }
        });
      } catch (error) {
        notificationLogic('error', tryAgain);
        history.goBack(); 
      }
    };

    const handleEdit = (id: number) => {
      hideDropdowns();
      history.push(`/club/editClubAnnualReport/${id}`);
    };

    const handlePageChange = (page: number) => {
      setPage(page);
    };

    const handleSizeChange = (page: number, pageSize: number = 10) => {
      setPage(page);
      setPageSize(pageSize);
    };
    
    return(
        <div>
          {isLoading? (<Spinner/>):(
              <>
                <p style={{textAlign: "left"}}>
                  {count? 'Знайдено '+count+'/'+total+' результатів' : 'За вашим запитом нічого не знайденого'}
                </p>
                <Table
              bordered
              rowKey="id"
              columns={columns}
              scroll={{ x: 1300 }}
              dataSource={clubAnnualReports}
              rowClassName={(record, index) => ((record.canManage === true && !canManage) ? "manageRow" : '')}
              onRow={(record) => {
                return {
                  onClick: () => {hideDropdowns();},
                  onContextMenu: (event) => {
                    event.preventDefault();
                    showDropdown(record.status);
                    setClubAnnualReport(record);
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
                current: page,
                pageSize: pageSize,
                total: count,
                showLessItems: true,
                responsive: true,
                showSizeChanger: true,
                onChange: (page) => handlePageChange(page),
                onShowSizeChange: (page, size) => handleSizeChange(page, size),
              }}
          /></>)}
<ClickAwayListener onClickAway={hideDropdowns}>
        <UnconfirmedDropdown
          showDropdown={showUnconfirmedDropdown}
          record={clubAnnualReport}
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
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onCancel={handleCancel}
        />
        <SavedDropdown
          showDropdown={showSavedDropdown}
          record={clubAnnualReport}
          pageX={x}
          pageY={y}
          onView={handleView}
        />
      </ClickAwayListener>
      <ClubAnnualReportInformation
        visibleModal={showClubAnnualReportModal}
        clubAnnualReport={clubAnnualReport}
        handleOk={() => setShowClubAnnualReportModal(false)}
      />
  </div>
    )
  }
