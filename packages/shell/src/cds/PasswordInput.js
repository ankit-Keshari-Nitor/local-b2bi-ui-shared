import React from 'react';
import { TextInput as CDSTextInput } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules } from './FormUtils';

const PasswordInput = ({ name, rules, disabled, ...props }) => {
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
          return (
            <CDSTextInput.PasswordInput
              id={id}
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              ref={ref}
              value={value}
              invalid={invalid}
              invalidText={error?.message}
              {...props}
            />
          );
        }}
      ></Controller>
    </>
  );
};

export default PasswordInput;

PasswordInput.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};
