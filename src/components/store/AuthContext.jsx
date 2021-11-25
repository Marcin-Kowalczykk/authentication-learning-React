import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";


let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  userIsLoged: false,
  loginHandler: () => {},
  logoutHandler: () => {},
});

const calculateRemainingTime = (timeFromForm) => {
  const currentTime = new Date().getTime();
  const expiredTime = new Date(timeFromForm).getTime();

  const remainingTime = expiredTime - currentTime;

  return remainingTime;
};

const getExistingToken = () => {
  const tokenExistedInStorage = localStorage.getItem("authToken");
  const expiredTimeExistedInStorage = localStorage.getItem("expireTime");

  const remainingTime = calculateRemainingTime(expiredTimeExistedInStorage);

  if (expiredTimeExistedInStorage <= 6000) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expireTime");
    return null;
  }

  return {
    token: tokenExistedInStorage,
    expiredTime: remainingTime,
  };
};

export const AuthProvider = ({ children }) => {
  const history = useHistory();

  const tokenExist = getExistingToken();
  let initialToken;
  if (tokenExist) {
    initialToken = tokenExist.token;
  }

  const [token, setToken] = useState(initialToken);

  const userIsLoged = !!token; // jesli istnieje token to daje true

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("expireTime");
    history.replace("/");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, [history]);

  const loginHandler = (tokenFromForm, expiredTimeFromForm) => {
    setToken(tokenFromForm);
    localStorage.setItem("authToken", tokenFromForm);
    localStorage.setItem("expireTime", expiredTimeFromForm);

    const timeToEndSession = calculateRemainingTime(expiredTimeFromForm);

    logoutTimer = setTimeout(logoutHandler, timeToEndSession);
  };

  useEffect(() => {
    if (tokenExist) {
      console.log(`remaining time : ${tokenExist.expiredTime}`);
      logoutTimer = setTimeout(logoutHandler, tokenExist.expiredTime);
    }
  }, [tokenExist, logoutHandler]);

  const authContext = {
    token: token,
    userIsLoged: userIsLoged,
    loginHandler: loginHandler,
    logoutHandler: logoutHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
