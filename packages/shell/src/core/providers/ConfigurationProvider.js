import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ConfigurationContext = React.createContext();

const ConfigurationProvider = (props) => {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(props.locale);
  const [sideNav, setSideNav] = useState(props.sideNavConfig || []);
  const [headerMenuList, setHeaderMenuList] = useState(props.headerMenuList || []);
  const [switcherItemList, setSwitcherItemList] = useState(props.switcherItemList || []);
  const [customHeaderPanelList, setCustomHeaderPanelList] = useState();

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
    setHeaderMenuList,
    switcherItemList,
    setSwitcherItemList,
    customHeaderPanelList,
    setCustomHeaderPanelList
  };
  return <ConfigurationContext.Provider value={value}>{props.children}</ConfigurationContext.Provider>;
};

const useConfiguration = () => {
  return React.useContext(ConfigurationContext);
};

export { ConfigurationContext, ConfigurationProvider, useConfiguration };
