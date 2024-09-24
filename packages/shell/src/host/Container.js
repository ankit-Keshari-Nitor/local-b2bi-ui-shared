import React, { useEffect, useState } from 'react';
import { UserAvatar, NotificationNew } from '@carbon/icons-react';
import {
  Content,
  Header,
  HeaderContainer,
  HeaderMenu,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  HeaderPanel,
  SkipToContent,
  SideNav,
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
  Theme
} from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb';
import { BreadcrumbProvider } from '../components/Breadcrumb/BreadcrumbProvider';
import { ModalMessage } from '../components/messages/ModalMessage';
import { ModalPageContainer } from '../components/modal/ModalPage';
import { useAuth } from '../core/providers/AuthProvider';
import { useConfiguration } from '../core/providers/ConfigurationProvider';
import { useResource } from '../core/providers/ResourceProvider';
import { PageProvider } from '../core/providers/PageProvider';
import { ToastNotificationContainer } from '../components';
import { useApplicationInfo } from '../core/providers/ApplicationInfoProvider';
import { PageContainerProvider } from '../core/providers/PageContainerProvider';
import { SidePageContainer } from '../components/SidePage/SidePageContainer';

import './Container.scss';

const Container = (props) => {
  const { t } = useTranslation();
  const { sideNav, headerMenuList, switcherItemList, customHeaderPanelList } = useConfiguration();
  const { user, logout } = useAuth();
  const { defaultRoute, organizationContext, setDefaults } = useApplicationInfo();
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showCustomRightPanel, setShowCustomRightPanel] = useState(false);
  const [customHeaderPanel, setCustomHeaderPanel] = useState();
  const { hasAccess } = useResource();
  const [currentPage, setCurrentPage] = useState();
  const [activeRoute, setActiveRoute] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
    setShowCustomRightPanel(false);
  };

  const toggleCustomRightPanel = (customHeaderPanel) => {
    setShowRightPanel(false);
    setShowCustomRightPanel(!showCustomRightPanel);
    setCustomHeaderPanel(customHeaderPanel);
  };

  const getActiveRoute = (routes, path) => {
    let maxMatchLength = 0;
    let activeRoute = null;

    function findMatchingRoute(routes, path) {
      for (const route of routes) {
        const routePath = route.to;
        if (path.startsWith(routePath)) {
          const matchLength = routePath.length;
          if (matchLength > maxMatchLength) {
            maxMatchLength = matchLength;
            activeRoute = route;
          }
        }
        if (route.children) {
          findMatchingRoute(route.children, path);
        }
      }
    }

    findMatchingRoute(routes, path);
    return activeRoute;
  };

  const renderSideNav = (configList) => {
    return processResourceKey(configList)
      .filter((sideNav) => sideNav.isVisible || sideNav.isVisible === undefined)
      .map((navConfig) => {
        if (navConfig.to.startsWith(currentPage)) {
          if (navConfig.children?.length > 0) {
            return (
              <SideNavMenu data-testid={'secondary-nav-' + navConfig.to} defaultExpanded key={navConfig.to} renderIcon={navConfig.icon} title={t(navConfig.title)}>
                {renderSideNav(navConfig.children)}
              </SideNavMenu>
            );
          } else {
            return (
              <SideNavLink
                data-testid={'secondary-nav-' + navConfig.to}
                isActive={activeRoute && activeRoute.to === navConfig.to}
                key={navConfig.to}
                renderIcon={navConfig.icon}
                as={Link}
                to={navConfig.to}
                title={t(navConfig.title)}
              >
                {t(navConfig.label)}
              </SideNavLink>
            );
          }
        } else {
          return '';
        }
      });
  };

  const processResourceKey = (configList) => {
    const outputList = [];
    configList.forEach((config) => {
      if (!config.resourceKey || hasAccess(config.resourceKey)) {
        if (config.children?.length > 0) {
          const children = processResourceKey(config.children);
          if (children.length > 0) {
            outputList.push({ ...config, children });
          }
        } else {
          outputList.push({ ...config });
        }
      }
    });
    return outputList;
  };

  const renderHeaderMenu = (headerMenuList, isSideNavExpanded, onClickSideNavExpand) => {
    return processResourceKey(headerMenuList)
      .filter((headerMenu) => headerMenu.isVisible || headerMenu.isVisible === undefined)
      .map((headerMenu) => {
        if (headerMenu.children?.length > 0) {
          return (
            <HeaderMenu data-testid={'primary-nav-' + headerMenu.id} key={headerMenu.to} aria-label="" menuLinkName={t(headerMenu.title)}>
              {renderHeaderMenu(headerMenu.children)}
            </HeaderMenu>
          );
        } else {
          return (
            <HeaderMenuItem
              data-testid={'primary-nav-' + headerMenu.id}
              isActive={location.pathname.startsWith(headerMenu.to)}
              key={headerMenu.to}
              as={Link}
              to={headerMenu.to}
              onClick={() => {
                setCurrentPage(headerMenu.to);
                if (!isSideNavExpanded) {
                  onClickSideNavExpand();
                }
              }}
            >
              {t(headerMenu.label)}
            </HeaderMenuItem>
          );
        }
      });
  };

  useEffect(() => {
    const paths = location.pathname.split('/');
    if (paths.length === 2 && paths[1].length === 0) {
      navigate(defaultRoute);
      setCurrentPage(defaultRoute);
    } else {
      setCurrentPage('/' + paths[1]);
    }

    setDefaults();
  }, []);

  useEffect(() => {
    const paths = location.pathname.split('/');
    if (paths.length === 2 && paths[1].length === 0) {
      setCurrentPage(defaultRoute);
    } else {
      setCurrentPage('/' + paths[1]);
    }
    setActiveRoute(getActiveRoute(sideNav, location.pathname));
  }, [location, defaultRoute]);

  useEffect(() => {
    const paths = location.pathname.split('/');
    if (paths.length === 2 && paths[1].length === 0) {
      navigate(defaultRoute);
      setCurrentPage(defaultRoute);
    } else {
      setCurrentPage('/' + paths[1]);
    }
  }, [defaultRoute]);

  return (
    <>
      {organizationContext && (
        <BreadcrumbProvider>
          <div className="container">
            <HeaderContainer
              render={({ isSideNavExpanded, onClickSideNavExpand }) => (
                <>
                  <Theme theme="g100">
                    <Header aria-label={t('productName')} className="b2bi--app-header">
                      <SkipToContent />
                      <HeaderMenuButton data-testid="side-nav-toggle-button" aria-label="Open menu" isCollapsible onClick={onClickSideNavExpand} isActive={isSideNavExpanded} />
                      <HeaderName as={Link} to="#" prefix={t('appPrefix')}>
                        {t('appName')}
                      </HeaderName>
                      <HeaderNavigation aria-label={t('productName')}>{renderHeaderMenu(headerMenuList, isSideNavExpanded, onClickSideNavExpand)}</HeaderNavigation>
                      <HeaderGlobalBar>
                        <HeaderGlobalAction aria-label="Notifications" className="notifications">
                          <NotificationNew size={24} />
                        </HeaderGlobalAction>
                        {customHeaderPanelList &&
                          customHeaderPanelList.map((customHeaderPanel) => (
                            <HeaderGlobalAction name={customHeaderPanel.id} aria-label={customHeaderPanel.title} onClick={() => toggleCustomRightPanel(customHeaderPanel)}>
                              <customHeaderPanel.icon size={24} />
                            </HeaderGlobalAction>
                          ))}
                        <HeaderGlobalAction aria-label={t('shell:userProfile')} onClick={toggleRightPanel}>
                          <UserAvatar size={24} />
                        </HeaderGlobalAction>
                      </HeaderGlobalBar>
                      <Theme className="h-inherit" theme="white">
                        <SideNav aria-label="Side navigation" isPersistent={false} expanded={isSideNavExpanded}>
                          <SideNavItems>{renderSideNav(sideNav)}</SideNavItems>
                        </SideNav>
                      </Theme>
                      <HeaderPanel aria-label="Header Panel" expanded={showRightPanel} className="cds--header-panel--auto-height">
                        {/*<Button onClick={() => logout()}>Sign out</Button>*/}
                        <Switcher aria-label="Switcher Container" expanded={showRightPanel}>
                          {switcherItemList
                            .filter((switcherItem) => hasAccess(switcherItem.resourceKey))
                            .filter((switcherItem) => switcherItem.isVisible || switcherItem.isVisible === undefined)
                            .map((switcherItem) =>
                              switcherItem.divider ? (
                                <SwitcherDivider key={switcherItem.id} />
                              ) : (
                                <SwitcherItem
                                  key={switcherItem.id}
                                  aria-label={switcherItem.ariaLabel}
                                  onClick={() => {
                                    if (switcherItem.navigateTo) {
                                      navigate(switcherItem.navigateTo);
                                    } else {
                                      switcherItem.onAction && switcherItem.onAction();
                                    }
                                    setShowRightPanel(false);
                                  }}
                                >
                                  {switcherItem.content !== undefined ? (
                                    switcherItem.content
                                  ) : (
                                    <>
                                      {switcherItem.icon && <div className="cds--switcher__icon cds--switcher__icon--small">{<switcherItem.icon></switcherItem.icon>}</div>}
                                      <span className="cds--switcher__link-text">{switcherItem.label}</span>
                                    </>
                                  )}
                                </SwitcherItem>
                              )
                            )}
                        </Switcher>
                      </HeaderPanel>
                      <HeaderPanel
                        aria-label={customHeaderPanel ? customHeaderPanel.title : ''}
                        expanded={showCustomRightPanel}
                        className={customHeaderPanel && customHeaderPanel.panelClassName}
                      >
                        {customHeaderPanel ? <customHeaderPanel.content onClose={() => toggleCustomRightPanel(customHeaderPanel)} /> : <></>}
                      </HeaderPanel>
                    </Header>
                  </Theme>
                  <Content className={isSideNavExpanded ? 'main-content sidenav-expanded' : 'main-content'}>
                    <Theme className="h-inherit" theme="g10">
                      <PageProvider>
                        <section className="h-inherit main-section">
                          <section className="shell-breadscrumb-container">
                            <Breadcrumb />
                          </section>
                          <section className="shell-page-content">
                            <PageContainerProvider>
                              <Outlet />
                            </PageContainerProvider>
                            <ModalMessage></ModalMessage>
                            <ModalPageContainer></ModalPageContainer>
                          </section>
                        </section>
                        <section className="h-inherit side-section">
                          <SidePageContainer>Side Page content</SidePageContainer>
                        </section>
                        <section className="shell-toast-container">
                          <ToastNotificationContainer></ToastNotificationContainer>
                        </section>
                      </PageProvider>
                    </Theme>
                  </Content>
                </>
              )}
            />
          </div>
        </BreadcrumbProvider>
      )}
    </>
  );
};

export { Container };
