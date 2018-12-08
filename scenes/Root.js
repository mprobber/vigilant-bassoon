// @flow
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { normalize } from 'polished';
import Select from './Select';
import Authorizing from './Authorizing';
import auth from '../lib/auth';
import theme from '../lib/theme';

const BodyStyles = createGlobalStyle`
body {
    margin: 0px;
}
${normalize()}`;

const Root = () => (
  <ThemeProvider theme={theme}>
    <React.Fragment>
      <BodyStyles />
      {auth.authorizingService ? <Authorizing /> : <Select />}
    </React.Fragment>
  </ThemeProvider>
);

export default Root;
