import ShellComponents from './components';
import * as ShellCoreExports from './core';
import ShellCore from './core';
import { routes } from './routes';
import { RouteGuard } from './RouteGuard';
import initI18n from './i18n';
import ShellHost from './host';

const Shell = {
    ...ShellComponents,
    ...ShellCoreExports,
    ...ShellHost,
    routes,
    RouteGuard,
    initI18n,
    ShellCore
}
export default Shell;

export * from './common';
export * from './core';
export * from './components';
export * from './host';
export * from './locales';
export { routes, RouteGuard, initI18n }