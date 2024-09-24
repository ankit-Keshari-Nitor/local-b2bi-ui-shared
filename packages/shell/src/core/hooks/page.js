import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDatatable } from './data-table';
import ShellProviders from '../providers';
import { NotificationUtil } from '../utils/notification';
import { useForm } from './form';
import { usePage as usePageProvider } from '../../core/providers/PageProvider';

const tempUseHook = (hookFn, args, args2) => {
  return hookFn(args, args2);
};

const tempUseEffect = (hookFn, handleFn, observers) => {
  hookFn(handleFn, observers);
};

const useModel = (modelDefinition, context) => {
  const modelValue = {};
  const setModelValue = {};

  for (let key in modelDefinition) {
    const [modelX, setModelX] = tempUseHook(useState, modelDefinition[key]); // useState(modelDefinition[key])
    modelValue[key] = modelX;
    setModelValue['set' + key] = setModelX;
  }

  const setModel = (modelName, value) => {
    const modelPaths = modelName.split('.');
    if (modelPaths.length > 1) {
      const modelData = {
        ...modelValue[modelPaths[0]],
        [modelPaths[1]]: value
      };
      modelValue[modelPaths[0]] = modelData;
      setModelValue['set' + modelPaths[0]](modelData);
    } else {
      setModelValue['set' + modelName](value);
    }
  };
  return [modelValue, setModel];
};

const useUI = (uiDefinition, context) => {
  const uiValue = {};
  const setUiValue = {};
  for (let key in uiDefinition) {
    const [uiX, setUiX] = tempUseHook(useState, uiDefinition[key]);
    uiValue[key] = uiX;
    setUiValue['set' + key] = setUiX;
  }
  const setUI = (propKey, value) => {
    try {
      setUiValue['set' + propKey](value);
    } catch (err) {
      console.error(propKey);
      console.error(err);
    }
  };
  return [uiValue, setUI];
};

