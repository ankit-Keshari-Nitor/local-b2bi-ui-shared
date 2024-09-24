import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumb as CarbonBreadcrum, BreadcrumbItem, OverflowMenu, OverflowMenuItem } from '@carbon/react';
import { useApplicationInfo } from '../../core';
import { useBreadcrumbs } from './BreadcrumbProvider';

// TODO: Overflow text with ellipses for individual breadcrumb items

const Breadcrumb = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { homeRoute } = useApplicationInfo();
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <>
      <CarbonBreadcrum noTrailingSlash data-testid="breadcrumb">
        {homeRoute && (
          <BreadcrumbItem key={homeRoute.pathname} isCurrentPage={breadcrumbs.length === 0}>
            <Link to={homeRoute.pathname}>{homeRoute.breadcrumbLabel}</Link>
          </BreadcrumbItem>
        )}
        {breadcrumbs.map(({ breadcrumbLabel, pathname }, index, items) => {
          if (items.length < 5 || index < 2) {
            return (
              <BreadcrumbItem key={pathname} isCurrentPage={index === items.length - 1}>
                <Link to={pathname}>{breadcrumbLabel}</Link>
              </BreadcrumbItem>
            );
          } else {
            return <></>;
          }
        })}
        {breadcrumbs.length >= 5 && (
          <BreadcrumbItem key={'breadcrumb-overflow'} data-floating-menu-container>
            <OverflowMenu iconDescription={t('shell:breadcrumb.overflowmenu')} aria-label="Overflow menu in a breadcrumb">
              {breadcrumbs.map(({ breadcrumbLabel, pathname }, index, items) => {
                if (index >= 2 && index < items.length - 2) {
                  return (
                    <OverflowMenuItem
                      itemText={breadcrumbLabel}
                      onClick={() => {
                        navigate(pathname);
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
        {breadcrumbs.map(({ breadcrumbLabel, pathname }, index, items) => {
          if (items.length >= 5 && index >= items.length - 2) {
            return (
              <BreadcrumbItem key={pathname} isCurrentPage={index === items.length - 1}>
                <Link to={pathname}>{breadcrumbLabel}</Link>
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
