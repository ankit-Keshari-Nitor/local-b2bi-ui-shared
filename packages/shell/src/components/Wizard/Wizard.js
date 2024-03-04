import React, { useEffect, useState } from 'react';
import { ProgressIndicator, ProgressStep, Button, ButtonSet } from '@carbon/react';
import PropTypes from 'prop-types';
import './Wizard.scss';
import { useTranslation } from 'react-i18next';
import { WizardProvider } from './WizardContext';

const SFGWizard = ({ children, onInit, onFinish, ...rest }) => {
  const { t } = useTranslation();

  return (
    <>
      <WizardProvider steps={children} onInit={onInit} onFinish={onFinish}>
        {(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext) => (
          <div className="shell-wizard">
            <div className="shell-wizard-progressbar">
              <ProgressIndicator currentIndex={currentIndex} spaceEqually={true} vertical={true} onChange={() => {}}>
                {wizardSteps.map((step, index) => (
                  <ProgressStep
                    key={index}
                    name={step.name}
                    index={index}
                    label={t(step.label)}
                    secondaryLabel={t(step.secondaryLabel)}
                    description={t(step.description)}
                    onClick={step.onClick}
                    disabled={step.disabled}
                    complete={step.complete}
                    current={step.current}
                    invalid={step.invalid}
                    className="sfg--progress-step--complete"
                  ></ProgressStep>
                ))}
              </ProgressIndicator>
            </div>
            <div className="shell-wizard-step">
              <div className="shell-wizard-step-content">{wizardSteps && currentIndex > -1 && wizardSteps[currentIndex].element}</div>
              <div className="shell-wizard-actions">
                <ButtonSet>
                  <Button kind="tertiary">{t('shell:wizard.actions.close')}</Button>
                  <Button kind="secondary">{t('shell:wizard.actions.save')}</Button>
                  <Button kind="secondary" onClick={onPrevious} {...prevBtnState}>
                    {t('shell:wizard.actions.previous')}
                  </Button>
                  <Button kind="primary" onClick={onNext} {...nextBtnState}>
                    {currentIndex < wizardSteps.length - 1 ? t('shell:wizard.actions.next'): t('shell:wizard.actions.submit')}
                  </Button>
                </ButtonSet>
              </div>
            </div>
          </div>
        )}
      </WizardProvider>
    </>
  );
};

SFGWizard.propTypes = {
  /**
   * Specify the children of the Wizard
   */
  children: PropTypes.node,
  /**
   * Specify the type of the wizard
   */
  type: PropTypes.string,
  /**
   * Specify the name of the wizard
   */
  name: PropTypes.string,
  /**
   * Specify whether or not the Progress Indicator should be hidden
   */
  hideProgressIndicator: PropTypes.bool
};

export { SFGWizard };
