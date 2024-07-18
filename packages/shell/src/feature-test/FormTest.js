import React from 'react';
import { Button, Grid, Column, Section, ButtonSet, TextArea, FormItem, FileUploaderDropContainer, FileUploaderItem } from '@carbon/react';
import { PageUtil } from '../core';
import { usePage } from '../core/hooks/page';
import { NotificationMessage, Page, PageHeader, PageBody } from '../components';
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
        ui: {
          selectedFile: undefined,
          file: undefined
        },
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
        },
        uiOnAddFile: function (event, files) {
          this.setUI('selectedFile', files.addedFiles[0]);
          const file = event.target.files;

          const newFile = [
            {
              name: file[0].name,
              filesize: file[0].size,
              status: 'uploading',
              iconDescription: 'Uploading',
              invalidFileType: file[0].invalidFileType
            }
          ];

          this.setUI('file', newFile[0]);
          this._uploadFile([newFile[0]]);
        },
        _uploadFile: async function (fileToUpload) {
          // file size validation
          if (fileToUpload[0].filesize > 512000) {
            const updatedFile = {
              ...fileToUpload[0],
              status: 'edit',
              iconDescription: 'Delete file',
              invalid: true,
              errorSubject: 'File size exceeds limit',
              errorBody: '500kb max file size. Select a new file and try again.'
            };

            this.setUI('file', updatedFile);
            return;
          }

          // file type validation
          if (fileToUpload[0].invalidFileType) {
            const updatedFile = {
              ...fileToUpload[0],
              status: 'edit',
              iconDescription: 'Delete file',
              invalid: true,
              errorSubject: 'Invalid file type',
              errorBody: `"${fileToUpload[0].name}" does not have a valid file type.`
            };
            this.setUI('file', updatedFile);
            return;
          }
        },
        uiOnDeleteFile: function (...args) {
          console.log(args);
          this.setUI('selectedFile', undefined);
        }
      };
    })(pageArgs, pageUtil)
  );

  return (
    <>
      <Page name="FormTest" className="sfg--page--shell-form-test">
        <PageHeader title="Form Test"></PageHeader>
        <PageBody>
          <CDS.Form context={page.form.test} name="test">
            <Grid fullWidth className="sfg--grid--form">
              <Column lg={12} md={12}>
                <p className="cds--file--label">Upload a file</p>
              </Column>
              <Column lg={page.ui.selectedFile === undefined ? 12 : 6} md={page.ui.selectedFile === undefined ? 12 : 6}>
                <CDS.FileUpload labelText="File Name" name="fileUpload" accept={['.secsh']} maxFileSize={'500kb'} onChange={() => {}}></CDS.FileUpload>
              </Column>
              <Column lg={6} md={6}>
                <CDS.TextInput labelText="First Name" name="firstName" rules={{ required: true }} infoText="Only Alphabetic characters are allowed"></CDS.TextInput>
              </Column>
              <Column lg={6} md={6}>
                <CDS.TextInput labelText="Last Name" name="lastName" infoText="Only Alphabetic characters are allowed"></CDS.TextInput>
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
              <Column lg={6} md={6}>
                <CDS.Toggle name="toggleStatus" labelText="toggle-status" rules={{}} labelA="No" labelB="Yes" />
              </Column>
              <Column lg={6} md={6}>
                <CDS.DateTimeInput name="dateTime" labelText="Date and Time" rules={{}} />
              </Column>
              <Column lg={6} md={6}>
                <CDS.DateInput name="date" labelText="Date" rules={{}} />
              </Column>
              <Column lg={6} md={6}>
                <CDS.TimeInput name="time" labelText="Time" rules={{}} />
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
        </PageBody>
        <ButtonSet>
          <Button name="Submit" label="Submit" onClick={page.form.test.handleSubmit(page.uiHandleSubmit)}>
            Submit
          </Button>
          <Button name="Reset" label="Reset" onClick={page.uiHandleReset}>
            Reset
          </Button>
        </ButtonSet>
      </Page>
    </>
  );
};

export default FormTest;
