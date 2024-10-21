import React from 'react';
import { DatePicker, DatePickerInput } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules, getFieldAttributes } from './FormUtils';

const DateInput = ({ name, rules, disabled, className, labelText, placeholder, infoText, readOnly, minDate, maxDate,  ...props }) => {
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
            <DatePicker className={className} datePickerType="single" onChange={onChange} minDate={minDate} maxDate={maxDate} onClose={function noRefCheck() { }} onOpen={function noRefCheck() { }} value={value}>
              <DatePickerInput
                id={id}
                name={name}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                ref={ref}
                invalid={invalid}
                invalidText={error?.message}
                {...getFieldAttributes({ fieldType: 'NumberInput', name, labelText, placeholder, infoText, required: processedRules.required, readOnly,requiredLabelSuffix }, t)}
                {...props}
              />
            </DatePicker>
          );
        }}
      ></Controller>
    </>
  );
};

export default DateInput;

DateInput.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};
