import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the createRoot function
import { Provider } from 'react-redux';
import App from './App';
import './styles.css';
import store from './Store';
import { StyledEngineProvider } from '@mui/material/styles';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </Provider>
);
