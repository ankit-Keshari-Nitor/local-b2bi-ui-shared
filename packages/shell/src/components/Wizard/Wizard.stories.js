
import React, { useState } from 'react';
import { SFGWizard } from './Wizard';

export default {
    title: 'components/Wizard',
    component: SFGWizard,
    /*subcomponents: {
        SFGWizardStep
    },*/
    args: {},
    argTypes: {
      children: {
        table: {
          disable: true
        }
      },
  
      className: {
        table: {
          disable: true
        }
      },
  
      label: {
        table: {
          disable: true
        }
      },
  
      onSelect: {
        table: {
          disable: true
        }
      }
    }
  };

  export const Default = () => <SFGWizard ></SFGWizard>;
