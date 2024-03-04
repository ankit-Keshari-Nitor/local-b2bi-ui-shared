import React from 'react';
import { useTranslation } from 'react-i18next';
import { TileGroup, RadioTile, Tooltip, Button } from '@carbon/react';
import { Information } from '@carbon/icons-react';
import './RadioTileSelection.scss';

const SFGRadioTileSelection = ({ options, defaultSelected, onSelect, ...rest }) => {
  const { t } = useTranslation();
  return (
    <>
      <TileGroup defaultSelected={defaultSelected} valueSelected={defaultSelected} onChange={onSelect} name="tile-group" className="sfg--radio-selection-tile-group">
        {options.map((tile, index) => {
          return (
            <RadioTile key={index} id={tile.id} name={tile.id} tabIndex={index} value={tile.id} className="radio-tile">
              <div className="sfg--tile-content">
                <div className="sfg--tile-title">
                  {t(tile.label)} <span> </span>
                  <Tooltip align="bottom" label={t(tile.description)}>
                    <Button className="sb-tooltip-trigger" kind="ghost" hasIconOnly renderIcon={Information} label="" iconDescription={t(tile.description)} type="button"></Button>
                  </Tooltip>
                </div>
                <div className="sfg--tile-description">{t(tile.description)}</div>
              </div>
            </RadioTile>
          );
        })}
      </TileGroup>
    </>
  );
};

export { SFGRadioTileSelection };
