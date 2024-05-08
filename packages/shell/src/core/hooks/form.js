import { useForm as useRHForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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
  ZIPCODE: /^[0-9a-zA-Z\s-]{2,20}$/
};

const useForm = ({ ...formOptions }, formName) => {
  const { t } = useTranslation();
  const { register, unregister, formState, watch, handleSubmit, reset, resetField, setError, clearErrors, setValue, setFocus, getValues, getFieldState, trigger, control, Form } =
    useRHForm({ ...formOptions });

  const processOptions = (options) => {
    if (options.hasOwnProperty('required') && isBoolean(options.required)) {
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

  const carbonRegister = (fieldName, options, fieldType, getValue) => {
    /*if(fieldType === 'combobox') {
      options.setValueAs = 
    }*/

    const { onChange, onBlur, name, ref } = register(fieldName, processOptions(options || {}));
    const id = formName ? formName + '.' + name : name;
    let returnObj;
    if (fieldType === 'radio') {
      returnObj = {
        name,
        ref,
        id
      };
    } else if (fieldType === 'radio-group') {
      returnObj = {
        name,
        id,
        onChange: (val, nm, event) => {
          onChange(event);
        }
      };
    } else if (fieldType === 'combobox') {
      returnObj = {
        name,
        id,
        ref,
        onChange: (val) => {
          const event = {
            type: 'onChange',
            target: {
              name: name,
              type: '',
              value: getValue ? getValue(val.selectedItem) : val.selectedItem
            }
          };
          // ref.value = val.selectedItem;
          // setValue(name, val.selectedItem);
          onChange(event);
        }
      };
    } else if (fieldType === 'filter-select') {
      returnObj = {
        name,
        id,
        ref,
        onChange: (val) => {
          const event = {
            type: 'onChange',
            target: {
              name: name,
              type: '',
              value: getValue ? getValue(val.selectedItems) : val.selectedItems
            }
          };
          // ref.value = val.selectedItems;
          // setValue(name, val.selectedItems, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
          onChange(event);
        }
      };
    } else if (fieldType === 'checkbox') {
      returnObj = {
        name,
        onChange,
        onBlur,
        ref
      };
    } else {
      // TODO: Should handle nested property for fieldName
      // return { onChange, onBlur, name, ref, id: id, 'data-testid':id, invalid: formState.errors[fieldName] ? true : false, invalidText: formState.errors[fieldName]?.message, defaultValue: getValues()?.[fieldName] };
      returnObj = {
        onChange,
        onBlur,
        name,
        ref
      };
    }
    return {
      id: id,
      'data-testid': id,
      invalid: formState.errors[fieldName] ? true : false,
      invalidText: formState.errors[fieldName] ? formState.errors[fieldName].message : '',
      ...returnObj
    };
  };

  return {
    register: carbonRegister,
    unregister,
    formState,
    watch,
    handleSubmit,
    reset,
    resetField,
    setError,
    clearErrors,
    setValue,
    setFocus,
    getValues,
    getFieldState,
    trigger,
    control,
    Form
  };
};

export { useForm };
