import { Redirect, Route } from "react-router-dom";
import React from 'react';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ component: Component, ...rest }) => {

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("userInfo") && Object.entries(userInfo).length > 0 ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
};

export default ProtectedRoute;
