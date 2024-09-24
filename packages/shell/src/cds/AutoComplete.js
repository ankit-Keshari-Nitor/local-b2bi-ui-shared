import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { FilterableMultiSelect as CDSFilterableMultiSelect, ComboBox as CDSComboBox, InlineLoading } from '@carbon/react';
import { processRules } from './FormUtils';
import { useTranslation } from 'react-i18next';

const AutoComplete = ({
  name,
  items,
  rules,
  disabled,
  itemToString,
  getValue,
  controller,
  multiple = false,
  initialSelectedValue = null,
  titleText,
  itemsPerFetch = 20,
  ...props
}) => {
  let autocompleteController = controller;
  let inv = initialSelectedValue ? (Array.isArray(initialSelectedValue) ? initialSelectedValue : [initialSelectedValue]) : [];
  const { control } = useFormContext();
  const { t } = useTranslation();
  const processedRules = processRules(rules, t);
  const [focused, setFocused] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [dropdownOptions, setDropdownOptions] = useState(inv);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState('inactive');

  const addEnterButton = async () => {
    const toggleInput = await document?.querySelector('.cds--autocomplete')?.querySelector('.cds--list-box__field')?.querySelector('.cds--list-box__menu-icon');
    toggleInput.style.display = 'none';

    const lazyIconInput = await document?.querySelector('.cds--autocomplete')?.querySelector('.cds--list-box__field');
    let a = document.createElement('button');
    a.id = 'cds--autocomplete-enter';
    a.className = 'cds--list-box__menu-icon';
    a.type = 'button';
    a.role = 'button';
    a.tabIndex = '-1';
    a.onclick = function () {
      onSearchClick();
    };

    a.innerHTML =
      '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M28 6H30V26H28zM17 6L15.57 7.393 23.15 15 2 15 2 17 23.15 17 15.57 24.573 17 26 27 16 17 6z"></path></svg>';

    lazyIconInput.appendChild(a);
  };

  const updateEnterButtonState = (state) => {
    const lazyInput = document?.getElementById('cds--autocomplete-enter');
    if (state) {
      lazyInput.className = 'cds--list-box__menu-icon cds--autocomplete-enter-disabled';
    } else {
      lazyInput.className = 'cds--list-box__menu-icon';
    }

    lazyInput.disabled = state;
  };

  const onSearchClick = () => {
    const formName = control?._options?.name;
    const lazyInput = document?.getElementById(multiple ? `${formName + '.' + name + '-input'}` : `${formName + '.' + name}`);
    let enterEvent = new KeyboardEvent('keyup', {
      key: 'Enter',
      keyCode: 13,
      which: 13
    });
    lazyInput.dispatchEvent(enterEvent);
  };

  const updateDropdownOptions = (data) => {
    let tempDropdownList = dropdownOptions.concat(data);
    if (pageCount + 1 < totalPages) {
      tempDropdownList.push({
        id: 'load-more',
        name: t('shell:common.actions.loadMore'),
        disabled: true,
        onClick: () => {
          setPageCount((count) => count + 1);
        }
      });
    } else {
      tempDropdownList = tempDropdownList.filter((item) => item.id !== 'load-more');
    }

    const arrayUniqueByKey = [...new Map(tempDropdownList.map((item) => [item['id'], item])).values()];
    arrayUniqueByKey.push(
      arrayUniqueByKey.splice(
        arrayUniqueByKey.findIndex((v) => v.id === 'load-more'),
        1
      )[0]
    );

    setDropdownOptions(arrayUniqueByKey);
  };

  const getDropdownList = async (pageCount) => {
    setLoading('active');
    const res = await autocompleteController({ page: pageCount, size: itemsPerFetch });
    setTotalPages(res?.data?.page?.totalPages);
    setLoading('finished');
    setTimeout(() => {
      setLoading('inactive');
    }, 1500);
  };

  const getDropdownSearchList = async (search) => {
    setLoading('active');
    await autocompleteController({ name: search });
    setLoading('finished');
    setTimeout(() => {
      setLoading('inactive');
    }, 1500);
  };

  useEffect(() => {
    if (focused) getDropdownList(pageCount);
  }, [pageCount, focused]);

  useEffect(() => {
    if (items && items.length > 0) {
      updateDropdownOptions(items);
    }
  }, [items]);

  useEffect(() => {
    setFocused(true);
  }, []);

  useEffect(() => {
    if (focused) {
      addEnterButton();
    }
  }, [focused]);

  const eventDef = (event) => {
    if (event.key === 'Enter') {
      getDropdownSearchList(dropdownSearch);
    }
  };

  useEffect(() => {
    if (focused) {
      const formName = control?._options?.name;
      const lazyInput = document?.getElementById(multiple ? `${formName + '.' + name + '-input'}` : `${formName + '.' + name}`);

      lazyInput?.addEventListener('keyup', eventDef);
      return () => lazyInput.removeEventListener('keyup', eventDef);
    }
  }, [dropdownSearch]);

  return (
    <Controller
      control={control}
      name={name}
      rules={processedRules}
      disabled={disabled}
      render={({ field: { onChange, onBlur, value, disabled, name, ref }, fieldState: { invalid, isTouched, isDirty, error }, formState }) => {
        const id = control?._options.name ? control._options.name + '.' + name : name;

        //for single select
        const onChangeTemp = async (val) => {
          if (val?.inputValue) {
            return;
          }

          if (val?.selectedItem === null) {
            onChange(null);
            updateEnterButtonState(false);
          } else {
            onChange(getValue !== undefined ? getValue(val.selectedItem) : val.selectedItem?.id);
            updateEnterButtonState(true);
          }
        };

        const selectedItem =
          !multiple &&
          dropdownOptions &&
          value &&
          dropdownOptions.filter((item) => {
            if (typeof value === 'object') {
              return item.id === value.id;
            }
            return item.id === value;
          })?.[0];

        //for multiselect
        const onChangeTempMS = (val) => {
          if (val?.selectedItem === null) {
            onChange(null);
          } else {
            onChange(getValue !== undefined ? val.selectedItems.map((selectedItem) => getValue(selectedItem)) : val.selectedItems.map((selectedItem) => selectedItem.id));
          }
        };

        const selectedItems =
          multiple &&
          dropdownOptions.filter((item) =>
            value?.find((selectedItem) => {
              if (typeof selectedItem === 'object') {
                return item.id === selectedItem.id;
              }
              return item.id === selectedItem;
            })
          );

        itemToString = itemToString ? itemToString : (item) => (item ? item.displayValue : '');
        const filterItems = (menu) => {
          return menu?.item.name?.toLowerCase().includes(menu?.inputValue?.toLowerCase());
        };

        return multiple ? (
          <CDSFilterableMultiSelect
            className="cds--autocomplete"
            titleText={titleText}
            id={id}
            name={name}
            onChange={onChangeTempMS}
            onBlur={onBlur}
            disabled={disabled}
            ref={ref}
            initialSelectedItems={selectedItems}
            items={dropdownOptions}
            itemToString={itemToString}
            invalid={invalid}
            invalidText={error?.message}
            selectionFeedback="top-after-reopen"
            onInputValueChange={(searchText) => {
              setDropdownSearch(searchText);
            }}
            itemToElement={(item) => {
              if (item?.id === 'load-more') {
                return (
                  <div className="sfg--autocomplete--load-more" onClick={item?.onClick}>
                    {loading !== 'inactive' ? (
                      <InlineLoading status={loading} description={loading === 'finished' ? t('shell:common.actions.done') : t('shell:common.actions.loading')} />
                    ) : (
                      item?.name
                    )}
                  </div>
                );
              } else {
                return item?.name;
              }
            }}
            compareItems={() => {}}
            {...props}
          />
        ) : (
          <>
            <CDSComboBox
              allowCustomValue
              className="cds--autocomplete"
              titleText={titleText}
              id={id}
              name={name}
              onChange={onChangeTemp}
              onBlur={onBlur}
              disabled={disabled}
              ref={ref}
              selectedItem={selectedItem}
              items={dropdownOptions}
              itemToString={itemToString}
              invalid={invalid}
              invalidText={error?.message}
              shouldFilterItem={filterItems}
              itemToElement={(item) => {
                if (item?.id === 'load-more') {
                  return (
                    <div className="sfg--autocomplete--load-more" onClick={item?.onClick}>
                      {loading !== 'inactive' ? (
                        <InlineLoading status={loading} description={loading === 'finished' ? t('shell:common.actions.done') : t('shell:common.actions.loading')} />
                      ) : (
                        item?.name
                      )}
                    </div>
                  );
                } else {
                  return item?.name;
                }
              }}
              onInputChange={(searchText) => {
                setDropdownSearch(searchText);
              }}
              {...props}
            />
          </>
        );
      }}
    ></Controller>
  );
};

export default AutoComplete;
