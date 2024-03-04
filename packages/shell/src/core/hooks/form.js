import { useForm as useRHForm } from 'react-hook-form';

const useForm = ({ ...formOptions }, formName) => {
  const { register, unregister, formState, watch, handleSubmit, reset, resetField, setError, clearErrors, setValue, setFocus, getValues, getFieldState, trigger, control, Form } =
    useRHForm({ ...formOptions });

  const carbonRegister = (fieldName, options, fieldType) => {
    const { onChange, onBlur, name, ref } = register(fieldName, options);
    const id = formName ? formName + '.' + name : name;
    if (fieldType === 'radio') {
      return {
        name,
        ref,
        id
      };
    } else if (fieldType === 'radio-group') {
      return {
        name,
        id,
        onChange: (val, nm, event) => {
          onChange(event);
        }
      };
    } else if (fieldType === 'combobox') {
      return {
        name,
        id,
        ref,
        onChange: (val) => {
          const event = {
            type: 'onChange',
            target: {
              name: name,
              type: 'text',
              value: val
            }
          };
          onChange(event);
        }
      };
    } else if (fieldType === 'checkbox') {
      return {
        name,
        onChange,
        onBlur,
        ref 
      };
    } else {
      // TODO: Should handle nested property for fieldName
      // return { onChange, onBlur, name, ref, id: id, 'data-testid':id, invalid: formState.errors[fieldName] ? true : false, invalidText: formState.errors[fieldName]?.message, defaultValue: getValues()?.[fieldName] };
      return { onChange, onBlur, name, ref, id: id, 'data-testid':id };
    }
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
