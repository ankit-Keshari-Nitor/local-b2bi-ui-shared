import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Theme, Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction, Form, TextInput, Button, Checkbox } from '@carbon/react';
import { Information, ArrowRight, CostTotal } from '@carbon/icons-react';
import './Login1.scss';

const Login1 = (props) => {

  const initialValues = {userId: '', password: ''};
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, setState] = useState({
    page: 'userid'
  });

  const handleChange = (e) => {
    const { name, value, userId } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const submitLogin = (data) => {
    setIsSubmitting(true);
    setFormErrors(validate(formValues));
    // event.preventDefault();
    let formData = getValues();

    if (formData.rememberId) {
      if (localStorage) {
        localStorage.userId = formValues.userId;
      }
    } else {
      localStorage.removeItem('userId');
    }
    console.log("Form",formValues);
  };

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      console.log("val",formValues);
    }
  }, [formErrors, formValues, isSubmitting]);

 const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
   
    if (!values.userId) {
      errors.userId = 'User Id is required!';
    } else if (!regex.test(values.email)) {
      errors.userId = 'This is not a valid email format!';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 4) {
      errors.password = 'Password must be more than 4 characters';
    } else if (values.password.length > 10) {
      errors.password = 'Password cannot exceed more than 10 characters';
    }
    return errors;
  };

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
    getValues
  } = useForm({
    mode: 'onChange',
    defaultValues: {
     // userId: localStorage.userId,
      //password: formValues.password,
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
           Log in
          </div>
          <div className="sub-title" id="login_subtitle">
           Don't have an account? <a href="#">Create</a>
          </div>
          <Form data-testid="loginForm" name="login">
            <div className="userId-container">
              <TextInput
                id="userId"
                labelText="User Id"
                placeholder="username@test.com"
                name="userId"
                value={formValues.userId}
                onChange={handleChange}
              />
              <p>{formErrors.userId}</p>
                <div className="forgot-link">
                  <a id="forget_id_title" onClick={forgotId}>
                    Forgot ID?
                  </a>
                </div>
            
            </div>
            <div className="form-btn-container">
              <Button
                name="continue"
                kind="primary"
                renderIcon={ArrowRight}
                iconDescription="continue"
                disabled={!formValues.userId ? true : false}
                tabIndex={0}
                onClick={handleSubmit(capturePassword)}
              >
                Continue
              </Button>
            </div>
            <div className="form-remember-container">
              <Checkbox labelText="Remember ID" id="rememberId" {...register('rememberId')} />
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
            Log in
          </div>
          <div className="sub-title" id="login_subtitle">
          Logging in as {formValues.userId}.
            <a
              onClick={() => {
                setState({ ...state, page: 'userid' });
              }}
            >
              {' '}
              <a href="#">Not you?</a>
            </a>
          </div>
          <Form data-testid="loginForm" name="login">
            <div className="password-container">
              <TextInput.PasswordInput
                id="password"
                labelText="Password"
                hidePasswordLabel=""
                showPasswordLabel=""
                name="password"
                value={formValues.password}
                onChange={handleChange}
              />
              <p>{formErrors.password}</p>
                <div className="forgot-link">
                  <a
                    id="forget_password_title"
                    onClick={() => {
                      setState({ ...state, page: 'forgotpassword' });
                    }}
                  >
                    Forgot password ?
                  </a>
                </div>
            </div>
            <div className="form-btn-container">
              <Button
                name="login"
                kind="primary"
                disabled={isSubmitting || !formValues.password ? true : false}
                type="button"
                onClick={submitLogin}
              >
              Log in
              </Button>
            </div>
            <div className="form-remember-container">
              <Checkbox labelText="Remember Password" id="rememberPassword" {...register('rememberPassword')} />
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
          <Header aria-label="IBM Product">
            <HeaderName>
                Login Application
            </HeaderName>
          </Header>
        </Theme>
        <div className="login-page-content">
          <div className="branding-content-container">
            <div className="branding-name">
              <div className="greeting">Welcome to</div>
              <div className="product-title">Login Application</div>
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

export default Login1;