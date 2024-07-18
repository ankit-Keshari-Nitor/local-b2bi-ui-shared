import React from 'react';
import { Checkbox as CDSCheckbox, CheckboxGroup as CDSCheckboxGroup, CheckboxSkeleton } from '@carbon/react';
import { Controller, useController, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { processRules } from './FormUtils';

const Checkbox = ({ name, rules, disabled, ...props }) => {
  const { t } = useTranslation();
  const processedRules = processRules(rules, t);
  const { register } = useFormContext();  
  return (
    <>
      <CDSCheckbox {...register(name, processedRules)} disabled={disabled} {...props} />
    </>
  );
};

const CheckboxGroup = ({ children,  infoText, ...props }) => {
  const { t } = useTranslation();
  // const processedRules = processRules(rules, t);
  return (
    <>
      <CDSCheckboxGroup {...props}>{children}</CDSCheckboxGroup>
    </>
  );
};
export default Checkbox;

Checkbox.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};

CheckboxGroup.propTypes = {
  name: PropTypes.string,
  rules: PropTypes.object,
  disabled: PropTypes.bool
};

export { Checkbox, CheckboxGroup };
