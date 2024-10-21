import React from 'react';
import { Form as CDSForm } from '@carbon/react';
import { FormProvider } from 'react-hook-form';
import { usePageContainer } from '../core';
import PropTypes from 'prop-types';

const Form = ({ name, context, children, requiredLabelSuffix = false, ...props }) => {
  const { pageController } = usePageContainer();
  let formController;
  if (!context) {
    formController = pageController?.form[name];
  } else {
    formController = context;
  }

  formController.control._options.requiredLabelSuffix = requiredLabelSuffix

  return (
    <>
      {formController && (
        <FormProvider {...formController}>
          <CDSForm name={name} {...props}>
            {children}
          </CDSForm>
        </FormProvider>
      )}
    </>
  );
};

export default Form;

Form.propTypes = {
  name: PropTypes.string,
  context: PropTypes.object
};
