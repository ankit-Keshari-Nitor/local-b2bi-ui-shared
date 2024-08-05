import React from 'react';
import { Button, DefinitionTooltip, Link, Tag, Tooltip } from '@carbon/react';
import { Information } from '@carbon/icons-react';

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

  const getTooltipPosition = (rowIndex, columnIndex, rowLength, columnLength) => {
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
    return colPos + '-' + rowPos;
  };

  // show cell as the + number value
  const arrayValue = (value, rowIndex, rowLength, columnIndex, columnLength) => {
    const pos = getTooltipPosition(rowIndex, columnIndex, rowLength, columnLength);
    return (
      <span>
        {value[0]}
        <DefinitionTooltip openOnHover definition={arrayLabel(value)} align={pos} className="tooltip-color">
          <Link>+ {value.length - 1}</Link>
        </DefinitionTooltip>
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
      let columnAttributes = {};
      if (column.getAttributes) {
        columnAttributes = column.getAttributes(row, getCellValue(row, column.value), columnConfig);
      }

      if (column.displayType === 'button') {
        transformObj[column.value] = (
          <Button
            size="md"
            {...column.attributes}
            {...columnAttributes}
            onClick={() => {
              column.onAction(row);
            }}
          ></Button>
        );
      } else if (column.displayType === 'link') {
        transformObj[column.value] = (
          <Link
            onClick={() => {
              column.onAction(row);
            }}
            {...columnAttributes}
            data-testid={rowIndex + '-' + column.id}
          >
            <span className="cds--text-truncate--end" title={column.data?.linkText ? t(column.data.linkText) : getCellValue(row, column.value)}>
              {column.data?.linkText ? t(column.data.linkText) : getCellValue(row, column.value)}
            </span>
          </Link>
        );
      } else if (column.displayType === 'array-text') {
        let transformvalue = getCellValue(row, column.value);
        if (Array.isArray(transformvalue) && transformvalue.length > 1) {
          if (typeof transformvalue[0] === 'string') {
            transformvalue = transformvalue.join(', ');
          } else if (typeof transformvalue[0] === 'object') {
            transformvalue = transformvalue.map((value) => value[column.arrayKey]).join(', ');
          }
        } else {
          if (typeof transformvalue[0] === 'string') {
            transformvalue = transformvalue[0];
          } else if (typeof transformvalue[0] === 'object') {
            transformvalue = transformvalue[0][column.arrayKey];
          }
        }
        transformObj[column.value] = (
          <>
            <div className="cds--text-truncate--end" title={transformvalue}>
              {transformvalue}{' '}
            </div>
          </>
        );
      } else if (column.displayType === 'array-label') {
        let transformvalue = getCellValue(row, column.value);
        if (Array.isArray(transformvalue) && transformvalue.length > 1) {
          if (typeof transformvalue[0] === 'string') {
            transformvalue = arrayValue(transformvalue, rowIndex, rows.length, colIndex, columnConfig.length);
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
      } else if (column.displayType === 'label' || column.displayType === 'tag-label' || column.displayType === 'icon-label' || column.displayType === 'label-icon') {
        let displayData = column.translateKey ? t(column.translateKey + '.' + getCellValue(row, column.value)) : getCellValue(row, column.value);
        if (column.displayType === 'tag-label') {
          transformObj[column.value] = (
            <Tag size="sm" type={columnAttributes.type}>
              <span className="cds--text-truncate--end" title={displayData}>
                {displayData}
              </span>
            </Tag>
          );
        } else if (column.displayType === 'label') {
          transformObj[column.value] = (
            <>
              <div className="cds--text-truncate--end" title={displayData}>
                {displayData}{' '}
              </div>
            </>
          );
        } else if (column.displayType === 'icon-label') {
          transformObj[column.value] = (
            <>
              <span>
                <columnAttributes.icon className={columnAttributes.iconClassName}></columnAttributes.icon>
              </span>{' '}
              <span className="cds--text-truncate--end" title={displayData}>
                {displayData}
              </span>
            </>
          );
        } else if (column.displayType === 'label-icon') {
          transformObj[column.value] = (
            <>
              <span className="cds--text-truncate--end" title={displayData}>
                {displayData}
              </span>{' '}
              <span>
                <columnAttributes.icon className={columnAttributes.iconClassName}></columnAttributes.icon>
              </span>
            </>
          );
        }
      } else if (column.displayType === 'tooltip') {
        const colValue = getCellValue(row, column.value);
        transformObj[column.value] = colValue ? (
          <Tooltip label={columnAttributes.tooltipText || getCellValue(row, column.value)} align={getTooltipPosition(rowIndex, colIndex, rows.length, columnConfig.length)}>
            <Button className="sfg--tooltip" kind="ghost">
              {columnAttributes.icon ? <columnAttributes.icon className={columnAttributes.iconClassName}></columnAttributes.icon> : <Information />}
            </Button>
          </Tooltip>
        ) : (
          ''
        );
      } else if (column.displayType === 'custom') {
        if (column.getCustomElements) {
          transformObj[column.value] = column.getCustomElements(row, getCellValue(row, column.value), columnConfig);
        }
      }
    });

    return transformObj;
  });
  return transformData;
};

export default TransformTableData;
