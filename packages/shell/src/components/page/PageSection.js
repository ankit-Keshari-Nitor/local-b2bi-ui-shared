import React from 'react';
import { Layer } from '@carbon/react';

const PageSection = ({ title, subTitle, description, ...props }) => {
  return (
    <>
      <Layer className="page-section-container">
        {title && <p className="cds--section-title">{title}</p>}
        {subTitle && <p className="cds--section-sub-title">{subTitle}</p>}
        {description && <p className="cds--section-description">{description}</p>}
      </Layer>
    </>
  );
};

export { PageSection };
