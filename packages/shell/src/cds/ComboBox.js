import React from 'react';
import { ComboBox as CDSComboBox } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { processRules, getFieldAttributes } from './FormUtils';

const ComboBox = ({ name, rules, disabled, items, itemToString, getValue, itemValue, itemDisplayValue, labelText, placeholder, infoText, readOnly, ...props }) => {
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
                value: getValue !== undefined ? getValue(val.selectedItem) : val.selectedItem?.id
              }
            };
            onChange(event);
          };
          const id = control?._options.name ? control._options.name + '.' + name : name;
          const requiredLabelSuffix = control ? control._options.requiredLabelSuffix : false;

          const selectedItem =
            items &&
            value &&
            items.filter((item) => {
              if (typeof value === 'object') {
                return item.id === value.id;
              }
              return item.id === value;
            })?.[0];
          // const defaultGetDisplayValue =()
          itemToString = itemToString ? itemToString : (item) => (item ? item.displayValue : '');
          const filterItems = (menu) => {
            return menu?.item.displayValue?.toLowerCase().includes(menu?.inputValue?.toLowerCase());
          };
          return (
            <CDSComboBox
              id={id}
              name={name}
              onChange={onChangeTemp}
              onBlur={onBlur}
              disabled={disabled}
              ref={ref}
              selectedItem={selectedItem}
              items={items}
              itemToString={itemToString}
              invalid={invalid}
              invalidText={error?.message}
              {...getFieldAttributes({ fieldType: 'MultiSelect', name, labelText, placeholder, infoText, required: processedRules.required, readOnly, requiredLabelSuffix }, t)}
              // shouldFilterItem={filterItems}
              {...props}
            />
          );
        }}
      ></Controller>
    </>
  );
};

export default ComboBox;

ComboBox.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool,
  getValue: PropTypes.func,
  items: PropTypes.array,
  itemToString: PropTypes.func
};
