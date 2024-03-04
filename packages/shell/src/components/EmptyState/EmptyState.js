import React from 'react';
import { Button, Link, Section, Heading } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import './EmptyState.scss';

const SFGEmptyState = ({ className, image, title, description, primaryAction, onPrimaryAction, secondaryAction, onSecondaryAction, ...props }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={`sfg--emptystate ${className === undefined ? '' : className}`}>
        {image && <div className="sfg--emptystate-image">{image}</div>}
        {title && (
          <div className="sfg--emptystate-title">
            <Section level={4}>
              <Heading>{t(title)}</Heading>
            </Section>
          </div>
        )}
        {description && <div className="sfg--emptystate-description">{t(description)}</div>}
        {primaryAction && (
          <div className="sfg--emptystate-primary-action">
            <Button kind="primary" className="sfg--emptystate-primary-action-btn" onClick={() => onPrimaryAction()}>
              {' '}
              {t(primaryAction)}
            </Button>
          </div>
        )}{' '}
        {secondaryAction && (
          <div className="sfg--emptystate-secondary-action">
            <Link className="sfg--emptystate-secondary-action-link" onClick={() => onSecondaryAction()}>{t(secondaryAction)}</Link>
          </div>
        )}
      </div>
    </>
  );
};

export { SFGEmptyState };
