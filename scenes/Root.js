// @flow
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import { Helmet } from 'react-helmet';
import { Select, Authorizing } from '../components';
import auth from '../lib/auth';
import theme from '../lib/theme';

const BodyStyles = createGlobalStyle`
body {
    margin: 0px;
    height: 100vh;
}
${normalize()}`;

const Root = () => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <Helmet>
        <title>Vigilant Bassoon 🎧</title>
      </Helmet>
      <BodyStyles />
      {auth.authorizingService ? <Authorizing /> : <Select />}
    </React.Fragment>
  </ThemeProvider>
);

export default Root;
