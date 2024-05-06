import React from 'react';
import { RadioButton as CDSRadioButton, RadioButtonGroup as CDSRadioButtonGroup, RadioButtonSkeleton } from '@carbon/react';
import { useFormContext, useController } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules } from './FormUtils';

const RadioButton = ({ name, rules, value, disabled, ...props }) => {
  const { t } = useTranslation();
  const processedRules = processRules(rules, t);
  const { register, control } = useFormContext();
  // onst { feild, fieldState, formState } = useController()
  const { name: rName, onChange, onBlur, ref } = register(name, rules);
  const id = control?._options.name ? control._options.name + '.' + name + '.' + value : name + '.' + value;
  return (
    <>
      <CDSRadioButton id={id} name={rName} ref={ref} disabled={disabled} value={value} {...props} />
    </>
  );
};

const RadioButtonGroup = ({ name, rules, children, ...props }) => {
  const { t } = useTranslation();
  // const processedRules = processRules(rules, t);
  const { register, control, getValues } = useFormContext();
  const { name: rName, onChange, onBlur, ref } = register(name, rules);
  const {
    field,
    fieldState: { invalid, error },
    formOptions
  } = useController({
    name,
    rules
  });
  const onChangeRadioGroup = (val, nm, event) => {
    onChange(event);
  };
  return (
    <>
      <CDSRadioButtonGroup name={rName} onChange={onChangeRadioGroup} defaultSelected={getValues(name)} onBlur={onBlur} invalid={invalid} invalidText={error?.message} {...props}>
        {children}
      </CDSRadioButtonGroup>
    </>
  );
};
export default RadioButton;

RadioButton.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};

RadioButtonGroup.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};

export { RadioButton, RadioButtonGroup };
