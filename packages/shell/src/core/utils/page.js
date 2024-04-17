import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { ModalUtil } from './modal';
import { NotificationUtil } from './notification';
import { useResource } from '../providers/ResourceProvider';

const PageUtil = () => {
  const { t } = useTranslation();
  const modalUtil = ModalUtil();
  const notificationUtil = NotificationUtil();
  const { hasAccess } = useResource();
  const pageParams = useParams();

  const callPageMethod = function (page, methodName, args) {
    if (typeof page[methodName] === 'function') {
      return page[methodName].apply(page, args);
    } else {
      return;
    }
  };

  const showStoredMessage = function (key) {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      const parsedValue = JSON.parse(storedValue);
      notificationUtil.showNotificationMessage('banner',parsedValue?.kind, parsedValue.message);
      localStorage.removeItem(key);
    }
  };

  const setStoredMessage = function (key, message) {
    localStorage.setItem(key, JSON.stringify(message));
  }

  return {
    t: t,
    navigate: useNavigate(),
    pageParams: pageParams,
    hasAccess,
    callPageMethod,
    showStoredMessage,
    setStoredMessage,
    ...modalUtil,
    ...notificationUtil
  };
};

export { PageUtil };
