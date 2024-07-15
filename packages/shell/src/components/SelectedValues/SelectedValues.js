import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Tag } from '@carbon/react';
import './SelectedValues.scss';

const SFGSelectedValues = ({ id, name, label, type = 'filter', values, onRemove, onClearAll, showHeader, className, ...rest }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="sfg--selected-values" id={id} name={name}>
        {showHeader !== false && (
          <div className="sfg--selected-values-header">
            <div className="sfg--selected-values-label">{t(label)}</div>
            {onClearAll && (
              <Link
                href="#"
                className="sfg--selected-values-clearall"
                disabled={values.length === 0}
                onClick={() => {
                  onClearAll();
                }}
              >
                {t('shell:common.actions.clearAll')}
              </Link>
            )}
          </div>
        )}
        <div className="sfg--selected-values-pill-container">
          {values?.map((value) => {
            return (
              <Tag
                key={value.id}
                type={type === 'filter' ? 'blue' : 'cool-gray'}
                className="sfg--selected-values-pill"
                filter={type === 'filter' ? true : false}
                title="Remove"
                size="md"
                onClose={() => onRemove(value)}
              >
                {value.displayValue}
              </Tag>
            );
          })}
        </div>
      </div>
    </>
  );
};

export { SFGSelectedValues };
