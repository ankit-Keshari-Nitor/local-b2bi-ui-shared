import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ handler, children }) => {
  let loggedInUser = window.sessionStorage.getItem('_session') || JSON.stringify({ userName: '', authenticated: false });
  loggedInUser = JSON.parse(loggedInUser);

  const [isAuthenticated, setIsAuthenticated] = useState(loggedInUser.authenticated);

  const [userAuth, setUserAuth] = useState(loggedInUser);

  const [preLoginUserData, setPreLoginUserData] = useState(null);

  const [loginUserData, setLoginUserData] = useState(null);

  const [postLoginUserData, setPostLoginUserData] = useState(null);

  const [preLogoutUserData, setPreLogoutUserData] = useState(null);

  const [logoutUserData, setLogoutUserData] = useState(null);

  const [postLogoutUserData, setPostLogoutUserData] = useState(null);

  const [preLoginUserError, setPreLoginUserError] = useState(null);

  const [loginUserError, setLoginUserError] = useState(null);

  const [postLoginUserError, setPostLoginUserError] = useState(null);

  const [preLogoutUserError, setPreLogoutUserError] = useState(null);

  const [logoutUserError, setLogoutUserError] = useState(null);

  const [postLogoutUserError, setPostLogoutUserError] = useState(null);

  const login = (loginUser) => {
    return new Promise((resolve, reject) => {
      let preLoginUserData, loginUserData, postLoginUserData;

      // Reset any previous login errors
      setLoginUserError(null);

      Promise.resolve()
        .then(() => {
          if (typeof handler.onPreAuthenticate === 'function') {
            return handler.onPreAuthenticate(loginUser);
          } else {
            return null;
          }
        })
        .catch((error) => {
          // Handle pre-authentication error
          setPreLoginUserError(error.message);
          reject(error); // Reject the promise
        })
        .then((preData) => {
          preLoginUserData = preData;
          if (typeof handler.onAuthenticate === 'function') {
            return handler.onAuthenticate(loginUser, preData);
          } else {
            return null;
          }
        })
        .catch((error) => {
          // Handle authentication error
          setLoginUserError(error.message);
          reject(error); // Reject the promise
        })
        .then((userData) => {
          loginUserData = userData;
          loginUserData.lastLoggedIn = new Date(Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: undefined,
            hour12: true
          })
          if (typeof handler.onPostAuthenticate === 'function') {
            return handler.onPostAuthenticate(loginUser, preLoginUserData, userData);
          } else {
            return null;
          }
        })
        .catch((error) => {
          // Handle post-authentication error
          setPostLoginUserError(error.message);
          reject(error); // Reject the promise
        })
        .then((postData) => {
          postLoginUserData = postData;

          // Update states after successful login
          setPreLoginUserData(preLoginUserData);
          setLoginUserData(loginUserData);
          setPostLoginUserData(postLoginUserData);

          // Update authentication status and store user data in session storage
          setIsAuthenticated(true);
          setUserAuth(loginUserData);

          window.sessionStorage.setItem('_session', !!loginUserData ? JSON.stringify(loginUserData) : '');

          // Resolve the promise with the login user data
          resolve(loginUserData);
        })
        .catch((error) => {
          // Handle any other unexpected error
          reject(error);
        });
    });
  };

  const logout = () => {
    return new Promise((resolve, reject) => {
      let preLogoutUserData, logoutUserData, postLogoutUserData;

      // Reset any previous logout errors
      setLogoutUserError(null);

      Promise.resolve()
        .then(() => {
          if (typeof handler.onPreLogout === 'function') {
            return handler.onPreLogout();
          } else {
            return null;
          }
        })
        .catch((error) => {
          // Handle pre-logout error
          setPreLogoutUserError(error.message);
          reject(error); // Reject the promise
        })
        .then((preData) => {
          preLogoutUserData = preData;
          if (typeof handler.logout === 'function') {
            return handler.logout();
          } else {
            return null;
          }
        })
        .catch((error) => {
          // Handle logout error
          setLogoutUserError(error.message);
          reject(error); // Reject the promise
        })
        .then((userData) => {
          logoutUserData = userData;
          if (typeof handler.onPostLogout === 'function') {
            return handler.onPostLogout(userData);
          } else {
            return null;
          }
        })
        .catch((error) => {
          // Handle post-logout error
          setPostLogoutUserError(error.message);
          reject(error); // Reject the promise
        })
        .then((postData) => {
          postLogoutUserData = postData;

          // Update states after successful logout
          setPreLogoutUserData(preLogoutUserData);
          setLogoutUserData(logoutUserData);
          setPostLogoutUserData(postLogoutUserData);

          // Update authentication status and remove user data from session storage
          setIsAuthenticated(false);
          setUserAuth(null);
          window.sessionStorage.removeItem('_session');

          // Resolve the promise
          resolve();
        })
        .catch((error) => {
          // Handle any other unexpected error
          reject(error);
        });
    });
  };
  // Value to be provided by AuthContext
  const authContextValue = {
    isAuthenticated,
    user: userAuth,
    preLoginUserData,
    loginUserData,
    postLoginUserData,
    preLogoutUserData,
    logoutUserData,
    postLogoutUserData,
    preLoginUserError,
    loginUserError,
    postLoginUserError,
    preLogoutUserError,
    logoutUserError,
    postLogoutUserError,
    login,
    logout
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
