import React from 'react';

const DataLabelWrapper = ({ children, labelText, value, ...props }) => {
  const elements = children ? (Array.isArray(children) ? children : [children]) : [];
  return (
    <>
      {labelText && <span className="sfg--preview-section--title">{labelText}</span>}
      {elements?.length > 0 && <div className="sfg--preview-field">{elements.map((item) => item)}</div>}
    </>
  );
};

export { DataLabelWrapper };
