import { useState, useEffect } from 'react';
import { Theme, Header, HeaderName, HeaderGlobalBar, HeaderGlobalAction, Form, TextInput, Button, Checkbox } from '@carbon/react';
import { Information, ArrowRight } from '@carbon/icons-react';
import '../Login1/Login1.scss';
import data from '../../config/data.json';

const Login1 = () => {
  const initialValues = {
    email: '',
    password: ''
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors, formValues, isSubmit]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.email) {
      errors.email = 'Email is required!';
    } else if (!regex.test(values.email)) {
      errors.email = 'This is not a valid email format!';
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

  return (
    <>
      <div className="container">
        {Object.keys(formErrors).length === 0 && isSubmit ? <div className="ui message success">Signed in successfully</div> : console.log('Entered Details', formValues)}
        <Theme theme="g100">
          <Header>
            <HeaderName href="#">Product</HeaderName>
          </Header>
        </Theme>
        <div className="login-page-content">
          <div className="branding-content-container">
            <div className="branding-name">
              <div className="greeting">Welcome to</div>
              <div className="product-title">PEM</div>
            </div>
          </div>
          <Theme className="login-container" theme="g10">
            <div className="login-content-holder">
              <div className="title" id="login_title">
                {data.title}
              </div>
              <Form data-testid="loginForm" name="login">
                <div className="userId-container">
                  <TextInput id="userid" type="text" name="email" placeholder="Email" labelText="UserId" value={formValues.email} onChange={handleChange} />
                  <p>{formErrors.email}</p>
                </div>
                <div className="password-container">
                  <TextInput type="password" id="password" name="password" placeholder="Password" labelText="Password" value={formValues.password} onChange={handleChange} />
                  <p>{formErrors.password}</p>
                </div>
                <div className="form-btn-container">
                  <Button data-testid="login" name="login" kind="primary" type="button" tabIndex={0} onClick={handleSubmit}>
                    Log In
                  </Button>
                </div>
              </Form>
            </div>
          </Theme>
        </div>
      </div>
    </>
  );
};

export default Login1;
