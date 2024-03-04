import { render } from '@testing-library/react';
import { SFGWizard } from './Wizard';
import { SFGWizardStep } from './WizardStep';

describe('Wizard', () => {
  it('Verify that the wizard is rendered', () => {
    render(
      <SFGWizard>
        <SFGWizardStep></SFGWizardStep>
        <SFGWizardStep></SFGWizardStep>
        <SFGWizardStep></SFGWizardStep>
      </SFGWizard>
    );
  });
});
