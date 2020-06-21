import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";

import App from './components/App';
import './shared/globals.scss';
import './shared/custom-media-breakpoints.scss';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app')
);

module.hot.accept();
