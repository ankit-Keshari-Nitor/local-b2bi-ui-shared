import React, { useState, useEffect, useMemo } from 'react';
import axios from "axios";
import { HttpService } from '../services/HttpService';
import { useEnvironment } from './EnvironmentProvider';
const AuthContext = React.createContext();

const AuthProvider = ({ type, config, children }) => {
  // let [user, setUser] = useLocalStorage("_session",null);

  if (type === 'BASIC' || type === undefined) {
    const loggedInUser = window.sessionStorage.getItem('_session') || JSON.stringify({ userName: '' });

    const [userAuth, setUserAuth] = useState(JSON.parse(loggedInUser));

    const { getEnvironmentValue } = useEnvironment();

    const signin = (newUser) => {
      return HttpService.send({
        url: getEnvironmentValue('LOGIN_URL'), // LOGIN_APIURL
        method: 'post',
        data: newUser,
        baseURL: window.sfgIdentityBaseUrl
      }).then(
        (response) => {
          //setUser(newUser);
          if (response?.data?.authenticated) {
            setUserAuth(response?.data);
            window.sessionStorage.setItem('_session', JSON.stringify(response?.data));
          }
          return response;
        },
        (rejectedResponse) => {
          console.error(rejectedResponse);
          return rejectedResponse.response;
        }
      );
    };

    const signout = (callback) => {
      //return fakeAuthProvider.signout(() => {
      setUserAuth({});
      window.sessionStorage.clear();
      setTimeout(callback, 100);
      //});
    };

    let value = { user: userAuth, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  } else if (type === 'JWT') {
    // State to hold the authentication token
    const [token, setToken_] = useState(localStorage.getItem('token'));

    // Function to set the authentication token
    const setToken = (newToken) => {
      setToken_(newToken);
    };

    useEffect(() => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        localStorage.setItem('token', token);
      } else {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
      }
    }, [token]);

    // Memoized value of the authentication context
    const contextValue = useMemo(
      () => ({
        token,
        setToken
      }),
      [token]
    );

    // Provide the authentication context to the children components
    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
  }
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export { AuthProvider, AuthContext, useAuth };
