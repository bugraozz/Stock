
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RoleProvider } from './Pages/Role';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <RoleProvider>
          <App />
      </RoleProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
