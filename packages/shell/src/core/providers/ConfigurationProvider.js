import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConfigurationContext = React.createContext();

const ConfigurationProvider = (props) => {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(props.locale);
  const [sideNav, setSideNav] = useState(props.sideNavConfig || []);
  const [headerMenuList, setHeaderMenuList] = useState(props.headerMenuList || []);

  //i18n.changeLanguage(locale);
  const value = {
    locales: props.locales,
    locale: locale,
    updateLocale: (e) => {
      setLocale(e.target.value);
      i18n.changeLanguage(e.target.value);
    },
    sideNav,
    setSideNav,
    headerMenuList,
    setHeaderMenuList
  };
  return <ConfigurationContext.Provider value={value}>{props.children}</ConfigurationContext.Provider>;
};

const useConfiguration = () => {
  return React.useContext(ConfigurationContext);
};

export { ConfigurationContext, ConfigurationProvider, useConfiguration };
