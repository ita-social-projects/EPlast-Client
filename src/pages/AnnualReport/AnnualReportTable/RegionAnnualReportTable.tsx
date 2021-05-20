import { Modal, Table } from "antd";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import regionsApi, {getSearchedRegionsReports} from "../../../api/regionsApi";
import AuthStore from "../../../stores/AuthStore";
import ConfirmedRegionDropdown from "./DropdownsForRegionReports/ConfirmedDropdown/ConfirmedRegionDropdown";
import RegionAnnualReportInformation from "./RegionAnnualReportInformation";
import Spinner from "../../Spinner/Spinner";
import notificationLogic from "../../../components/Notifications/Notification";
import SavedRegionDropdown from "./DropdownsForRegionReports/SavedDropdown/SavedRegionDropdown";
import UnconfirmedRegionDropdown from "./DropdownsForRegionReports/UnconfirmedDropdown/UnconfirmedRegionDropdown";
import { successfulEditAction, tryAgain } from "../../../components/Notifications/Messages";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface props{
    columns:any;
    searchedData:any;
    sortKey: any;
}

interface regionReport{
    count: number,
    date: Date,
    id: number,
    regionName: string,
    regionId: number,
    status: number,
    total: number
};

export const RegionAnnualReportTable=({columns,searchedData, sortKey}:props)=>{
    const [regionAnnualReport, setRegionAnnualReport] = useState(Object);
    const [regionAnnualReports, setRegionsAnnualReports]= useState<regionReport[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [isAdmin, setIsAdmin] = useState<boolean>();
    const [currentSearchedData, setCurrentSearchedData] = useState<string>();
    const [showConfirmedRegionDropdown, setShowConfirmedRegionDropdown] = useState<boolean>(false);
    const [showUnconfirmedRegionDropdown, setShowUnconfirmedRegionDropdown] = useState<boolean>(false);
    const [showSavedRegionDropdown, setShowSavedRegionDropdown] = useState<boolean>(false);
    const [showRegionAnnualReportModal, setShowRegionAnnualReportModal] = useState<boolean>(false);
    const [canManage, setCanManage] = useState<boolean>(false);
    const [isLoading, setIsLoading]=useState(false);

    useEffect(() => {
        if(currentSearchedData!=searchedData){
            setCurrentSearchedData(searchedData);
            setPage(1);
        }
        fetchRegionAnnualReports();
        checkAccessToManage();
    }, [searchedData, page, pageSize, sortKey]);


    const fetchRegionAnnualReports = async () => {
        setIsLoading(true)
        try {
            let response = await getSearchedRegionsReports(searchedData, page, pageSize, sortKey);
            setRegionsAnnualReports(response.data);
            setTotal(response.data[0]?.total);
            setCount(response.data[0]?.count);
        } catch (error) {
            showError(error.message);
        }finally {
            setIsLoading(false);
        }
    };

    const hideDropdowns = () => {
        setShowUnconfirmedRegionDropdown(false);
        setShowConfirmedRegionDropdown(false);
        setShowSavedRegionDropdown(false);
      };

      const showDropdown = (annualReportStatus: number) => {
        switch (annualReportStatus) {
          case 0:
            hideDropdowns();
            setShowUnconfirmedRegionDropdown(true);
            break;
          case 1:
            hideDropdowns();
            setShowConfirmedRegionDropdown(true);
            break;
          case 2:
            hideDropdowns();
            setShowSavedRegionDropdown(true);
            break;
        }
      };
        
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

          const handleEdit = (id: number) => {
            hideDropdowns();
            //history.push(`/annualreport/edit/${id}`);
          };

          const handleConfirm = async (id: number) => {
            hideDropdowns();
            try {
              let response = await regionsApi.confirm(id);
              let regionId = regionAnnualReports.find((item) => item.id === id)?.regionId;
              setRegionsAnnualReports(
                regionAnnualReports.map((item) => {
                  if (
                    item.id === id ||
                    (item.id !== id && item.regionId === regionId && item.status === 1)
                  ) {
                    item.status++;
                  }
                  return item;
                })
              );
              notificationLogic('success', successfulEditAction('Річний звіт', response.data.name));
            } catch (error) {
              notificationLogic("error", tryAgain);
            }
          };

          const handleRemove = async (id: number) => {
            hideDropdowns();
            try {
              Modal.confirm({
                title: "Ви дійсно хочете видалити річний звіт?",
                icon: <ExclamationCircleOutlined />,
                okText: 'Так, видалити',
                okType: 'danger',
                cancelText: 'Скасувати',
                maskClosable: true,
                async onOk() {
                  let response = await regionsApi.removeAnnualReport(id);
                  setRegionsAnnualReports(regionAnnualReports?.filter((item) => item.id !== id));
                  notificationLogic('success', successfulEditAction('Річний звіт', response.data.name));
                  setTotal(total - 1);
                  setCount(count - 1);
                }
              });
            } catch (error) {
              notificationLogic("error", tryAgain);
            }
          };

          const handleCancel = async (id: number) => {
            hideDropdowns();
            try {
              let response = await regionsApi.cancel(id);
              setRegionsAnnualReports(
                regionAnnualReports.map((item) => {
                  if (item.id === id) {
                    item.status--;
                  }
                  return item;
                })
              );
              notificationLogic('success', successfulEditAction('Річний звіт', response.data.name));
            } catch (error) {
              notificationLogic("error", tryAgain);
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
            setCanManage(roles.includes("Admin") || roles.includes("Голова Регіону") || roles.includes("Голова Округи"));
            setIsAdmin(roles.includes("Admin"));
          };

    const handlePageChange = (page: number) => {
        hideDropdowns();
        setPage(page);
    };

    const handleSizeChange = (page: number, pageSize: number = 10) => {
        hideDropdowns();
        setPage(page);
        setPageSize(pageSize);
    };
      
    return (  
    <div>
        {isLoading? (<Spinner/>):(<>
            <p style={{textAlign: "left"}}>
                {count? 'Знайдено '+count+'/'+total+' результатів' : 'За вашим запитом нічого не знайденого'}
            </p>
            <Table
                bordered
                rowKey="id"
                columns={columns}
                scroll={{ x: 1300 }}
                dataSource={regionAnnualReports}
                onRow={(regionRecord) => {
                    return {
                        onClick: () => {
                            hideDropdowns();
                        },
                        onContextMenu: (event) => {
                            event.preventDefault();
                            showDropdown(regionRecord.status);
                            setRegionAnnualReport(regionRecord);
                            setX(event.pageX);
                            setY(event.pageY - 200);
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
            />
        </>)}
        <ClickAwayListener onClickAway={hideDropdowns}>
        <UnconfirmedRegionDropdown
          showDropdown={showUnconfirmedRegionDropdown}
          regionRecord={regionAnnualReport}
          pageX={x}
          pageY={y}
          canManage={isAdmin!}
          onView={handleView}
          onEdit={handleEdit}
          onConfirm={handleConfirm}
          onRemove={handleRemove}
        />
        <ConfirmedRegionDropdown
          showDropdown={showConfirmedRegionDropdown}
          regionRecord={regionAnnualReport}
          pageX={x}
          pageY={y}
          canManage={canManage}
          onView={handleView}
          onCancel={handleCancel}
        />
        <SavedRegionDropdown
          showDropdown={showSavedRegionDropdown}
          regionRecord={regionAnnualReport}
          pageX={x}
          pageY={y}
          onView={handleView}
        />
      <RegionAnnualReportInformation
        visibleModal={showRegionAnnualReportModal}
        regionAnnualReport={regionAnnualReport}
        handleOk={() => setShowRegionAnnualReportModal(false)}
      />
      </ClickAwayListener>
    </div>
    )
}
