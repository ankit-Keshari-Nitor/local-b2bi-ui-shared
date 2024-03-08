import React from 'react';
import { TextInput, Button, Checkbox, CheckboxGroup, Tag, Link, Section, ComboBox, Form, RadioButtonGroup, RadioButton } from '@carbon/react';
import { Close } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
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
    getValues
  } = useForm({ defaultValues: defaultValues }, 'filter');
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
  useEffect(() => {
    if (Object.entries(values).length) {
      const formValue = JSON.parse(JSON.stringify(values));
      reset(formValue);
    }
  }, [values]);

  useEffect(() => {
    const formDefaultValue = {};
    filterList.forEach((filter) => {
      if (filter.type === 'input') {
        formDefaultValue[filter.name] = filter.defaultValue ? filter.defaultValue : '';
      } else if (filter.type === 'combobox') {
        formDefaultValue[filter.name] = filter.defaultValue ? filter.defaultValue : '';
      } else if (filter.type === 'checkbox-group') {
        formDefaultValue[filter.name] = filter.defaultValue ? filter.defaultValue : [];
      } else if (filter.type === 'radio-group') {
        formDefaultValue[filter.name] = filter.defaultValue ? filter.defaultValue : '';
      }
    });
    setDefaultFormValue(formDefaultValue);
  }, [filterList]);

  return (
    <Form className="sfg--filter-form" name="filter" onSubmit={handleSubmit(onSubmit)}>
      <Section className="sfg--filter-header">
        <div className="sfg--filter-title"> {t('shell:common.filter-section.filter')}</div>
        <div>
          <Button kind="ghost" data-testid="filter-clear-btn" name="clear" onClick={() => onReset()} renderIcon={Close} type="reset">
            {t('shell:common.filter-section.clear-filter')}
          </Button>
        </div>
      </Section>
      <Section className="sfg--filter-field-container">
        {filterList.map((item, i) => {
          if (item.type === 'input') {
            return (
              <TextInput
                className="sfg--filter-field"
                data-testid={item.id}
                id={item.id}
                key={item.name}
                type="text"
                {...register(item.name, {}, 'text-input')}
                labelText={t(item.label)}
              />
            );
          }
          if (item.type === 'combobox') {
            return (
              <ComboBox
                className="sfg--filter-field"
                data-testid={item.id}
                id={item.id}
                key={item.name}
                items={filterListData[item.name] || []}
                {...register(item.name, {}, 'combobox')}
                itemToString={(item) => (item ? item?.text : '')}
                titleText={t(item.label)}
                onInputChange={(inputText) => {
                  if (inputText.length > 2) {
                    const data = {
                      ...filterListData
                    };
                    item.getFilteredOptions(inputText, item).then((filterList) => {
                      data[item.name] = filterList;
                      setFilterListData(data);
                    });
                  }
                }}
              ></ComboBox>
            );
          }
          if (item.type === 'checkbox-group') {
            return (
              <CheckboxGroup key={item.name} legendText={t(item.label)} className="sfg--filter-field checkbox-group">
                {item.options.map((checkbox, j) => {
                  return (
                    <Checkbox
                      key={checkbox.name}
                      data-testid={checkbox.id}
                      value={checkbox.value}
                      labelText={t(checkbox.label)}
                      {...register(item.name, {}, 'checkbox')}
                      id={'filter' + '.' + item.name + '.' + checkbox.value}
                    />
                  );
                })}
                {watch(item.name)?.length > 0 && (
                  <Tag size="sm" filter type="high-contrast" title="Clear Filter" key={item.name + i} onClose={() => OnClose(item.name)}>
                    {watch(item.name).length}
                  </Tag>
                )}
              </CheckboxGroup>
            );
          }
          if (item.type === 'radio-group') {
            return (
              <RadioButtonGroup
                key={item.name}
                {...register(item.name, {}, 'radio-group')}
                legendText={t(item.label)}
                valueSelected={getValues(item.name)}
                className="sfg--filter-field radio-group"
                orientation="vertical"
              >
                {item.options.map((radio, j) => {
                  return (
                    <RadioButton
                      key={radio.name}
                      {...register(item.name, {}, 'radio')}
                      id={'filter' + '.' + item.name + '.' + radio.value}
                      labelText={t(radio.label)}
                      value={radio.value}
                    />
                  );
                })}
              </RadioButtonGroup>
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
    </Form>
  );
};

export default DataTableFilter;
export { DataTableFilter };
