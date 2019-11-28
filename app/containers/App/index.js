/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React, { memo, useState } from 'react';
import { Helmet } from 'react-helmet';
// import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import HomePage from '../HomePage/Loadable';
import NotFoundPage from '../NotFoundPage/Loadable';
import AllPosts from '../AllPosts/Loadable';
import LoginPage from '../LoginPage/Loadable';
import Layout1 from '../../components/layouts/layout1/Layout1';
import Layout2 from '../../components/layouts/layout2/Layout2';
import { makeSelectUserToken } from './selectors';
import PrivateRoute from './PrivateRoute';
import { AppContext } from '../context/AppContext';

const App = () => {
  const [authTokens, setAuthTokens] = useState();

  const setTokens = data => {
    // localStorage.setItem('tokens', JSON.stringify(data));
    setAuthTokens(data);
  };

  return (
    <div>
      <AppContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <React.Fragment>
          <CssBaseline />
          <main>
            <div>
              <Helmet
                titleTemplate="%s - React.js Boilerplate"
                defaultTitle="React.js Boilerplate"
              >
                <meta
                  name="description"
                  content="A React.js Boilerplate application"
                />
              </Helmet>

              <Switch>
                <Route exact path="/" component={LoginPage} />
                <Route exact path="/login" component={LoginPage} />
                <Layout1>
                  <PrivateRoute path="/dashboard" component={HomePage} />
                  <PrivateRoute path="/posts" component={AllPosts} />
                  {/* <PrivateRoute path="/admins" component={AdminsPage} /> */}
                </Layout1>
                <Route path="" component={NotFoundPage} />
              </Switch>
            </div>
          </main>
        </React.Fragment>
      </AppContext.Provider>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({});

function mapDispatchToProps(dispatch) {
  return {
    // getUserStatusAction: () => dispatch(getUserStatus()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(App);
