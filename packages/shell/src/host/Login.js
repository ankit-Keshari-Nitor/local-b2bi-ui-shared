import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Theme, Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction, Form, TextInput, Button, Checkbox } from '@carbon/react';
import { Information, ArrowRight } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../core/providers/AuthProvider';
import { LanguageSelector } from '../components/LanguageSelector/LanguageSelector';
import { useResource } from '../core/providers/ResourceProvider';
import './Login.scss';

const ShellLogin = (props) => {
  const { t } = useTranslation();
  const { isEnabled } = useResource();
  const [state, setState] = useState({
    page: 'userid'
  });
  const [loginError, setLoginError] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const forgotId = () => {
    setState({ ...state, page: 'forgotid' });
  };

  const capturePassword = () => {
    setState({ ...state, page: 'password' });
  };

  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || '/';

  const submitLogin = (data) => {
    setIsSubmitting(true);
    // event.preventDefault();

    let formData = getValues();
    let userId = formData.userId;

    if (formData.rememberId) {
      if (localStorage) {
        localStorage.userId = formData.userId;
      }
    } else {
      localStorage.removeItem('userId');
    }

    auth.signin({ userName: userId, pwd: formData.password }).then((response) => {
      setIsSubmitting(false);
      if (response === undefined) {
        setLoginError(t('shell:login.server_not_reachable'));
      } else if (response.status > 200) {
        setLoginError(response.statusText);
      } else {
        if (response?.data?.authenticated) {
          setLoginError(null);
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 100);
        } else {
          setLoginError(t('shell:login.invalid_user_credentials'));
        }
      }
    });
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      //userId: localStorage?.userId,
      //password: 'password',
      rememberId: true,
      rememberPassword: false
    }
  });

  let loginstate_page;
  if (state.page === 'userid') {
    loginstate_page = (
      <>
        <div className="login-content-holder">
          <div className="title" id="login_title">
            {t('shell:login.logIn')}
          </div>
          <div className="sub-title" id="login_subtitle">
            {t('shell:login.loginHelpMessage')}
          </div>
          <Form data-testid="loginForm" name="login">
            <div className="userId-container">
              <TextInput
                id="login.userId"
                data-testid="userId"
                invalidText={errors.userId?.message}
                invalid={errors.userId ? true : false}
                labelText={t('shell:login.userId')}
                placeholder=""
                {...register('userId', { required: t("shell:form.validations.required", {fieldName: t('shell:login.userId')}), minLength: { value: 3, message: t("shell:form.validations.minLength", {fieldName: t('shell:login.userId'), count: 3})}, maxLength: { value: 50, message: t("shell:form.validations.maxLength", {fieldName: t('shell:login.userId'), count: 50})} })}
              />
              {isEnabled('LOGIN.FORGOT_ID') && (
                <div className="forgot-link">
                  <a id="forget_id_title" onClick={forgotId}>
                    {t('shell:login.forgot_id_link')}
                  </a>
                </div>
              )}
            </div>
            <div className="form-btn-container">
              <Button
                data-testid="continue"
                name="continue"
                kind="primary"
                renderIcon={ArrowRight}
                iconDescription={t('shell:login.continue')}
                disabled={!watch("userId") || errors.userId ? true : false}
                tabIndex={0}
                onClick={handleSubmit(capturePassword)}
              >
                {t('shell:login.continue')}
              </Button>
            </div>
            <div className="form-remember-container">
              <Checkbox labelText={t('shell:login.remember_id')} id="rememberId" {...register('rememberId')} />
              <span className="information-holder">
                <Information size="16" />
              </span>
            </div>
          </Form>
        </div>
      </>
    );
  } else if (state.page === 'password') {
    loginstate_page = (
      <>
        <div className="login-content-holder">
          <div className="title" id="login_title">
            {t('shell:login.logIn')}
          </div>
          <div className="sub-title" id="login_subtitle">
            {t('shell:login.passwordHelpMessage', { userId: getValues('userId') })}
            <a
              onClick={() => {
                setState({ ...state, page: 'userid' });
              }}
            >
              {' '}
              {t('shell:login.notYou')}
            </a>
          </div>
          {loginError && <div className="notification-container">{loginError}</div>}
          <Form data-testid="loginForm" name="login">
            <div className="password-container">
              <TextInput.PasswordInput
                id="login.password"
                data-testid="password"
                minLength="8"
                invalidText={errors.password?.message}
                invalid={errors.password ? true : false}
                labelText={t('shell:login.password')}
                placeholder=""
                hidePasswordLabel={t('shell:login.togglePasswordOn')}
                showPasswordLabel={t('shell:login.togglePasswordOff')}
                {...register('password', { required: t("shell:form.validations.required", {fieldName: t('shell:login.password')}), minLength: { value: 8, message: t("shell:form.validations.minLength", {fieldName: t('shell:login.password'), count: 8})}, maxLength: { value: 15, message: t("shell:form.validations.maxLength", {fieldName: t('shell:login.password'), count: 15})} })}
              />
              {isEnabled('LOGIN.FORGOT_PASSWORD') && (
                <div className="forgot-link">
                  <a
                    id="forget_password_title"
                    onClick={() => {
                      setState({ ...state, page: 'forgotpassword' });
                    }}
                  >
                    {t('shell:login.forgot_password_link')}
                  </a>
                </div>
              )}
            </div>
            <div className="form-btn-container">
              <Button data-testid="login" name="login" kind="primary" disabled={!watch("password") || isSubmitting || errors.password ? true : false} tabIndex={0} type="button" onClick={submitLogin}>
                {t('shell:login.login_btn')}
              </Button>
            </div>
            <div className="form-remember-container">
              <Checkbox labelText={t('shell:login.remember_password')} id="rememberPassword" {...register('rememberPassword')} />
              <span className="information-holder">
                <Information size="16" />
              </span>
            </div>
          </Form>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container">
        <Theme theme="g100">
          <Header aria-label={t('productName')}>
            <HeaderName href="#" prefix={t('appPrefix')}>
              {t('appName')}
            </HeaderName>
            <HeaderGlobalBar>
              <HeaderGlobalAction aria-label="Language Chooser" className="language-chooser" style={{ width: 'auto' }} onClick={() => {}}>
                <LanguageSelector></LanguageSelector>
              </HeaderGlobalAction>
            </HeaderGlobalBar>
          </Header>
        </Theme>
        <div className="login-page-content">
          <div className="branding-content-container">
            <div className="branding-name">
              <div className="greeting">Welcome to</div>
              <div className="product-title">IBM Sterling File Gateway</div>
            </div>
          </div>
          <Theme className="login-container" theme="g10">
            {loginstate_page}
          </Theme>
        </div>
      </div>
    </>
  );
};

export { ShellLogin };
