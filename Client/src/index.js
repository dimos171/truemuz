import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";

import App from './components/App';
import './shared/globals.scss';

const title = 'React with Webpack and Babel';

ReactDOM.render(
  <Router>
    <App title={title} />
  </Router>,
  document.getElementById('app')
);

module.hot.accept();
