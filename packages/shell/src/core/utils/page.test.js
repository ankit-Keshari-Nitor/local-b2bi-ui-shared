import { renderHook, act } from '@testing-library/react-hooks';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useResource } from '../providers/ResourceProvider';
import { ModalUtil } from './modal';
import { NotificationUtil } from './notification';
import { PageUtil } from './page';

jest.mock('react-i18next');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));
jest.mock('../providers/ResourceProvider', () => ({
  useResource: jest.fn(),
}));
jest.mock('./modal');
jest.mock('./notification');

describe('PageUtil', () => {
  let t;
  let modalUtil;
  let notificationUtil;
  let hasAccess;
  let pageParams;
  let navigate;

  beforeEach(() => {
    // Set up mocks
    t = jest.fn();
    modalUtil = {
      showInformationModal: jest.fn(),
      showConfirmationModal: jest.fn(),
      showWarningModal: jest.fn(),
      showErrorModal: jest.fn(),
      showPageModal: jest.fn(),
    };
    notificationUtil = {
      showNotificationMessage: jest.fn(),
    };
    hasAccess = jest.fn();
    pageParams = { id: 'test-id' };
    navigate = jest.fn();

    useTranslation.mockReturnValue({ t });
    useNavigate.mockReturnValue(navigate);
    useParams.mockReturnValue(pageParams);
    useResource.mockReturnValue({ hasAccess });
    ModalUtil.mockReturnValue(modalUtil);
    NotificationUtil.mockReturnValue(notificationUtil);
  });

  it('should call a method on a page object when it exists', () => {
    const { result } = renderHook(() => PageUtil());
    const page = { sampleMethod: jest.fn().mockReturnValue('Sample Result') };
    const methodName = 'sampleMethod';
    const args = ['arg1', 'arg2'];

    const resultValue = result.current.callPageMethod(page, methodName, args);

    expect(page.sampleMethod).toHaveBeenCalledWith('arg1', 'arg2');
    expect(resultValue).toBe('Sample Result');
  });

  it('should call showStoredMessage and remove item from localStorage', () => {
    // Set up a test key and value in localStorage
    const key = 'testKey';
    const storedMessage = {
      kind: 'info',
      message: 'Test Message',
    };
    localStorage.setItem(key, JSON.stringify(storedMessage));

    const { result } = renderHook(() => PageUtil());

    // Call showStoredMessage
    act(() => {
      result.current.showStoredMessage(key);
    });

    // Check that showNotificationMessage was called
    expect(notificationUtil.showNotificationMessage).toHaveBeenCalledWith(
      'banner',
      storedMessage.kind,
      storedMessage.message
    );

    // Check that the item was removed from localStorage
    expect(localStorage.getItem(key)).toBeNull();
  });

  it('should call setStoredMessage and store message in localStorage', () => {
    const { result } = renderHook(() => PageUtil());
    const key = 'testKey';
    const message = {
      kind: 'info',
      message: 'Test Message',
    };

    // Call setStoredMessage
    act(() => {
      result.current.setStoredMessage(key, message);
    });

    // Check that the message was stored in localStorage
    const storedValue = JSON.parse(localStorage.getItem(key));
    expect(storedValue).toEqual(message);
  });

  it('should have expected object properties', () => {
    const { result } = renderHook(() => PageUtil());

    expect(result.current.t).toBe(t);
    expect(result.current.navigate).toBe(navigate);
    expect(result.current.pageParams).toBe(pageParams);
    expect(result.current.hasAccess).toBe(hasAccess);
    expect(result.current.showInformationModal).toBe(modalUtil.showInformationModal);
    expect(result.current.showConfirmationModal).toBe(modalUtil.showConfirmationModal);
    expect(result.current.showWarningModal).toBe(modalUtil.showWarningModal);
    expect(result.current.showErrorModal).toBe(modalUtil.showErrorModal);
    expect(result.current.showPageModal).toBe(modalUtil.showPageModal);
    expect(result.current.showNotificationMessage).toBe(notificationUtil.showNotificationMessage);
  });
});
