import React from 'react';
import { Avatar, Progress } from 'antd';
import styles from './PersonalData.module.css';

export default function () {
  return (
    <div className={styles.leftPartWrapper}>
      <Avatar size={256} src="https://eplast.azurewebsites.net/images/Users/374756d8-8f87-48df-ab20-b268842392be.jpg" />
      <p className={styles.statusText}>323 дні і Василь Хартманє Пластун:)</p>
      <Progress
        type="circle"
        className={styles.progressBar}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        percent={87}
      />
    </div>
  );
}