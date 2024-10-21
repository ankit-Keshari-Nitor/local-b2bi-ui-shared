import React from 'react';
import { TimePicker, TimePickerSelect, SelectItem } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules, getFieldAttributes } from './FormUtils';

const TimeInput = ({ name, rules, disabled, className, labelText, placeholder, infoText, readOnly, ...props }) => {
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
          const id = control?._options.name ? control._options.name + '.' + name : name;
          const requiredLabelSuffix = control ? control._options.requiredLabelSuffix : false;

          return (
            <TimePicker
              className={className}
              id={`${id}`}
              name={name}
              placeholder="hh:mm"
              value={value ? value : '00:00'}
              onChange={onChange}
              //onBlur={handleTimeChange}
              disabled={disabled}
              ref={ref}
              invalid={invalid}
              invalidText={error?.message}
              {...getFieldAttributes({ fieldType: 'NumberInput', name, labelText, placeholder, infoText, required: processedRules.required, readOnly, requiredLabelSuffix }, t)}
              {...props}
            >
              <TimePickerSelect id={`${id}-select`} labelText="AM/PM">
                <SelectItem value="AM" text="AM" />
                <SelectItem value="PM" text="PM" />
              </TimePickerSelect>
            </TimePicker>
          );
        }}
      ></Controller>
    </>
  );
};

export default TimeInput;

TimeInput.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};
