import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";
import ActionCard from '../ActionCard/ActionCard';
import eventsApi from "../../api/eventsApi";
import {Pagination} from "antd";
import classes from './Actions.module.css';
import Spinner from '../Spinner/Spinner';

const Actions = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [actions, setActions] = useState<any>(
      {
        events:[{
        eventCategoryId:'',
        eventCategoryName:''
        }],
        total:''
      } 
    );
    const {typeId} = useParams();
    const [page, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal]= useState<number>(0);

    const handlePageNumberChange = (pageNumber: number) => {
      setPageNumber(pageNumber);
    }
  
    const handlePageSizeChange = (pageNumber: number, pageSize: number = 10) => {
      setPageNumber(pageNumber);
      setPageSize(pageSize);
    }

    const getCategories = async () => {
      const response = await eventsApi.getCategoriesByPage(typeId,page,pageSize);
      setTotal(response.data.total);
      setActions(response.data.events);
      setLoading(true);
    };

    useEffect(() => {
        getCategories();
    }, [page, pageSize]);

    return  loading === false ? (
      <Spinner />
    ) : (
        <div className={classes.background}>
          <h1 className={classes.mainTitle}>Категорії</h1>
          <div className={classes.actionsWrapper}>
            { 
            actions.map((item: any) => (
                <ActionCard item={item} eventTypeId={typeId} key={item.eventCategoryId}/>
            ))
            }
          </div>
          <div className={classes.pagination}>
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              onChange={(pageNumber) => handlePageNumberChange(pageNumber)}
              onShowSizeChange={(pageNumber, pageSize) => handlePageSizeChange(pageNumber, pageSize)}
            />
          </div> 
        </div>
    )   
}
export default Actions;
