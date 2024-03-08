import React from 'react';
import { DefinitionTooltip, Link } from '@carbon/react';

const TransformTableData = (rows, columnConfig, t) => {
  // on pophover show list of item
  const arrayLabel = (list) => {
    return (
      <div>
        {list.map((item, i) => {
          if (i > 0) {
            return (
              <div key={i} className="item-list">
                {item}
              </div>
            );
          }
        })}
      </div>
    );
  };
  // show cell as the + number value
  const arrayValue = (value, rowIndex, rowLength, columnIndex, columnLength) => {
    // TODO: Need to handle this position setting properly when row length < 10 or equivalent table height
    let colPos = 'right';
    if (columnIndex < 2) {
      colPos = 'right';
    } else if (columnIndex + 2 > columnLength) {
      colPos = 'left';
    } else {
      colPos = 'left';
    }

    let rowPos = 'top';
    if (rowIndex < 3) {
      rowPos = 'top';
    } else if (rowIndex + 3 > rowLength) {
      rowPos = 'bottom';
    } else {
      rowPos = 'bottom';
    }
    const pos = colPos + '-' + rowPos;
    return (
      <span>
        {' '}
        {value[0]}{' '}
        <DefinitionTooltip openOnHover definition={arrayLabel(value)} align={pos} className="tooltip-color">
          <Link>+ {value.length - 1}</Link>
        </DefinitionTooltip>{' '}
      </span>
    );
  };

  const getCellValue = function (row, path) {
    const keys = path.split('.');
    let result = row;
    for (const key of keys) {
      if (!result[key]) {
        result = '';
        break;
      }
      result = result[key];
    }
    return result;
  };

  const transformData = rows.map((row, rowIndex) => {
    const transformObj = { ...row };

    columnConfig.forEach((column, colIndex) => {
      if (column.displayType === 'link') {
        transformObj[column.value] = (
          <Link
            onClick={() => {
              column.onAction(row);
            }}
            data-testid={rowIndex + '-' + column.id}
          >
            {getCellValue(row, column.value)}
          </Link>
        );
      } else if (column.displayType === 'array-label') {
        let transformvalue = getCellValue(row, column.value);
        if (Array.isArray(transformvalue) && transformvalue.length > 1) {
          if (typeof transformvalue[0] === 'string') {
            transformvalue = arrayValue(transformvalue, rowIndex, row.length, colIndex, columnConfig.length);
          } else if (typeof transformvalue[0] === 'object') {
            transformvalue = arrayValue(
              transformvalue.map((value) => value[column.arrayKey]),
              rowIndex,
              row.length,
              colIndex,
              columnConfig.length
            );
          }
        } else {
          if (typeof transformvalue[0] === 'string') {
            transformvalue = transformvalue[0];
          } else if (typeof transformvalue[0] === 'object') {
            transformvalue = transformvalue[0][column.arrayKey];
          }
        }
        transformObj[column.value] = transformvalue;
      } else if (column.displayType === 'label') {
        if (column.translateKey) {
          transformObj[column.value] = t(column.translateKey + '.' + getCellValue(row, column.value));
        } else {
          transformObj[column.value] = getCellValue(row, column.value);
        }
      }
    });

    return transformObj;
  });
  return transformData;
};

export default TransformTableData;
