import { cleanup, fireEvent, render, find, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select, SelectItem } from '@carbon/react';
import { ConfigurationProvider, useConfiguration } from './ConfigurationProvider';
import { SupportedLocales } from '../../locales';

const sideNavConfig = [
  {
    label: 'dashboard',
    to: '/dashboard',
    title: 'dashboard',
    resourceKey: 'DASHBOARD.VIEW'
  },
  {
    label: 'companies',
    to: '/manage/companies',
    title: 'companies',
    children: [
      {
        label: 'my_company',
        to: '/manage/companies/mycompany',
        title: 'my_company',
        resourceKey: 'COMPANIES.MY_COMPANY'
      },
      {
        label: 'partner_companies',
        to: '/manage/companies/partnercompanies',
        title: 'partner_companies',
        resourceKey: 'COMPANIES.PARTNER_COMPANIES'
      }
    ]
  },
  {
    label: 'applications',
    to: '/manage/applications',
    title: 'applications',
    children: [
      {
        label: 'my_applications',
        to: '/manage/applications/myapplications',
        title: 'my_applications',
        resourceKey: 'APPLICATION.MY_COMPANY'
      },
      {
        label: 'partner_applications',
        to: '/manage/applications/partnerapplications',
        title: 'partner_applications',
        resourceKey: 'APPLICATION.PARTNER_COMPANIES'
      }
    ]
  },
  {
    label: 'communites',
    to: '/manage/communites',
    title: 'communites',
    resourceKey: 'COMMUNITIES'
  },
  {
    label: 'connections',
    to: '/manage/connections',
    title: 'connections',
    children: [
      {
        label: 'my_connections',
        to: '/manage/connections/myconnections',
        title: 'my_connections',
        resourceKey: 'CONNECTIONS.MY_CONNECTIONS'
      },
      {
        label: 'templates',
        to: '/manage/connections/templates',
        title: 'templates',
        resourceKey: 'CONNECTIONS.TEMPLATES'
      }
    ]
  },
  {
    label: 'preferences',
    to: '/manage/preferences',
    title: 'preferences',
    children: [
      {
        label: 'notifications',
        to: '/manage/preferences/notifications',
        title: 'notifications',
        resourceKey: 'PREFERENCES.NOTIFICATION'
      }
    ]
  },
  {
    label: 'users',
    to: '/manage/users',
    title: 'users',
    resourceKey: 'USER'
  },
  {
    label: 'monitor.reports',
    to: '/monitor/reports',
    title: 'monitor.reports',
    resourceKey: 'REPORTS.VIEW'
  },
  {
    label: 'monitor.activities',
    to: '/monitor/activities',
    title: 'monitor.activities',
    resourceKey: 'ACTIVITIES.VIEW'
  },
  {
    label: 'monitor.activity_snapshots',
    to: '/monitor/activitysnapshot',
    title: 'monitor.activity_snapshots',
    resourceKey: 'ACTIVITY_SNAPSHOT.VIEW'
  },
  {
    label: 'tools.b2bi_integrator',
    to: '/tools/b2biintegrator',
    title: 'tools.b2bi_integrator',
    resourceKey: 'B2BI_INTEGRATOR.VIEW'
  },
  {
    label: 'tools.logs',
    to: '/tools/logs',
    title: 'tools.logs',
    resourceKey: 'LOGS.VIEW'
  }
];

const headerMenuList = [
  {
    label: 'dashboard',
    title: 'dashboard',
    to: '/dashboard',
    id: 'dashboard'
  },
  {
    label: 'manage',
    title: 'manage',
    to: '/manage',
    id: 'manange'
  },
  {
    label: 'monitor',
    title: 'monitor',
    to: '/monitor',
    id: 'monitor'
  },
  {
    label: 'tools',
    title: 'tools',
    to: '/tools',
    id: 'tools'
  },
  {
    label: 'samples',
    title: 'samples',
    to: '/samples',
    id: 'samples'
  }
];
// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn()
    }
  })
}));
const TestingComponent = (props) => {
  const { locales, locale, updateLocale } = useConfiguration();
  return (
    <>
      <Select defaultValue={locale} id="language-chooser" data-testid="language-chooser" labelText="" inline onChange={updateLocale}>
        {locales?.map((locale) => (
          <SelectItem key={locale.code} text={locale.display} value={locale.code} data-testid={locale.code} />
        ))}
      </Select>
    </>
  );
};

it('default value selected ', () => {
  render(
    <ConfigurationProvider locales={SupportedLocales} locale={'en_US'} sideNavConfig={sideNavConfig} headerMenuList={headerMenuList}>
      <TestingComponent></TestingComponent>
    </ConfigurationProvider>
  );
  expect(screen.getByTestId('en_US').selected).toBe(true);
});

it(' on change the dropdown updateLocale method calling', async () => {
  render(
    <ConfigurationProvider locales={SupportedLocales} locale={'en_US'} sideNavConfig={sideNavConfig} headerMenuList={headerMenuList}>
      <TestingComponent></TestingComponent>
    </ConfigurationProvider>
  );
  expect(await screen.findByTestId('language-chooser')).toBeInTheDocument();
  await userEvent.selectOptions(screen.getByTestId('language-chooser'), ['it_IT']);
  expect(screen.getByTestId('it_IT').selected).toBe(true);
});
