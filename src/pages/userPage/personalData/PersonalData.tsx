import React from 'react';
import Menu from '../Menu/Menu';
import styles from './PersonalData.module.css';
import AvatarAndProgress from './AvatarAndProgress';
import UserFields from './UserFields';
import EditUserPage from '../EditUserPage/EditUserPage';
import EditEvent from './EditEvent/EditEvent';

export default function ({
  match: {
    params: { specify },
  },
}: any) {
  return (
    <div className={styles.mainContainer}>
      <Menu />
      {specify === 'main' ? (
        <div className={styles.content}>
          <AvatarAndProgress />
          <UserFields />
        </div>
      ) : specify === 'editEvent' ?(
        <div className={styles.content}>
          <EditEvent />
        </div>
      ) : (
            <div className={styles.content}>
              <EditUserPage />
            </div>
          )}
    </div>
  );
}