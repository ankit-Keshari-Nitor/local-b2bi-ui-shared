import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Theme, Header, HeaderName, Form, TextInput, Button, Checkbox } from '@carbon/react';
import { Information, ArrowRight } from '@carbon/icons-react';
import { useTranslation } from 'react-i18next';
import appConfigData from '../../appConfig.json';
import './Login.scss';

const Login = (props) => {
  const { t } = useTranslation();

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
    setIsSubmitting(false);
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
      rememberId: true,
      rememberPassword: false
    }
  });

  const submitLoginForm = () => {
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
  };

  let loginstate_page;
  if (state.page === 'userid') {
    loginstate_page = (
      <>
        <div className="login-content-holder">
          <div className="title" id="login_title">
            {t('login:login.logIn')}
          </div>
          <div className="sub-title" id="login_subtitle">
            {t('login:login.loginCreateMessage')} <a id="create">{t('login:login.createId')}</a>
          </div>
          <Form data-testid="loginForm" name="login">
            <div className="userId-container">
              <TextInput
                id="login.userId"
                data-testid="userId"
                invalidText={errors.userId?.message}
                invalid={errors.userId ? true : false}
                labelText={t('login:login.userId')}
                placeholder=""
                {...register('userId', {
                  required: t('login:form.validations.required', { fieldName: t('login:login.userId') })
                })}
              />
              <div className="forgot-link">
                <a id="forget_id_title" onClick={forgotId}>
                  {t('login:login.forgot_id_link')}
                </a>
              </div>
            </div>
            <div className="form-btn-container">
              <Button
                data-testid="continue"
                name="continue"
                kind="primary"
                renderIcon={ArrowRight}
                iconDescription={t('login:login.continue')}
                disabled={!watch('userId') || errors.userId ? true : false}
                tabIndex={0}
                onClick={handleSubmit(capturePassword)}
              >
                {t('login:login.continue')}
              </Button>
            </div>
            <div className="form-remember-container">
              <Checkbox labelText={t('login:login.remember_id')} id="rememberId" {...register('rememberId')} />
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
            {t('login:login.logIn')}
          </div>
          <div className="sub-title" id="login_subtitle">
            {t('login:login.passwordHelpMessage', { userId: getValues('userId') })}
            <a
              onClick={() => {
                setState({ ...state, page: 'userid' });
              }}
            >
              {' '}
              {t('login:login.notYou')}
            </a>
          </div>
          {loginError && <div className="notification-container">{loginError}</div>}
          <Form data-testid="loginForm" name="login" action={appConfigData.loginSubmitUrl} method="Post" onSubmit={submitLoginForm}>
            <div className="password-container">
              <TextInput type="hidden" name="userId" value={getValues('userId')} />
              <TextInput.PasswordInput
                id="login.password"
                data-testid="password"
                invalidText={errors.password?.message}
                invalid={errors.password ? true : false}
                labelText={t('login:login.password')}
                placeholder=""
                hidePasswordLabel={t('login:login.togglePasswordOn')}
                showPasswordLabel={t('login:login.togglePasswordOff')}
                {...register('password', {
                  required: t('login:form.validations.required', { fieldName: t('login:login.password') })
                })}
              />

              <div className="forgot-link">
                <a
                  id="forget_password_title"
                  onClick={() => {
                    setState({ ...state, page: 'forgotpassword' });
                  }}
                >
                  {t('login:login.forgot_password_link')}
                </a>
              </div>
            </div>
            <div className="form-btn-container">
              <Button data-testid="login" name="login" kind="primary" disabled={!watch('password') || isSubmitting || errors.password ? true : false} tabIndex={0} type="submit">
                {t('login:login.login_btn')}
              </Button>
            </div>
            <div className="form-remember-container">
              <Checkbox labelText={t('login:login.remember_password')} id="rememberPassword" {...register('rememberPassword')} />
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
          </Header>
        </Theme>
        <div className="login-page-content">
          <div className="branding-content-container" style={appConfigData.backgroundStyle}>
            <div className="branding-name">
              <div className="greeting">{t('login:login.welcome_message')}</div>
              <div className="product-title">{t('appTitle')}</div>
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

export default Login;
