import { usePage } from '../providers/PageProvider';

const role = {
  success: 'status',
  error: 'alert',
  warning: 'alert',
  info: 'log'
};

// role = 'alert' 'log' 'status'
// kind = 'error' 'info' 'info-square' 'success' 'warning' 'warning-alt'

const NotificationUtil = () => {
  const { setNotificationMessage } = usePage();

  const showNotificationMessage = (kind, message) => {
    const notificationConfig = {
      kind: kind,
      role: role[kind],
      title: '',
      subtitle: message
    };

    setNotificationMessage(notificationConfig);
  };

  return {
    showNotificationMessage
  };
};

export { NotificationUtil };
