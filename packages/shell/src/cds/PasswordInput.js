import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TextInput as CDSTextInput } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules, getFieldAttributes } from './FormUtils';

const CustomPasswordInput = forwardRef((props, ref) => {
  const passwordRef = useRef(null);
  useImperativeHandle(ref, () => passwordRef.current);
  useEffect(() => {
    const handleCopyPaste = (e) => {
      e.preventDefault();
    };

    const passwordField = passwordRef.current;
    //Changes to prevent copy paste in password fields
    if (passwordField) {
      passwordField.addEventListener('copy', handleCopyPaste);
      passwordField.addEventListener('cut', handleCopyPaste);
      passwordField.addEventListener('paste', handleCopyPaste);

      // Cleanup event listeners on unmount
      return () => {
        passwordField.removeEventListener('copy', handleCopyPaste);
        passwordField.removeEventListener('cut', handleCopyPaste);
        passwordField.removeEventListener('paste', handleCopyPaste);
      };
    }
  }, []);

  return <CDSTextInput.PasswordInput ref={passwordRef} {...props} />;
});

const PasswordInput = ({ name, rules, disabled, labelText, placeholder, infoText, readOnly, ...props }) => {
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
            <CustomPasswordInput
              id={id}
              name={name}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
              ref={ref}
              value={value}
              invalid={invalid}
              invalidText={error?.message}
              {...getFieldAttributes({fieldType: 'PasswordInput', name, labelText, placeholder, infoText, required: processedRules.required, readOnly }, t)}
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
