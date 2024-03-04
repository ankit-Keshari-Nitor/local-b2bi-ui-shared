import React, { useState, useEffect } from 'react';

const WizardContext = React.createContext();

const WizardProvider = ({ children, onInit, onFinish, steps }) => {
  const [wizardPage, setWizardPage] = useState();
  const [wizardData, setWizardData] = useState();
  const [wizardAction, setWizardAction] = useState();
  const [wizardConfig, setWizardConfig] = useState();

  //const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [prevBtnState, setPrevBtnState] = useState();
  const [nextBtnState, setNextBtnState] = useState();
  const [wizardSteps, setWizardSteps] = useState([]);
  const stepHandler = React.useRef(() => {});
  const initHandler = React.useRef(onInit);
  const finishHandler = React.useRef(onFinish);
  // console.log(onFinish);

  useEffect(() => {
    const stepsArray = [];
    steps.forEach((step) => {
      stepsArray.push({
        id: step.props.id,
        label: step.props.label,
        path: step.props.path,
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
    setCurrentIndex(0);
  }, [steps]);

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
    if (stepHandler.current) {
      try {
        await stepHandler.current();
      } catch (err) {
        // throw err;
        // TODO: Show some notification about the error
      }
    }
    if (currentIndex < wizardSteps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (finishHandler.current) {
      try {
        await finishHandler.current();
      } catch (err) {
        // throw err;
        // TODO: Show some notification about the error
      }
    }

    //navigate(wizardSteps[currentIndex + 1].path);
  };

  const handleStep = (handler) => {
    stepHandler.current = handler;
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
        handleStep
      }}
    >
      {children(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext)}
    </WizardContext.Provider>
  );
};

const useWizard = () => {
  return React.useContext(WizardContext);
};

export { WizardContext, WizardProvider, useWizard };
