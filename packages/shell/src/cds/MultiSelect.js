import React from 'react';
import { MultiSelect as CDSMultiSelect, FilterableMultiSelect as CDSFilterableMultiSelect } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules, getFieldAttributes } from './FormUtils';

const MultiSelect = ({ name, rules, disabled, items, itemToString, variant = 'filterable', getValue, labelText, placeholder, infoText, readOnly, ...props }) => {
  const { t } = useTranslation();
  const processedRules = processRules(rules, t);
  const { control } = useFormContext();
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={processedRules}
        disabled={disabled}
        render={({ field: { onChange, onBlur, value, disabled, name, ref }, fieldState: { invalid, isTouched, isDirty, error }, formState }) => {
          const onChangeTemp = (val) => {
            const event = {
              type: 'onChange',
              target: {
                name: name,
                type: '',
                value: getValue !== undefined ? val.selectedItems.map((selectedItem) => getValue(selectedItem)) : val.selectedItems.map((selectedItem) => selectedItem.id)
              }
            };
            onChange(event);
          };
          const id = control?._options.name ? control._options.name + '.' + name : name;
          const selectedItems = items.filter((item) =>
            value?.find((selectedItem) => {
              if (typeof selectedItem === 'object') {
                return item.id === selectedItem.id;
              }
              return item.id === selectedItem;
            })
          );
          itemToString = itemToString ? itemToString : (item) => (item ? item.displayValue : '');

          return (
            <>
              {variant === 'filterable' ? (
                <CDSFilterableMultiSelect
                  id={id}
                  name={name}
                  onChange={onChangeTemp}
                  onBlur={onBlur}
                  disabled={disabled}
                  ref={ref}
                  initialSelectedItems={selectedItems}
                  items={items}
                  itemToString={itemToString}
                  invalid={invalid}
                  invalidText={error?.message}
                  {...getFieldAttributes({fieldType: 'MultiSelect', name, labelText, placeholder, infoText, required: processedRules.required, readOnly }, t)}
                  {...props}
                />
              ) : (
                <CDSMultiSelect
                  id={id}
                  name={name}
                  onChange={onChangeTemp}
                  onBlur={onBlur}
                  disabled={disabled}
                  ref={ref}
                  items={items}
                  itemToString={itemToString}
                  invalid={invalid}
                  invalidText={error?.message}
                  selectedItems={selectedItems}
                  {...getFieldAttributes({fieldType: 'MultiSelect', name, labelText, placeholder, infoText, required: processedRules.required, readOnly }, t)}
                  {...props}
                />
              )}
            </>
          );
        }}
      ></Controller>
    </>
  );
};

export default MultiSelect;

MultiSelect.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool,
  getValue: PropTypes.func,
  items: PropTypes.array,
  itemToString: PropTypes.func
};
