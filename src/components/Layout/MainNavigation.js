import React, { useContext } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../store/AuthContext";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const userIsLoged = authCtx.userIsLoged;

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!userIsLoged && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
          {userIsLoged && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {userIsLoged && (
            <li>
              <button onClick={authCtx.logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
