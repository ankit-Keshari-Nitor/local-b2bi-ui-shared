import React from 'react';
import { Layer } from '@carbon/react';

const PageHeader = ({ title, description, ...props }) => {
  return (
    <>
      <Layer className="page-header-container">
        <div className="cds--data-table-header">
          <h4 className="cds--data-table-header__title">{title}</h4>
          <p className="cds--data-table-header__description">{description}</p>
        </div>
      </Layer>
    </>
  );
};

export { PageHeader };
