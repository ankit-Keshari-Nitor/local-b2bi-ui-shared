import React from 'react';
import { Button, ButtonSet, InlineLoading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import { useResource } from '../../core/providers/ResourceProvider';
import { usePage } from '../../core/providers/PageContainerProvider';

const PageActions = ({ actions = [], filter, ...props }) => {
  const { hasAccess } = useResource();
  const { t } = useTranslation();
  const { pageMode } = usePage();

  const filterActions = (actions) => {
    actions.forEach((action) => {
      if (!('shouldShow' in action)) action.shouldShow = true;
      if (!('isVisible' in action)) action.isVisible = true;
    });
    if (typeof filter === 'function') {
      const actionsObj = Object.fromEntries(actions.map((obj) => [obj.id, obj]));
      filter(actionsObj);
    }

    return actions;
  };

  return (
    <>
      {actions.length > 0 && (
        <ButtonSet className={pageMode === 'MODAL_PAGE' ? 'cds--modal-footer sfg--modal-footer' : 'sfg--page--actions'}>
          {filterActions(actions)
            .filter((pageAction) => hasAccess(pageAction.resourceKey))
            .filter((pageAction) => pageAction.shouldShow)
            .filter((pageAction) => pageAction.isVisible)
            .map((action) => {
              return action.showLoading ? (
                <InlineLoading
                  style={{
                    marginLeft: '1rem'
                  }}
                  description={t(action.label, { context: 'ACTIVE' })}
                  status={action.status ? 'finished' : 'active'}
                  aria-live={action.showLoading ? 'assertive' : 'off'}
                />
              ) : (
                <Button
                  key={action.id}
                  data-testid={action.id}
                  name={action.id}
                  size="lg"
                  kind={action.kind}
                  type={action.button}
                  disabled={action.disabled}
                  onClick={() => action.onAction()}
                >
                  {t(action.label)}
                </Button>
              );
            })}
        </ButtonSet>
      )}
    </>
  );
};

export { PageActions };
