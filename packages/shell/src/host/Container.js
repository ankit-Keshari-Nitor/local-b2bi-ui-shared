import React, { useEffect, useState } from 'react';
import { UserAvatar, Enterprise } from '@carbon/icons-react';
import {
  Button,
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
import { ModalMessage } from '../components/messages/ModalMessage';
import { ModalPageContainer } from '../components/modal/ModalPage';
import { useAuth } from '../core/providers/AuthProvider';
import { useConfiguration } from '../core/providers/ConfigurationProvider';
import { useResource } from '../core/providers/ResourceProvider';
import { PageProvider } from '../core/providers/PageProvider';
import { ToastNotificationContainer } from '../components';
import { useApplicationInfo } from '../core/providers/ApplicationInfoProvider';

import './Container.scss';

const Container = (props) => {
  const { t } = useTranslation();
  const { sideNav, headerMenuList } = useConfiguration();
  const { user, logout } = useAuth();
  const { appDetails, setAppDetails } = useApplicationInfo();
  const [showRightPanel, setShowRightPanel] = useState(false);
  const { hasAccess } = useResource();
  const [currentPage, setCurrentPage] = useState();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleRightPanel = () => {
    setShowRightPanel(!showRightPanel);
  };

  const renderSideNav = (configList) => {
    return processResourceKey(configList).map((navConfig) => {
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
              isActive={location.pathname.startsWith(navConfig.to)}
              key={navConfig.to}
              renderIcon={navConfig.icon}
              as={Link}
              to={navConfig.to}
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
    return processResourceKey(headerMenuList).map((headerMenu) => {
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
      navigate(appDetails.defaultRoute);
      setCurrentPage(appDetails.defaultRoute);
    } else {
      setCurrentPage('/' + paths[1]);
    }

    const appContextStr = window.sessionStorage.getItem('appContext');
    let appContext = {};
    if (appContextStr !== '' && appContextStr !== null) {
      appContext = JSON.parse(appContextStr);
    }

    setAppDetails({
      ...appDetails,
      context: appContext
    });
  }, []);

  return (
    <>
      {appDetails.context && (
        <div className="container">
          <HeaderContainer
            render={({ isSideNavExpanded, onClickSideNavExpand }) => (
              <>
                <Theme theme="g100">
                  <Header aria-label={t('productName')}>
                    <SkipToContent />
                    <HeaderMenuButton data-testid="side-nav-toggle-button" aria-label="Open menu" isCollapsible onClick={onClickSideNavExpand} isActive={isSideNavExpanded} />
                    <HeaderName as={Link} to="#" prefix={t('appPrefix')}>
                      {t('appName')}
                    </HeaderName>
                    <HeaderNavigation aria-label={t('productName')}>{renderHeaderMenu(headerMenuList, isSideNavExpanded, onClickSideNavExpand)}</HeaderNavigation>
                    <HeaderGlobalBar>
                      <HeaderGlobalAction aria-label="Organization Context" className="user-profile">
                        <Enterprise size={24} />
                        &nbsp;
                        <div className="user-details">
                          <div>{appDetails.context.organization?.organizationName}</div>
                        </div>
                        &nbsp;
                      </HeaderGlobalAction>
                      <HeaderGlobalAction aria-label={t('shell:userProfile')} className="user-profile" onClick={toggleRightPanel}>
                        <UserAvatar size={24} />
                        <div className="user-details">
                          <div>{user.userName || user.username}</div>
                          <div>{user.lastLoggedIn} (UTC 5:30)</div>
                        </div>
                      </HeaderGlobalAction>
                    </HeaderGlobalBar>
                    <Theme className="h-inherit" theme="white">
                      <SideNav aria-label="Side navigation" isPersistent={false} expanded={isSideNavExpanded}>
                        <SideNavItems>{renderSideNav(sideNav)}</SideNavItems>
                      </SideNav>
                    </Theme>
                    <HeaderPanel aria-label="Header Panel" expanded={showRightPanel}>
                      {/*<Button onClick={() => logout()}>Sign out</Button>*/}
                      <Switcher aria-label="Switcher Container" expanded={showRightPanel}>
                        <SwitcherItem aria-label="Link 1" href="#">
                          <div>{user.userName || user.username}</div>
                          <div>(Administrator)</div>
                        </SwitcherItem>
                        <SwitcherDivider />
                        <SwitcherItem href="#" aria-label="Link 2">
                          Change Password
                        </SwitcherItem>
                        <SwitcherItem aria-label="Link 3" onClick={() => logout()}>
                          Sign out
                        </SwitcherItem>
                        <SwitcherItem href="#" aria-label="Link 5">
                          Preferences
                        </SwitcherItem>
                        <SwitcherItem
                          aria-label="Link 6"
                          onClick={() => {
                            navigate('/manage/switchorganization');
                            setShowRightPanel(false);
                          }}
                        >
                          Switch Organization
                        </SwitcherItem>
                        <SwitcherDivider />
                        <SwitcherItem href="#" aria-label="Link 4">
                          Help
                        </SwitcherItem>
                        <SwitcherItem href="#" aria-label="Link 6">
                          Contact Support
                        </SwitcherItem>
                      </Switcher>
                    </HeaderPanel>
                  </Header>
                </Theme>
                <Content className={isSideNavExpanded ? 'main-content sidenav-expanded' : 'main-content'}>
                  <Theme className="h-inherit" theme="g10">
                    <section className="h-inherit main-section">
                      <section className="shell-breadscrumb-container">
                        <Breadcrumb />
                      </section>
                      <section className="shell-page-content">
                        <PageProvider>
                          <Outlet />
                          <ModalMessage></ModalMessage>
                          <ModalPageContainer></ModalPageContainer>
                        </PageProvider>
                      </section>
                    </section>
                    <section class="shell-toast-container">
                      <ToastNotificationContainer></ToastNotificationContainer>
                    </section>
                  </Theme>
                </Content>
              </>
            )}
          />
        </div>
      )}
    </>
  );
};

export { Container };
