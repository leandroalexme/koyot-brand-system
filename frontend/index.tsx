import './vertex-ai-proxy-interceptor.js';
import './systems/koyot/styles.css';
import './systems/quartz/styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const win = window as unknown as { __koyotRoot?: ReactDOM.Root };
if (!win.__koyotRoot) {
  win.__koyotRoot = ReactDOM.createRoot(rootElement);
}

win.__koyotRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
