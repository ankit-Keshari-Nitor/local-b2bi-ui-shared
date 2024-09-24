import React from 'react';
import { Toggle as CDSToggle } from '@carbon/react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { processRules } from './FormUtils';

const Toggle = ({ name, disabled, rules, infoText, id:tId, ...props }) => {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const processedRules = processRules(rules, t);
  
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={processedRules}
        disabled={disabled}
        render={({ field: { onChange, onBlur, value, disabled, name, ref }, fieldState: { invalid, isTouched, isDirty, error }, formState }) => {
          const id = tId || (control?._options.name ? control._options.name + '.' + name : name);
          const onToggle = (value) => {
            const event = {
              type: 'onChange',
              target: {
                name: name,
                type: '',
                value: value
              }
            };
            onChange(event);
            console.log(event);
          };
          return (
            <>
              <div className="cds--form-item cds--text-input-wrapper cds--toggle-wrapper">
                <div className="cds--text-input__field-outer-wrapper">
                  <div className="cds--text-input__field-wrapper" data-invalid={invalid}>
                    <CDSToggle id={id} name={name} disabled={disabled} defaultToggled={value} toggled={value} data-toggled={true} onToggle={(event) => onToggle(event)} {...props} />
                  </div>
                  {invalid && (
                    <div className="cds--form-requirement" id={`${id}-error-msg`} dir="auto">
                      {error.message}
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        }}
      ></Controller>
    </>
  );
};

Toggle.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};

export default Toggle;
