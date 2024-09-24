import React from 'react';
import { InlineNotification } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useApplication } from '../../core';

const NotificationMessage = () => {
  const { notificationMessage, setNotificationMessage } = useApplication();
  const { t } = useTranslation();
  return (
    <>
      {notificationMessage && (
        <InlineNotification
          aria-label={t('shell:notification.close_aria')}
          className="sfg--page-notification"
          kind={notificationMessage.kind}
          lowContrast
          onClose={function noRefCheck() {}}
          onCloseButtonClick={function noRefCheck() {
            setNotificationMessage(null);
          }}
          role={notificationMessage.role}
          statusIconDescription={t('shell:notification.statusIconDescription')}
          subtitle={notificationMessage.subtitle}
          title={notificationMessage.title}
        />
      )}
    </>
  );
};


export { NotificationMessage };