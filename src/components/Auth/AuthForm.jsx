import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";

import AuthContext from "../store/AuthContext";

import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const inputEmailRef = useRef();
  const inputPasswordRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitFormHandler = (event) => {
    event.preventDefault();

    authenticationHandler();
  };

  const authenticationHandler = () => {
    const urlSignIn =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC4rLhoSI40S11prF8yvEWmQRBp_Zxwp_A";

    const urlLogin =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC4rLhoSI40S11prF8yvEWmQRBp_Zxwp_A";

    const inputEmailValue = inputEmailRef.current.value;
    const inputPasswordValue = inputPasswordRef.current.value;

    if (isLogin) {
      httpSendHandler(urlLogin, inputEmailValue, inputPasswordValue);
      console.log("logowanie");
    } else {
      httpSendHandler(urlSignIn, inputEmailValue, inputPasswordValue);
      console.log("rejestracja");
    }
  };

  const httpSendHandler = async (url, inputEmail, inputPass) => {
    setIsLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: inputEmail,
          password: inputPass,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);

      const data = await response.json();
      const userToken = data.idToken;
      const expireTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)));

      if (response.ok) {
        history.replace('/');
        const dataToContext = authCtx.loginHandler(userToken, expireTime.toISOString());
        return dataToContext;
      } else {
        let errorMsg = "Something went wrong";
        if (data && data.error && data.error.message) {
          errorMsg = data.error.message;
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitFormHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={inputEmailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={inputPasswordRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button type="submit">
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
          {isLoading && <p>Loading...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