const useDataSource = (dsDefinition, context) => {
  const ds = {};
  const { DataService, getDataLoaderConfig } = ShellProviders.useDataService();

  const initDs = [];

  const showDsLoadingState = (dsObj, options, state) => {
    if (!(dsObj.skipLoader || options?.skipLoader)) {
      context.utils.showLoadingState(state);
      // console.log('showing loader', state);
    } else {
      // console.log('Skipping loader');
    }
  };

  const handleDs = function (dsName, data, options) {
    if (dsDefinition[dsName].handleOutput && dsDefinition[dsName].handleOutput.length > 0) {
      context[dsDefinition[dsName].handleOutput[0]](data);
    }
    if (dsDefinition[dsName].outputModel !== undefined) {
      context.setModel(dsDefinition[dsName].outputModel, data);
    }
  };

  for (let dsName in dsDefinition) {
    ds[dsName] = function (input, options) {
      let inputModel = ds[dsName].definition.inputModel;
      if (typeof inputModel === 'string') {
        inputModel = context.model[inputModel];
      }
      const dsInput = input || inputModel || {};
      const dsOutput = {};
      const dsOptions = options || {};
      if (dsDefinition[dsName].loadingState !== undefined) {
        context.setUI(dsDefinition[dsName].loadingState, true);
      }
      dsDefinition[dsName].loading = true;

      const pageDsPromise = new Promise((resolve, reject) => {
        try {
          showDsLoadingState(ds[dsName].definition, options, true);
          const dsPromise = DataService.call(dsDefinition[dsName].dataloader, dsInput, dsOptions);
          dsPromise
            .then((resp) => {
              const dlConfig = getDataLoaderConfig(dsDefinition[dsName].dataloader);

              if (dlConfig.handleOutput) {
                dlConfig.handleOutput(resp);
              }
              if (!options?.skipHandler) {
                handleDs(dsName, resp.data, options);
              }
              resolve(resp);
            })
            .catch((err) => {
              if (err.code === 'ERR_NETWORK') {
                context.utils.showNotificationMessage('toast', 'error', err.message);
              } else if (err.response.data && err.response.data.errorCode) {
                // context.utils.showNotificationMessage('toast','error', context.t(`mod-api:${err.response.data.statusCode}.errorCode.${err.response.data.errorCode}`));
                context.utils.showNotificationMessage('toast', 'error', err.response.data.message);
              } else {
                context.utils.showNotificationMessage('toast', 'error', err.response.statusText);
              }
              reject(err);
            })
            .finally(() => {
              if (dsDefinition[dsName].loadingState !== undefined) {
                context.setUI(dsDefinition[dsName].loadingState, false);
              }
              showDsLoadingState(ds[dsName].definition, options, false);
              dsDefinition[dsName].loading = true;
            });
        } catch (err) {
          console.log(err);
          reject(err);
          showDsLoadingState(ds[dsName].definition, options, false);
        }
      });

      return pageDsPromise;
    };

    ds[dsName].definition = dsDefinition[dsName];
    if (dsDefinition[dsName].init) {
      initDs.push(dsName);
    }
  }
  ds._init = function () {
    try {
      const promiseArray = [];
      initDs.forEach((dsName) => {
        promiseArray.push(this.ds[dsName](undefined, { skipHandler: true }));
      });
      return Promise.all(promiseArray).then(
        (values) => {
          initDs.forEach((dsName, index) => {
            handleDs(dsName, values[index]?.data);
          });
          //this.pageInitialized('SUCCESS');
          return values;
        },
        (err) => {
          console.log(err);
          throw err;
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  ds.makeSequentialDSCalls = function (dsArray) {
    const results = [];
    const resultMap = {};
    let dsIndex = 0;
    let hasError = false;
    return dsArray
      .reduce((chain, dsItem) => {
        return chain.then(() => {
          const prevResponse = dsIndex > 0 ? results[dsIndex - 1] : {};

          hasError = hasError || !(prevResponse.status === undefined || (prevResponse.status >= 200 && prevResponse.status < 300));
          const dsItemConfig = dsItem(prevResponse, results);
          dsIndex++;
          if (dsItemConfig && !hasError) {
            // Make the actual data source call using the generated configuration
            return ds[dsItemConfig.name](dsItemConfig.input, dsItemConfig.options)
              .then((data) => {
                results.push(data);
                resultMap[dsItemConfig.name] = data;
              })
              .catch((err) => {
                console.log(err);
                hasError = true;
                results.push(err.response);
                resultMap[dsItemConfig.name] = err.response;
              });
          } else {
            // If dsItemConfig is undefined, make a dummy call that resolves to an empty object
            return Promise.resolve({}).then((data) => {
              results.push(data);
              resultMap[dsItemConfig.name] = data;
            });
          }
        });
      }, Promise.resolve())
      .then(() => {
        return { results, resultMap };
      })
      .catch((error) => {
        console.error('Error:', error);
        return { results, resultMap };
      });
  };
  return ds;
};

const handleObservers = (observersDefinition, context) => {
  observersDefinition &&
    observersDefinition.forEach((observerDef) => {
      tempUseEffect(useEffect, observerDef.handler.bind(context), observerDef.observers.bind(context)());
    });
};

const usePage = (dependencies, pageDefinition, pageConfig) => {
  const page = {};
  const isPageInitialized = useRef(false);
  const notificationUtil = NotificationUtil();
  const { loadingState, setLoadingState, PAGE_STATE, pageStatus, setPageStatus } = usePageProvider();
  const [loadingCount, setLoadingCount] = useState(0);

  const showLoadingState = (state) => {
    setLoadingCount((prevValue) => {
      return state ? prevValue + 1 : prevValue - 1;
    });
  };

  useEffect(() => {
    if (loadingCount === 0 && loadingState) {
      setLoadingState(false);
    } else if (loadingCount > 0 && !loadingState) {
      setLoadingState(true);
    }
  }, [loadingCount, loadingState, setLoadingState]);

  page.navigate = useNavigate();
  page.utils = {
    ...notificationUtil,
    showLoadingState
  };

  const [model, setModel] = useModel(pageDefinition.model);
  const [ui, setUI] = useUI(pageDefinition.ui);
  const ds = useDataSource(pageDefinition.datasources, page);
  const { t } = useTranslation();

  page.model = model;
  page.setModel = setModel;
  page.ui = ui;
  page.setUI = setUI;
  page.ds = ds;
  page.ds._init = ds._init.bind(page);
  page.t = t;

  page.form = {};
  for (let form in pageDefinition.form) {
    const {
      register,
      formState: { errors },
      handleSubmit,
      getValues,
      setValue,
      reset,
      resetField,
      watch,
      setError,
      clearErrors,
      control,
      trigger
    } = tempUseHook(
      useForm,
      {
        mode: 'onChange',
        defaultValues: {
          ...pageDefinition.form[form]
        },
        name: form
      },
      form
    );

    page.form[form] = {
      register,
      formState: { errors },
      handleSubmit,
      getValues,
      setValue,
      reset,
      resetField,
      watch,
      setError,
      clearErrors,
      control,
      trigger,
      attributes: pageDefinition.form[form]
    };
  }
  page.config = pageDefinition.config;

  page.datatable = {};
  for (let datatableName in pageDefinition.datatable) {
    const datatableConfig = pageDefinition.datatable[datatableName];
    for (let key in datatableConfig) {
      if (key.length > 2 && (key.startsWith('ui') || key.startsWith('_') || key.startsWith('get'))) {
        datatableConfig[key] = datatableConfig[key].bind(page);
      }
    }
    page.datatable[datatableName] = tempUseHook(useDatatable, datatableConfig);
  }

  // set UI Functions

  for (let key in pageDefinition) {
    if (key.length > 2 && (key.startsWith('ui') || key.startsWith('_'))) {
      page[key] = pageDefinition[key].bind(page);
    }
  }

  if (pageDefinition.init) {
    page.init = pageDefinition.init.bind(page);
  } else {
    page.init = () => {};
  }

  handleObservers(pageDefinition.observers, page);
  useEffect(() => {
    if (!isPageInitialized.current) {
      // handleObservers(pageDefinition.observers, page);
      page.ds
        ._init()
        .then(() => {
          page.init();
        })
        .catch((err) => {
          console.log(err);
          setPageStatus(PAGE_STATE.PAGE_INIT_DS_ERROR);
        });
      isPageInitialized.current = true;
    }
  }, []);

  return { page };
};

export { usePage };
