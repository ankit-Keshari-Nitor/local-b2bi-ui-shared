import React from 'react';
import { ToastNotification } from '@carbon/react';
import { useNotification } from '../../core';
import './ToastNotificationContainer.scss';
import { useTranslation } from 'react-i18next';

const ToastNotificationContainer = () => {
  const { toastMessage, closeToastMessage } = useNotification();
  const { t } = useTranslation();

  return (
    <>
      {toastMessage.length > 0 && (
        <div className="shell-toast-notication-container">
          {toastMessage.map((message) => (
            <ToastNotification
              key={message.id}
              aria-label={t('shell:notification.close_arialabel')}
              caption={message.caption}
              kind={message.kind}
              onClose={() => {
                closeToastMessage(message.id);
              }}
              onCloseButtonClick={function noRefCheck() {}}
              role={message.role}
              statusIconDescription={t('shell:notification.statusIconDescription')}
              subtitle={message.subtitle}
              timeout={10000}
              title={message.title}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ToastNotificationContainer;
