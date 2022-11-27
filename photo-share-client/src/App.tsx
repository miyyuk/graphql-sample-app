import React, { Fragment } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { gql } from '@apollo/client';
// @ts-expect-error TS(6142): Module './Users' was resolved to '/Users/miyukano/... Remove this comment to see the full error message
import Users from './Users';
// @ts-expect-error TS(6142): Module './Photos' was resolved to '/Users/miyukano... Remove this comment to see the full error message
import Photos from './Photos';
// @ts-expect-error TS(6142): Module './AuthorizedUser' was resolved to '/Users/... Remove this comment to see the full error message
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
  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
  <BrowserRouter>
    {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
    <Switch>
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
      <Route
        exact
        path="/"
        component={() =>
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <Fragment>
            {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <AuthorizedUser />
            {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Users />
            {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <Photos />
          </Fragment>
        }
      />
      {/* @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
      <Route
        component={({
          location
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        }: any) => {<h1>"{location.pathname}" not found</h1>}}
      />
    </Switch>
  </BrowserRouter>

export default App;
