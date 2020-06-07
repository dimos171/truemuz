import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { AzureAD } from 'react-aad-msal';

import App from './components/App';
import './shared/globals.scss';

import { authProvider } from './services/authProvider';

ReactDOM.render(
  <AzureAD provider={authProvider} forceLogin={true}>
    <Router>
      <App />
    </Router>,
  </AzureAD>,
  document.getElementById('app'),
);

module.hot.accept();
