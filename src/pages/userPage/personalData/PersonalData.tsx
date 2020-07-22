import React from 'react';
import Menu from '../Menu/Menu';
import styles from './PersonalData.module.css';
import UserFields from './UserFields';
import EditUserPage from '../EditUserPage/EditUserPage';

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
          
          <UserFields />
        </div>
      ) : specify === 'edit' ?(
        <div className={styles.content}>
          <EditUserPage />
        </div>
      ) : (
            <div className={styles.content}>
              <EditUserPage />
            </div>
          )}
    </div>
  );
}
