import { usePage } from '../providers/PageProvider';
import { useNotification } from '../providers';
import { useTranslation } from 'react-i18next';

const role = {
  success: 'status',
  error: 'alert',
  warning: 'alert',
  info: 'log'
};

const title = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Information'
};
// role = 'alert' 'log' 'status'
// kind = 'error' 'info' 'info-square' 'success' 'warning' 'warning-alt'

const NotificationUtil = () => {
  const { setNotificationMessage } = usePage();
  const { showToastMessage } = useNotification();
  const { t } = useTranslation();

  const showNotificationMessage = (type, kind, message) => {
    const notificationConfig = {
      id: Date.now() + type + kind + message,
      kind: kind,
      role: role[kind],
      title: title[kind],
      subtitle: message,
      caption: t('shell:notification.timestamp', {
        timestamp: new Date(Date.now()).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      })
    };

    if (type === 'banner') {
      setNotificationMessage(notificationConfig);
    } else if (type === 'toast') {
      showToastMessage(notificationConfig);
    } else {
      console.log('Please pass valid notification type banner|toast');
    }
  };

  return {
    showNotificationMessage
  };
};

export { NotificationUtil };
