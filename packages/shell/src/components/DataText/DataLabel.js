import React from 'react';

const DataLabel = ({ labelText, value, ...props }) => {
  return (
    <>
      <div className="sfg--datalabel">
        {labelText && <span className="sfg--preview--key">{labelText}</span>}
        {value && <span className="sfg--preview--value">{value}</span>}
      </div>
    </>
  );
};

export { DataLabel };
