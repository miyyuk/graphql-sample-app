import React, { Fragment } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { gql } from '@apollo/client';
import Users from './Users';
import Photos from './Photos';
import AuthorizedUser from './AuthorizedUser';

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    totalPhotos
    allUsers { ...userInfo }
    me { ...userInfo }
    allPhotos {
      id
      name
      url
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`

const App = () =>
  <BrowserRouter>
    <Switch>
      <Route
        exact
        path="/"
        component={() =>
          <Fragment>
            <AuthorizedUser />
            <Users />
            <Photos />
          </Fragment>
        }
      />
      <Route
        component={({
          location
        }: any) => {<h1>"{location.pathname}" not found</h1>}}
      />
    </Switch>
  </BrowserRouter>

export default App;
