const headerMenuList = [
  {
    label: 'shell:test.menu',
    title: 'shell:test.menu',
    to: '/shelltest',
    id: 'shelltest',
    isVisible: window.sfgApplicationEnv === 'dev'
  }
];

const sideNavConfig = [
  {
    label: 'shell:test.feature',
    to: '/shelltest/feature',
    title: 'shell:test.feature',
    resourceKey: 'SHELLTEST.Feature.VIEW'
  },
  {
    label: 'shell:test.form',
    to: '/shelltest/form',
    title: 'shell:test.form',
    resourceKey: 'SHELLTEST.FORM.VIEW'
  },
  {
    label: 'shell:test.page',
    to: '/shelltest/page',
    title: 'shell:test.page',
    resourceKey: 'SHELLTEST.FORM.VIEW'
  }
];

export { sideNavConfig, headerMenuList };
