import React from 'react';
import { useTranslation } from "react-i18next";
import { Tag, Link } from "@carbon/react";

function isNotEmpty(value) {
    if (value === null || value === undefined) {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }

    return value !== '';
  }

  const AppliedFilter = ({appliedFilter ={}, filterConfig, onRemoveFilter, onClearFilter}) => {
    const { t} = useTranslation();

    
      const applicableFilter = Object.entries(appliedFilter).filter(([_, value]) => {
        return isNotEmpty(value);
      });
      if (applicableFilter.length > 0) {
        const appliedFilterDisplay = applicableFilter.map(([key, value]) => {
          const filterItem = filterConfig.fields.find((item) => {
            return item.name === key;
          });
          let displayValue;
          if (filterItem.type === 'checkbox-group') {
            const filteredOptions = filterItem.options.filter((optionItem) => {
              return value.find((val) => val === optionItem.value);
            });
            displayValue = filteredOptions
              .map((option) => {
                return option.label.indexOf(':') > -1 ? t(option.label) : option.label;
              })
              .toString();
          } else if (filterItem.type === 'radio-group') {
            const filteredOptions = filterItem.options.filter((optionItem) => {
              return value === optionItem.value;
            });
            displayValue = filteredOptions
              .map((option) => {
                return option.label.indexOf(':') > -1 ? t(option.label) : option.label;
              })
              .toString();
          } else if (filterItem.type === 'combobox') {
            displayValue = value.text;
          } else {
            displayValue = value;
          }
          if (displayValue.indexOf(':') > -1) {
            displayValue = t(displayValue);
          }
          return (
            <Tag
              key={key}
              type="blue"
              data-testid={'tag-' + key}
              className="sfg--applied-filter-section-pills"
              filter
              title="Clear Filter"
              size="md"
              name={filterItem.name}
              onClose={() => {
                
                onRemoveFilter?.(key);
              }}
            >
              {t(filterItem.label)}:{displayValue}{' '}
            </Tag>
          );
        });
        return (
          <>
            {appliedFilterDisplay}
  
            <Link
              size="sm"
              onClick={() => {
                
                onClearFilter?.();
              }}
            >
              {t('shell:common.filter-section.clear-filter')}
            </Link>
          </>
        );
      } else {
        return <></>;
      }
  }

  export default AppliedFilter;