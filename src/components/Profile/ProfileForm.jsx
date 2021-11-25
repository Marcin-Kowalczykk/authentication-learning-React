import React, { useRef, useContext, useState } from "react";

import classes from "./ProfileForm.module.css";

import AuthContext from "../store/AuthContext";

const ProfileForm = () => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [feedBack, setFeedback] = useState('');
  const newPasswordRef = useRef();

  const changePasswordHandler = (event) => {
    event.preventDefault();

    const newPassword = newPasswordRef.current.value;

    newPasswordRequest(newPassword);
    console.log(newPassword);
  };

  const newPasswordRequest = async (password) => {
    setIsLoading(true);
    setFeedback('');

    const urlChangePassword =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyC4rLhoSI40S11prF8yvEWmQRBp_Zxwp_A";

    try {
      const response = await fetch(urlChangePassword, {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: password,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setIsLoading(false);

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = "Something went wrong";
        if (data && data.error && data.error.message) {
          errorMsg = data.error.message;
        }
        throw new Error(errorMsg);
      } else {
        setFeedback('password changed');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordRef} />
      </div>
      <div className={classes.action}>
        {isLoading && <p>loading ...</p>}
        <p>{feedBack}</p>
        <button type="submit">Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
