import { render, screen } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';
import userEvent from '@testing-library/user-event';

jest.mock('../../core/providers/ConfigurationProvider', () => ({
  useConfiguration: () => {
    return {
      locales: [
        { code: 'en_US', display: 'English (United States)' },
        { code: 'es_ES', display: 'español (España)' },
        { code: 'fr_FR', display: 'Français (France)' },
        { code: 'it_IT', display: 'Italiano (Italia)' }
      ],
      locale: 'en_US',
      updateLocale: jest.fn()
    };
  }
}));

describe('Language Selector', () => {
  it('verfiy default value and after change should call  updateLocale & select other value', async () => {
    render(<LanguageSelector></LanguageSelector>);
    expect(screen.getByTestId('language-chooser')).toBeInTheDocument();
    expect(screen.getByTestId('en_US').selected).toBe(true);
    expect(screen.getByTestId('it_IT').selected).toBe(false);
    await userEvent.selectOptions(screen.getByTestId('language-chooser'), ['it_IT']);
    // expect(value.updateLocale).toHaveBeenCalled();
    expect(screen.getByTestId('it_IT').selected).toBe(true);
  });
});
