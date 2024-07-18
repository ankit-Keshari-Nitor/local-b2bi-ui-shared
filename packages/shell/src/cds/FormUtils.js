import React from 'react';
import { Tooltip, Button } from '@carbon/react';
import { Information } from '@carbon/icons-react';

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isNumber(value) {
  return typeof value === 'number';
}

function isString(value) {
  return typeof value === 'string';
}

const supportedPatterns = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  PHONE: /^\+?\d{1,3}[-.\s()]?\d{1,3}[-.\s()]?\d{1,4}[-.\s()]?\d{1,4}[-.\s()]?\d{1,4}$/,
  // PHONE: /^\+?\d{1,3}[-.\s()]?\(?\d{3}\)?[-.\s()]?\d{3}[-.\s()]?\d{4}$/,
  ZIPCODE: /^[0-9a-zA-Z\s-]{2,20}$/,
  PASSWORD: /^(?=.*[0-9])(?=.*[!@#$%^&*()-_=+{};:,<.>?\\|]).{8,15}$/
};

const processRules = (options = {}, t) => {
  if (options.hasOwnProperty('required') && isBoolean(options.required) && options.required) {
    options.required = t('shell:form.validations.required');
  }
  if (options.hasOwnProperty('minLength') && isNumber(options.minLength)) {
    options.minLength = {
      value: options.minLength,
      message: t('shell:form.validations.minLength', { length: options.minLength })
    };
  }
  if (options.hasOwnProperty('maxLength') && isNumber(options.maxLength)) {
    options.maxLength = {
      value: options.maxLength,
      message: t('shell:form.validations.maxLength', { length: options.maxLength })
    };
  }
  if (options.hasOwnProperty('min') && isNumber(options.min)) {
    options.min = {
      value: options.min,
      message: t('shell:form.validations.min', { value: options.min })
    };
  }
  if (options.hasOwnProperty('max') && isNumber(options.max)) {
    options.max = {
      value: options.max,
      message: t('shell:form.validations.max', { value: options.max })
    };
  }
  if (options.hasOwnProperty('pattern') && isString(options.pattern)) {
    options.pattern = {
      value: supportedPatterns[options.pattern],
      message: t(`shell:form.validations.patterns`, { context: options.pattern })
    };
  }
  return options;
};

const getFieldAttributes = ({ fieldType, name, labelText, placeholder, infoText, readOnly, required }, t) => {
  let placeholderType = '';

  switch (fieldType) {
    case 'TextInput':
    case 'NumberInput':
    case 'TextArea':
    case 'Password':
      placeholderType = 'enter';
      break;
    case 'Combobox':
    case 'MultSelect':
      placeholderType = 'select';
      break;
    default:
      placeholderType = 'enter';
  }

  const newLabelText = required || readOnly ? labelText : t('shell:form.labels.optional', { value: labelText });
  const newPlaceholder = placeholder || (readOnly ? '' : t(`shell:form.placeholder.${placeholderType}`, { label: labelText }));
  return {
    labelText: infoText ? (
      <>
        {newLabelText}
        <Tooltip align="top-left" label={infoText}>
          <Button className="sfg--tooltip" kind="ghost">
            <Information />
          </Button>
        </Tooltip>
      </>
    ) : (
      newLabelText
    ),
    placeholder: newPlaceholder,
    readOnly
  };
};

export { processRules, getFieldAttributes };
