import { Breadcrumb } from './Breadcrumb/Breadcrumb';
import { SFGDataTable as DataTable } from './DataTable/DataTable';
import { DataTableFilter as DataFilter } from './DataTable/DataTableFilter';
import { DataTableTreeView } from './DataTable/DataTableTreeView';
import { SFGEmptyState as EmptyState } from './EmptyState/EmptyState';
import { TreeView, CDSTreeView, CDSTreeNode } from './TreeView';
import { SFGWizard as Wizard } from './Wizard/Wizard';
import { SFGWizardStep as WizardStep } from './Wizard/WizardStep';
import { SFGRadioTileSelection as RadioTileSelection } from './Tiles/RadioTileSelection';
import { SFGSelectedValues as SelectedValues } from './SelectedValues/SelectedValues';
import { ModalMessage } from './messages/ModalMessage';
import { NotificationMessage } from './messages/NotificationMessage';
import { ModalPageContainer } from './modal/ModalPage';
import { LanguageSelector } from './LanguageSelector/LanguageSelector';
import { PageContainer } from './PageContainer/PageContainer';
import { Page } from './page/Page';
import { PageHeader } from './page/PageHeader';
import { PageBody } from './page/PageBody';
import { PageActions } from './page/PageActions';
import { ToastNotificationContainer } from './ToastNotification';
import { SidePageContext, SidePageContainer, SidePageProvider, useSidePage } from './SidePage';

const ShellComponents = {
  Breadcrumb,
  DataTable,
  DataFilter,
  DataTableTreeView,
  EmptyState,
  ModalMessage,
  ModalPageContainer,
  NotificationMessage,
  TreeView,
  Wizard,
  WizardStep,
  RadioTileSelection,
  SelectedValues,
  LanguageSelector,
  Page,
  PageActions,
  PageHeader,
  PageBody,
  PageContainer,
  CDSTreeView,
  CDSTreeNode,
  ToastNotificationContainer,
  SidePageContext,
  SidePageContainer,
  SidePageProvider,
  useSidePage
};
export default ShellComponents;

export {
  Breadcrumb,
  DataTable,
  DataFilter,
  DataTableTreeView,
  EmptyState,
  ModalMessage,
  ModalPageContainer,
  NotificationMessage,
  TreeView,
  Wizard,
  WizardStep,
  RadioTileSelection,
  SelectedValues,
  LanguageSelector,
  Page,
  PageBody,
  PageActions,
  PageHeader,
  PageContainer,
  CDSTreeView,
  CDSTreeNode,
  ToastNotificationContainer,
  SidePageContext,
  SidePageContainer,
  SidePageProvider,
  useSidePage
};
