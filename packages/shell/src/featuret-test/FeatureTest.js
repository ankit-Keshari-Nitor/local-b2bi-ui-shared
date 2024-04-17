import React from 'react';
import { Button, Grid, Column, Section } from '@carbon/react';
import { PageUtil } from '../core';
import { NotificationMessage, Page, PageHeader } from '../components';

const FeatureTest = () => {
  const pageUtil = PageUtil();

  return (
    <>
      <Page type="LIST" className="sfg--page--shell-feature-test">
        <PageHeader title={'Shell Feature Test'} description={'Shell Feature Test'}></PageHeader>
        <Section className="page-notification-container">
          <NotificationMessage></NotificationMessage>
        </Section>
        <Section className="page-body">
          <Grid>
            <Column lg={16}>
              <Button
                name="showSuccessToast"
                onClick={() => {
                  pageUtil.showNotificationMessage('toast', 'success', 'Success Message');
                }}
              >
                Show success Taost
              </Button>
            </Column>
            <Column lg={16}>
              <Button
                name="showErrorToast"
                onClick={() => {
                  pageUtil.showNotificationMessage('toast', 'error', 'Error Message');
                }}
              >
                Show error Taost
              </Button>
            </Column>
            <Column lg={16}>
              <Button
                name="showWarningToast"
                onClick={() => {
                  pageUtil.showNotificationMessage('toast', 'warning', 'Warning Message');
                }}
              >
                Show warning Taost
              </Button>
            </Column>
            <Column lg={16}>
              <Button
                name="showInfoToast"
                onClick={() => {
                  pageUtil.showNotificationMessage('toast', 'info', 'Information Message');
                }}
              >
                Show info Taost
              </Button>
            </Column>
          </Grid>
        </Section>
      </Page>
    </>
  );
};

export default FeatureTest;
