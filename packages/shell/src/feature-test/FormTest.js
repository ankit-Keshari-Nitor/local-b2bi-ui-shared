import React from 'react';
import { Button, Grid, Column, Section, ButtonSet, TextArea } from '@carbon/react';
import { PageUtil } from '../core';
import { usePage } from '../core/hooks/page';
import { NotificationMessage, Page, PageHeader } from '../components';
import CDS from '../cds';

const shifts = [
  {
    id: '1',
    displayValue: 'Morning'
  },
  {
    id: '2',
    displayValue: 'Afternoon'
  },
  {
    id: '3',
    displayValue: 'Evening'
  },
  {
    id: '4',
    displayValue: 'Night'
  }
];

const FormTest = () => {
  const pageUtil = PageUtil();
  const pageArgs = pageUtil.pageParams;
  const pageConfig = {};

  const { page } = usePage(
    [],
    (function Page(pageArgs, pageUtil) {
      return {
        form: {
          test: {
            firstName: 'Pradeep',
            lastName: 'Kariyappa',
            age: 25,
            singleSelect: {
              id: '1',
              displayValue: 'Morning'
            },
            multiSelect: [
              {
                id: '1',
                displayValue: 'Morning'
              }
            ],
            status: 'active',
            preferences: []
          }
        },
        uiHandleSubmit: function () {
          console.log(this.form.test.getValues());
        },
        uiHandleReset: function () {
          this.form.test.reset({});
        }
      };
    })(pageArgs, pageUtil)
  );

  return (
    <>
      <CDS.Form context={page.form.test} name="test">
        <Grid fullWidth className="sfg--grid--form">
          <Column lg={6} md={6}>
            <CDS.TextInput labelText="First Name" name="firstName" rules={{ required: true }}></CDS.TextInput>
          </Column>
          <Column lg={6} md={6}>
            <CDS.TextInput labelText="Last Name" name="lastName"></CDS.TextInput>
          </Column>
          <Column lg={6} md={6}>
            <CDS.PasswordInput labelText="Password" name="password" rules={{ required: false, pattern: 'PASSWORD', deps: ['confirmPassword'] }}></CDS.PasswordInput>
          </Column>
          <Column lg={6} md={6}>
            <CDS.PasswordInput
              labelText="Confirm Password"
              name="confirmPassword"
              rules={{
                required: false,
                pattern: 'PASSWORD',
                validate: (value) => {
                  return page.form.test.watch('password') === value || pageUtil.t('mod-user:add.passwordNoMatch');
                },
                deps: ['password']
              }}
            ></CDS.PasswordInput>
          </Column>
          <Column lg={6} md={6}>
            <CDS.NumberInput labelText="Age" name="age" rules={{ required: true, min: 18, max: 65 }}></CDS.NumberInput>
          </Column>
          <Column lg={6} md={6}>
            <CDS.Checkbox labelText="Is Employee" name="isEmployee"></CDS.Checkbox>
          </Column>
          <Column lg={6} md={6}>
            <CDS.ComboBox name="singleSelect" items={shifts} rules={{ required: false }} getValue={(item) => item}></CDS.ComboBox>
          </Column>
          <Column lg={6} md={6}>
            <CDS.MultiSelect name="multiSelect" items={shifts} rules={{ required: false }} getValue={(item) => item}></CDS.MultiSelect>
          </Column>
          <Column lg={6} md={6}>
            <CDS.CheckboxGroup name="preferences" legendText="Preferences">
              <CDS.Checkbox id="preferences-title" labelText="Show Title" name="preferences" value="title"></CDS.Checkbox>
              <CDS.Checkbox id="preferences-description" labelText="Show Description" name="preferences" value="description"></CDS.Checkbox>
            </CDS.CheckboxGroup>
          </Column>
          <Column lg={6} md={6}>
            <CDS.RadioButtonGroup name="status" legendText="status" rules={{ required: true }}>
              <CDS.RadioButton id="status-active" labelText="Active" name="status" value="active"></CDS.RadioButton>
              <CDS.RadioButton id="status-inactive" labelText="Inactive" name="status" value="inactive"></CDS.RadioButton>
            </CDS.RadioButtonGroup>
          </Column>
          <Column lg={12} md={12}>
            <CDS.TextArea
              labelText="Address"
              name="address"
              rows={5}
              rules={{ required: false, minLength: 20, maxLength: 100 }}
              enableCounter={true}
              counterMode="character"
              maxCount={150}
            ></CDS.TextArea>
          </Column>
        </Grid>
      </CDS.Form>
      <ButtonSet>
        <Button name="Submit" label="Submit" onClick={page.form.test.handleSubmit(page.uiHandleSubmit)}>
          Submit
        </Button>
        <Button name="Reset" label="Reset" onClick={page.uiHandleReset}>
          Reset
        </Button>
      </ButtonSet>
    </>
  );
};

export default FormTest;
