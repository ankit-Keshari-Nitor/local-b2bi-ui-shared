import React from 'react';
import { Button, ButtonSet } from '@carbon/react';
import { useResource } from '../../core/providers/ResourceProvider';
import { useTranslation } from 'react-i18next';

const PageActions = ({ actions, filter, ...props }) => {
  const { hasAccess } = useResource();
  const { t } = useTranslation();

  const filterActions = (actions) => {
    actions.forEach((action) => {
      action.shouldShow = true;
    });
    if (typeof filter === 'function') {
      const actionsObj = Object.fromEntries(actions.map((obj) => [obj.id, obj]));
      filter(actionsObj);
    }

    return actions;
  };

  return (
    <>
      <ButtonSet className="sfg--page--actions">
        {filterActions(actions)
          .filter((pageAction) => hasAccess(pageAction.resourceKey))
          .filter((pageAction) => pageAction.shouldShow)
          .map((action) => {
            return (
              <Button key={action.id} data-testid={action.id} name={action.id} size="lg" kind={action.kind} type={action.button} onClick={() => action.onAction()}>
                {t(action.label)}
              </Button>
            );
          })}
      </ButtonSet>
    </>
  );
};

export { PageActions };
