import React from 'react';
import styles from './Notifications.module.css';

export default function () {

  return (
      <div className={styles.notificationWrapper}>
        <h1 className={styles.title}>Ваше запитання успішно надіслано</h1>
      </div>
  );
}
