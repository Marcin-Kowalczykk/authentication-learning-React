import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import AuthContext from "./components/store/AuthContext";
import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

function App() {
  const authCtx = useContext(AuthContext);
  const userIsLoged = authCtx.userIsLoged;

  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!userIsLoged && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        {userIsLoged && (
          <Route path="/profile">
            <UserProfile />
          </Route>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
