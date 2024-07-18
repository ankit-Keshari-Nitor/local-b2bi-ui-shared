import React from 'react';
import { TextInput as CDSTextInput } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules, getFieldAttributes } from './FormUtils';

const TextInput = ({ name, rules, disabled, labelText, placeholder, infoText, readOnly, ...props }) => {
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
            <CDSTextInput
              id={id}
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              ref={ref}
              value={value}
              invalid={invalid}
              invalidText={error?.message}
              {...getFieldAttributes({ fieldType: 'TextInput', name, labelText, placeholder, infoText, required: processedRules.required, readOnly }, t)}
              {...props}
            />
          );
        }}
      ></Controller>
    </>
  );
};

export default TextInput;

TextInput.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};
