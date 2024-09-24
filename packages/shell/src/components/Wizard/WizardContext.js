import React, { useState, useEffect } from 'react';

const WizardContext = React.createContext();

const WizardProvider = ({ children, onInit, onFinish, steps, onSave, onCancel, data }) => {
  const [wizardPage, setWizardPage] = useState();
  const [wizardData, setWizardData] = useState(data || {});
  const [wizardAction, setWizardAction] = useState();
  const [wizardConfig, setWizardConfig] = useState();
  const [wizardStepErrors, setWizardStepErrors] = useState({});

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [prevBtnState, setPrevBtnState] = useState();
  const [nextBtnState, setNextBtnState] = useState();
  const [wizardSteps, setWizardSteps] = useState([]);
  const stepHandler = React.useRef(() => {});
  const initHandler = React.useRef(onInit);
  const finishHandler = React.useRef(onFinish);

  useEffect(() => {
    const stepsArray = [];
    steps?.forEach((step) => {
      stepsArray.push({
        id: step.props.id,
        label: step.props.label,
        path: step.props.path,
        secondaryLabel: step.props.secondaryLabel,
        invalid: step.props.invalid,
        element: step.props.element
      });
    });
    const handleInit = async () => {
      if (initHandler.current) {
        await initHandler.current();
      }
    };
    handleInit();
    setWizardSteps(stepsArray);
  }, [steps]);

  useEffect(() => {
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    let prev,
      next = {
        disabled: false
      };
    if (currentIndex < 1) {
      prev = {
        disabled: true
      };
    }
    /*if (currentIndex === wizardSteps.length - 1) {
      next = {
        disabled: true
      };
    }*/
    setPrevBtnState(prev);
    setNextBtnState(next);
  }, [currentIndex, wizardSteps.length]);

  const onPrevious = async () => {
    setCurrentIndex(currentIndex - 1);
    //navigate(wizardSteps[currentIndex - 1].path);
  };
  const onNext = async () => {
    let shouldGoToNext = false;
    if (stepHandler.current) {
      try {
        shouldGoToNext = await stepHandler.current();
      } catch (err) {
        // throw err;
        // TODO: Show some notification about the error
      }
    }
    if (shouldGoToNext) {
      if (currentIndex < wizardSteps.length - 1) {
        wizardSteps[currentIndex]['invalid'] = false;
        setCurrentIndex(currentIndex + 1);
      } else if (finishHandler.current) {
        try {
          await finishHandler.current();
        } catch (err) {
          // throw err;
          // TODO: Show some notification about the error
          wizardSteps[currentIndex]['showNotificationMessage'] = err.message;
        }
      }
    } else {
      // TODO: Whenever the form has the errors then we need to throw the invalid condition
      wizardSteps[currentIndex]['invalid'] = true;
    }

    //navigate(wizardSteps[currentIndex + 1].path);
  };

  const handleStep = (handler) => {
    stepHandler.current = handler;
  };

  const setWizardPageData = (wizardPageData) => {
    setWizardData({ ...wizardData, [wizardSteps[currentIndex].id]: wizardPageData });
  };

  const getWizardPageData = (wizardPageId) => {
    return wizardData[wizardPageId];
  };

  return (
    <WizardContext.Provider
      value={{
        getWizardPageConfig: (key) => {
          return steps.find((item) => {
            return item.page === key;
          });
        },
        wizardPage,
        setWizardPage,
        wizardData,
        setWizardData,
        wizardAction,
        setWizardAction,
        wizardConfig,
        setWizardConfig,
        currentIndex,
        wizardSteps,
        prevBtnState,
        nextBtnState,
        onPrevious,
        onNext,
        handleStep,
        stepHandler,
        wizardStepErrors,
        setWizardStepErrors,
        onSave,
        onCancel,
        setWizardPageData,
        getWizardPageData
      }}
    >
      {children(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext, wizardData)}
    </WizardContext.Provider>
  );
};

const useWizard = () => {
  return React.useContext(WizardContext);
};

export { WizardContext, WizardProvider, useWizard };
