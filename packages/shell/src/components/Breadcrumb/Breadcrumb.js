import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Breadcrumb as CarbonBreadcrum, BreadcrumbItem } from '@carbon/react';
import {default as useBreadcrumbs} from 'use-react-router-breadcrumbs';
import { useRouter } from '../../core/providers/RouterProvider';

const Breadcrumb = (props) => {
  const { t } = useTranslation();
  const routes = useRouter();
  const breadcrumbs = useBreadcrumbs(routes);
  return (
    <>
      <CarbonBreadcrum noTrailingSlash data-testid="breadcrumb">
        {breadcrumbs.map(({ breadcrumb, match }, index, items) => (
          <BreadcrumbItem key={match.pathname} isCurrentPage={index === items.length - 1}>
            <Link to={match.pathname}>{t(breadcrumb.props.children)}</Link>
          </BreadcrumbItem>
        ))}
      </CarbonBreadcrum>
    </>
  );
};

export { Breadcrumb };
