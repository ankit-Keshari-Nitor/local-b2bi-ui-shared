import React from 'react';
import { Form as CDSForm } from '@carbon/react';
import { FormProvider } from 'react-hook-form';
import PropTypes from 'prop-types';

const Form = ({ name, context, children, ...props }) => {
  return (
    <>
      <FormProvider {...context}>
        <CDSForm name={name} {...props}>
          {children}
        </CDSForm>
      </FormProvider>
    </>
  );
};

export default Form;

Form.propTypes = {
  name: PropTypes.string,
  context: PropTypes.object
};
