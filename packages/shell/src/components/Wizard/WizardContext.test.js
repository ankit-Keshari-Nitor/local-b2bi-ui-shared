import { cleanup, fireEvent, render, find, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { WizardProvider, useWizard } from './WizardContext';

const steps = [
  {
    props: {
      id: '1',
      label: 'Step 1',
      element: <>Wizard Step </>
    }
  },
  {
    props: {
      id: '2',
      label: 'Step 2',
      element: <>Wizard Step </>
    }
  },
  {
    props: {
      id: '3',
      label: 'Step 3',
      element: <>Wizard Step </>
    }
  },
  {
    props: {
      id: '4',
      label: 'Step 4',
      element: <>Wizard Step </>
    }
  }
];
const TestingComponent = ({ stepHandler, ...props }) => {
  const { currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext, handleStep } = useWizard();
  // console.log('currentIndex', currentIndex);
  handleStep(stepHandler);
  return (
    <>
      <div>
        <span data-testid="currentIndex">{currentIndex}</span>
      </div>
      <div>
        <div>
          {wizardSteps.map((step) => (
            <div key={step.id}>{step.element}</div>
          ))}
        </div>
      </div>
      <div>
        <button data-testid="prev" {...prevBtnState} onClick={onPrevious}></button>
        <button data-testid="next" {...nextBtnState} onClick={onNext}></button>
      </div>
    </>
  );
};

describe('Wizard Context, provider', () => {
  it('Verify the Wizard Context, provider', async () => {
    render(<WizardProvider steps={steps}>{(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext) => <TestingComponent></TestingComponent>}</WizardProvider>);
    expect((await screen.findByTestId('currentIndex')).innerHTML).toBe('0');
  });

  it('Verify the prevBtnState and nextButtonState are updated on currentIndex change', async () => {
    render(
      <WizardProvider steps={steps}>
        {(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext) => <TestingComponent stepHandler={() => {}}></TestingComponent>}
      </WizardProvider>
    );
    let prevBtn = await screen.findByTestId('prev');
    let nextBtn = await screen.findByTestId('next');
    expect(prevBtn.disabled).toBe(true);

    act(() => {
      fireEvent.click(nextBtn);
    });
    expect(nextBtn.disabled).toBe(false);
    expect((await screen.findByTestId('currentIndex')).innerHTML).toBe('1');

    prevBtn = await screen.findByTestId('prev');
    act(() => {
      fireEvent.click(prevBtn);
    });
    expect(prevBtn.disabled).toBe(true);
    expect((await screen.findByTestId('currentIndex')).innerHTML).toBe('0');
  });

  it('Verify the logic around stepHandler when it is implemented', async () => {
    const fakeStepHandler = jest.fn((e) => {});
    render(
      <WizardProvider steps={steps}>
        {(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext) => <TestingComponent stepHandler={fakeStepHandler}></TestingComponent>}
      </WizardProvider>
    );
    const nextBtn = await screen.findByTestId('next');
    act(() => {
      fireEvent.click(nextBtn);
    });
    expect(fakeStepHandler).toBeCalledTimes(1);
  });

  it('Verify the logic around stepHandler when it is not implemented', async () => {
    render(
      <WizardProvider steps={steps}>
        {(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext) => <TestingComponent stepHandler={undefined}></TestingComponent>}
      </WizardProvider>
    );
    const nextBtn = await screen.findByTestId('next');
    act(() => {
      fireEvent.click(nextBtn);
    });
  });

  it('Verify the logic around stepHandler when it throws error', async () => {
    const fakeStepHandler = jest.fn(() => {
      throw new Error('Step Error');
    });
    render(
      <WizardProvider steps={steps}>
        {(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext) => <TestingComponent stepHandler={fakeStepHandler}></TestingComponent>}
      </WizardProvider>
    );
    const nextBtn = await screen.findByTestId('next');

    act(() => {
      fireEvent.click(nextBtn);
    });
    expect(fakeStepHandler).toBeCalledTimes(1);
  });

  it('Verify the logic around initHandler when it is implemented', async () => {
    const fakeInitHandler = jest.fn(() => {});
    act(() => {
      render(
        <WizardProvider onInit={fakeInitHandler} steps={steps}>
          {(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext) => <TestingComponent stepHandler={() => {}}></TestingComponent>}
        </WizardProvider>
      );
    });
    expect(fakeInitHandler).toBeCalledTimes(1);
  });

  it('Verify the logic around finishHandler when it is implemented', async () => {
    const fakeFinishHandler = jest.fn(() => {});
    act(() => {
      render(
        <WizardProvider onFinish={fakeFinishHandler} steps={steps}>
          {(currentIndex, wizardSteps, prevBtnState, nextBtnState, onPrevious, onNext) => <TestingComponent stepHandler={() => {}}></TestingComponent>}
        </WizardProvider>
      );
    });
    let nextBtn = await screen.findByTestId('next');
    act(() => {
      fireEvent.click(nextBtn);
    });
    nextBtn = await screen.findByTestId('next');
    act(() => {
      fireEvent.click(nextBtn);
    });
    nextBtn = await screen.findByTestId('next');
    act(() => {
      fireEvent.click(nextBtn);
    });
    nextBtn = await screen.findByTestId('next');
    act(() => {
      fireEvent.click(nextBtn);
    });
    await waitFor(() => {
      expect(fakeFinishHandler).toBeCalledTimes(1);
    });

    //nextBtn = await screen.findByTestId('next');
    //expect(nextBtn.innerHTML).toBe("shell:wizard.actions.submit");
  });
});
