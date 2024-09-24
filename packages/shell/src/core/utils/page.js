import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalUtil } from './modal';
import { NotificationUtil } from './notification';
import { useResource } from '../providers/ResourceProvider';
import { useSidePage } from '../../components';

const PageUtil = () => {
  const { t } = useTranslation();
  const modalUtil = ModalUtil();
  const notificationUtil = NotificationUtil();
  const { hasAccess } = useResource();
  const pageParams = useParams();
  const { setSidePageConfig } = useSidePage();

  t.optional = (...args) => {
    const value = t(...args);
    return t('shell:form.labels.optional', { value: value });
  };

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
      notificationUtil.showNotificationMessage('banner', parsedValue?.kind, parsedValue.message);
      localStorage.removeItem(key);
    }
  };

  const setStoredMessage = function (key, message) {
    localStorage.setItem(key, JSON.stringify(message));
  };

  const getSubsetJson = function (object, attributes) {
    function extractAttributes(obj, attrs) {
      const subset = {};
      for (const key in attrs) {
        if (attrs.hasOwnProperty(key)) {
          if (typeof attrs[key] === 'object') {
            if (obj.hasOwnProperty(key)) {
              subset[key] = extractAttributes(obj[key], attrs[key]);
            }
          } else {
            if (obj.hasOwnProperty(key)) {
              subset[key] = obj[key];
            }
          }
        }
      }
      return subset;
    }

    return extractAttributes(object, attributes);
  };

  const removeEmptyAttributes = function (obj) {
    const newObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          const nestedObj = removeEmptyAttributes(obj[key]);
          if (Object.keys(nestedObj).length !== 0) {
            newObj[key] = nestedObj;
          }
        } else if (obj[key] !== '' && obj[key] !== undefined) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  };

  const generateUniqueId = function (length = 16) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return Date.now().toString(16) + id;
  };
  const showSidePage = (sidePage, data) => {
    return new Promise(function (sidePageResolve, sidePageReject) {
      setSidePageConfig({
        sidePage,
        data,
        onAction: (actionType, data) => {
          setSidePageConfig(undefined);
          sidePageResolve({ actionType, data });
        }
      });
    });
  };

  return {
    t: t,
    navigate: useNavigate(),
    pageParams: pageParams,
    hasAccess,
    callPageMethod,
    showStoredMessage,
    setStoredMessage,
    getSubsetJson,
    removeEmptyAttributes,
    generateUniqueId,
    showSidePage,
    ...modalUtil,
    ...notificationUtil
  };
};

export { PageUtil };
