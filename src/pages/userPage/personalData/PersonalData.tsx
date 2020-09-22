import React from 'react';
import Menu from '../Menu/Menu';
import './PersonalData.less';
import UserFields from './UserFields';
import EditUserPage from '../EditUserPage/EditUserPage';
import Approvers from '../Approvers/Approvers';
import ActiveMembership from '../ActiveMembership/ActiveMembership'
import EventUser from '../../Actions/ActionEvent/EventUser/EventUser';
import { useParams } from 'react-router-dom';
import Secretaries from '../Secretaries/SecretariesPage';



export default function (
  {
    match: {
      params: { specify },
    },
  }: any) {
  const { userId } = useParams();
  return (
    <div className="mainContainer">
      <Menu id={userId} />
      {specify === 'main' ? (
        <div className="content">
          <UserFields />
        </div>
      ) : specify === 'edit' ? (
        <div className="content">
          <EditUserPage />
        </div>
      ): specify === 'activeMembership' ? (
        <div className="content">
          <ActiveMembership />
        </div>
         ) : specify === 'secretaries' ? (
          <div className="content">
            <Secretaries />
          </div>
      ) : specify === 'eventuser' ? (
        <div className="content">
          <EventUser />
        </div>
      ) : specify === 'approvers' ? (
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
