import React from 'react';
import { Link, useNavigate, useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumb as CarbonBreadcrum, BreadcrumbItem, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { default as useBreadcrumbs } from 'use-react-router-breadcrumbs';
import { useRouter } from '../../core/providers/RouterProvider';

// TODO: Overflow text with ellipses for individual breadcrumb items

const Breadcrumb = (props) => {
  const { t } = useTranslation();
  const routes = useRouter();
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs(routes);
  return (
    <>
      <CarbonBreadcrum noTrailingSlash data-testid="breadcrumb">
        {breadcrumbs.map(({ breadcrumb, match }, index, items) => {
          if (items.length < 5 || index < 2) {
            return (
              <BreadcrumbItem key={match.pathname} isCurrentPage={index === items.length - 1}>
                <Link to={match.pathname}>{t(breadcrumb.props.children)}</Link>
              </BreadcrumbItem>
            );
          } else {
            return <></>;
          }
        })}
        {breadcrumbs.length >= 5 && (
          <BreadcrumbItem data-floating-menu-container>
            <OverflowMenu iconDescription={t('shell:breadcrumb.overflowmenu')} aria-label="Overflow menu in a breadcrumb">
              {breadcrumbs.map(({ breadcrumb, match }, index, items) => {
                if (index >= 2 && index < items.length - 2) {
                  return (
                    <OverflowMenuItem
                      key={match.pathname}
                      itemText={t(breadcrumb.props.children)}
                      onClick={() => {
                        navigate(match.pathname);
                      }}
                    ></OverflowMenuItem>
                  );
                } else {
                  return <></>;
                }
              })}
            </OverflowMenu>
          </BreadcrumbItem>
        )}
        {breadcrumbs.map(({ breadcrumb, match }, index, items) => {
          if (items.length >= 5 && index >= items.length - 2) {
            return (
              <BreadcrumbItem key={match.pathname} isCurrentPage={index === items.length - 1}>
                <Link to={match.pathname}>{t(breadcrumb.props.children)}</Link>
              </BreadcrumbItem>
            );
          } else {
            return <></>;
          }
        })}
      </CarbonBreadcrum>
    </>
  );
};

export { Breadcrumb };
