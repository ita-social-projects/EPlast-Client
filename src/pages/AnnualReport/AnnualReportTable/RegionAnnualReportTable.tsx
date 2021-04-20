import { Modal, Table } from "antd";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import regionsApi, {getSearchedRegionsReports} from "../../../api/regionsApi";
import AuthStore from "../../../stores/AuthStore";
import ConfirmedRegionDropdown from "./DropdownsForRegionReports/ConfirmedDropdown/ConfirmedRegionDropdown";
import RegionAnnualReportInformation from "./RegionAnnualReportInformation";
import Spinner from "../../Spinner/Spinner";

interface props{
    columns:any;
    searchedData:any;
    sortKey: any;
}

export const RegionAnnualReportTable=({columns,searchedData, sortKey}:props)=>{
    const [regionAnnualReport, setRegionAnnualReport] = useState(Object);
    const [regionAnnualReports, setRegionsAnnualReports]= useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [currentSearchedData, setCurrentSearchedData] = useState<string>();
    const [showConfirmedRegionDropdown, setShowConfirmedRegionDropdown] = useState<boolean>(false);
    const [showRegionAnnualReportModal, setShowRegionAnnualReportModal] = useState<boolean>(false);
    const [canManage, setCanManage] = useState<boolean>(false);
    const [isLoading, setIsLoading]=useState(false);

    useEffect(() => {
        if(currentSearchedData!=searchedData){
            setCurrentSearchedData(searchedData);
            setPage(1);
        }
        fetchRegionAnnualReports();
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
                            showDropdown();
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
        handleOk={() => setShowRegionAnnualReportModal(false)}
      />
    </div>
    )
}