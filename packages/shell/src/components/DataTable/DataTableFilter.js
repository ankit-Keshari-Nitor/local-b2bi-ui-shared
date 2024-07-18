import React from 'react';
import { TextInput, Button, Checkbox, CheckboxGroup, Tag, Link, Section, ComboBox, Form, RadioButtonGroup, RadioButton } from '@carbon/react';
import { Close } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import CDS from '../../cds';
import { useForm } from '../../core/hooks/form';

import './DataTableFilter.scss';

const DataTableFilter = ({ values = {}, defaultValues = {}, filterList = [], onApply, onCancel, onClear }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { isDirty },
    reset,
    getValues,
    control
  } = useForm({ defaultValues: defaultValues }, 'filter');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [defaultFormValue, setDefaultFormValue] = useState({});
  const [filterListData, setFilterListData] = useState({});

  const onReset = () => {
    reset(defaultFormValue);
    onClear();
  };
  const OnClose = (key) => {
    resetField(key, { defaultValue: [] });
    if (values[key]?.length) {
      setIsChange(true);
    }
  };
  const onSubmit = (data) => {
    onApply(data);
  };
  /*
  useEffect(() => {
    if (Object.entries(values).length) {
      const formValue = JSON.parse(JSON.stringify(values));
      reset(formValue);
    }
  }, [values]);*/

  useEffect(() => {
    const formDefaultValue = {};
    const filterListDataTemp = {};
    filterList.forEach((filter) => {
      if (filter.type === 'input') {
        formDefaultValue[filter.name] = values[filter.name] ? values[filter.name] : filter.defaultValue ? filter.defaultValue : '';
      } else if (filter.type === 'date') {
        formDefaultValue[filter.name] = values[filter.name] ? values[filter.name] : filter.defaultValue ? filter.defaultValue : '';
      } else if (filter.type === 'combobox') {
        formDefaultValue[filter.name] = values[filter.name] ? values[filter.name] : filter.defaultValue ? filter.defaultValue : '';
        if (!filterListData[filter.name]) {
          filterListDataTemp[filter.name] = filter.getOptions? filter.getOptions() : filter.options.length ? filter.options : [];
        }
      } else if (filter.type === 'checkbox-group') {
        formDefaultValue[filter.name] = values[filter.name] ? values[filter.name] : filter.defaultValue ? filter.defaultValue : [];
      } else if (filter.type === 'radio-group') {
        formDefaultValue[filter.name] = values[filter.name] ? values[filter.name] : filter.defaultValue ? filter.defaultValue : '';
      } else if (filter.type === 'toggle') {
        formDefaultValue[filter.name] = values[filter.name] ? values[filter.name] : filter.defaultValue ? filter.defaultValue : '';
      }
    });
    setFilterListData({
      ...filterListData,
      ...filterListDataTemp
    });
    setDefaultFormValue(formDefaultValue);
    reset(formDefaultValue);
    setIsInitialized(true);
  }, [filterList, values]);

  const filterItems = (menu) => {
    return menu?.item?.toLowerCase().includes(menu?.inputValue?.toLowerCase());
  };

  return (
    <CDS.Form
      className="sfg--filter-form"
      name="filter"
      onSubmit={handleSubmit(onSubmit)}
      context={{ register, handleSubmit, watch, resetField, formState: { isDirty }, reset, getValues, control }}
    >
      <Section className="sfg--filter-header">
        <div className="sfg--filter-title"> {t('shell:common.filter-section.filter')}</div>
        <div>
          <Button kind="ghost" data-testid="filter-clear-btn" name="clear" onClick={() => onReset()} renderIcon={Close} type="reset">
            {t('shell:common.filter-section.clear-filter')}
          </Button>
        </div>
      </Section>
      <Section className="sfg--filter-field-container">
        {isInitialized &&
          filterList
            .filter((item) => {
              return item.isVisible || item.isVisible === undefined;
            })
            .map((item, i) => {
              if (item.type === 'input') {
                return <CDS.TextInput className="sfg--filter-field" data-testid={item.id} id={item.id} key={item.name} type="text" name={item.name} labelText={t(item.label)} />;
              }
              if (item.type === 'date') {
                return <CDS.DateInput className="sfg--filter-field" data-testid={item.id} id={item.id} key={item.name} name={item.name} labelText={t(item.label)} />;
              }
              if (item.type === 'combobox') {
                return (
                  <CDS.ComboBox
                    className="sfg--filter-field"
                    data-testid={item.id}
                    id={item.id}
                    key={item.name}
                    items={filterListData[item.name] || []}
                    name={item.name}
                    itemToString={(dataItem) => (dataItem ? (item.displayValue ? dataItem[item.displayValue] : dataItem?.text) : '')}
                    getValue={(dataItem) => dataItem}
                    //selectedItem={getValues(item.name)}
                    //itemToElement={(item) => (item ? <span>{item.text}</span> : '')}
                    titleText={t(item.label)}
                    onInputChange={(inputText) => {
                      if (item.getFilteredOptions && inputText.length > 2) {
                        const data = {
                          ...filterListData
                        };
                        item.getFilteredOptions(inputText, item).then((filterList) => {
                          data[item.name] = filterList;
                          setFilterListData(data);
                        });
                      }
                    }}
                    // shouldFilterItem={filterItems}
                  ></CDS.ComboBox>
                );
              }
              if (item.type === 'checkbox-group') {
                return (
                  <CDS.CheckboxGroup key={item.name} legendText={t(item.label)} disabled={item.disabled} className="sfg--filter-field checkbox-group">
                    {item.options.map((checkbox, j) => {
                      return (
                        <CDS.Checkbox
                          key={checkbox.name}
                          data-testid={checkbox.id}
                          value={checkbox.value}
                          labelText={item?.mode === 'STATIC' ? checkbox.label : t(checkbox.label)}
                          name={item.name}
                          disabled={checkbox.disabled}
                          id={'filter.' + item.name + '.' + checkbox.value}
                        />
                      );
                    })}
                    {watch(item.name)?.length > 0 && (
                      <Tag size="sm" filter type="high-contrast" title="Clear Filter" key={item.name + i} onClose={() => OnClose(item.name)}>
                        {watch(item.name).length}
                      </Tag>
                    )}
                  </CDS.CheckboxGroup>
                );
              }
              if (item.type === 'radio-group') {
                return (
                  <CDS.RadioButtonGroup
                    key={item.name}
                    name={item.name}
                    legendText={t(item.label)}
                    valueSelected={getValues(item.name)}
                    className="sfg--filter-field radio-group"
                    orientation="vertical"
                  >
                    {item.options.map((radio, j) => {
                      return <CDS.RadioButton key={radio.name} name={item.name} id={'filter.' + item.name + '.' + radio.value} labelText={t(radio.label)} value={radio.value} />;
                    })}
                  </CDS.RadioButtonGroup>
                );
              }
              if (item.type === 'toggle') {
                return (
                  <CDS.Toggle key={item.name} labelText={t(item.label)} labelA={t(item.labelA)} labelB={t(item.labelB)} name={item.name} id={'filter.' + item.name}></CDS.Toggle>
                );
              }
            })}
      </Section>
      <Section className="sfg--fitler-footer">
        <Button kind="ghost" onClick={() => onCancel()} className="" name="cancel" data-testid="filter-cancel-btn">
          {t('shell:common.actions.cancel')}
        </Button>
        <Button type="submit" className="" disabled={!isDirty && !isChange} name="apply" data-testid="filter-apply-btn">
          {t('shell:common.actions.apply')}
        </Button>
      </Section>
    </CDS.Form>
  );
};

export default DataTableFilter;
export { DataTableFilter };
