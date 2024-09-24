import React from 'react';

const DataText = ({ value, ...props }) => {
  return (
    <>
      <span className="cds--text-truncate--end" title={value}>
        {value}
      </span>
    </>
  );
};


export default DataText;