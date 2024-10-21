import React from 'react';
import { TextArea as CDSTextArea } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules, getFieldAttributes } from './FormUtils';

const TextArea = ({ name, rules, disabled, labelText, placeholder, infoText, readOnly, ...props }) => {
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
            <CDSTextArea
              id={id}
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              ref={ref}
              value={value}
              invalid={invalid}
              invalidText={error?.message}
              {...getFieldAttributes({ fieldType: 'TextArea', name, labelText, placeholder, infoText, required: processedRules.required, readOnly, requiredLabelSuffix }, t)}
              {...props}
            />
          );
        }}
      ></Controller>
    </>
  );
};

export default TextArea;

TextArea.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};
