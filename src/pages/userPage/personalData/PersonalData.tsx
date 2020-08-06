import React from 'react';
import Menu from '../Menu/Menu';
import './PersonalData.less';
import UserFields from './UserFields';
import EditUserPage from '../EditUserPage/EditUserPage';
import Approvers from '../Approvers/Approvers';
import {useParams} from 'react-router-dom';


export default function (
  {
  match: {
    params: { specify },
  },
}: any) {
  const {userId}=useParams(); 
  return (
    <div className="mainContainer">
      <Menu id={userId}/>
      {specify === 'main' ? (
        <div className="content">
          <UserFields />
        </div>
      ) : specify === 'edit' ?(
        <div className="content">
          <EditUserPage />
        </div>
      ) : specify === 'approvers' ?(
        <div className="content">
          <Approvers />
        </div>
      ) : (
            <div className="content">
              <EditUserPage />
            </div>
          )}
    </div>
  );
}
